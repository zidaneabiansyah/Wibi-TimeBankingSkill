package websocket

import (
	"log"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/timebankingskill/backend/internal/models"
)

// WebRTCMessage represents a signaling message
type WebRTCMessage struct {
	Type      string      `json:"type"`       // "offer", "answer", "candidate", "user_join", "user_leave"
	SessionID uint        `json:"session_id"`
	UserID    uint        `json:"user_id"`
	UserName  string      `json:"user_name"`
	Payload   interface{} `json:"payload,omitempty"`
	Timestamp int64       `json:"timestamp"`
}

// WebRTCClient represents a connected WebRTC signaling client
type WebRTCClient struct {
	SessionID uint
	UserID    uint
	UserName  string
	Conn      *websocket.Conn
	Send      chan *WebRTCMessage
}

// WebRTCHub manages signaling for a session
type WebRTCHub struct {
	SessionID  uint
	Clients    map[*WebRTCClient]bool
	Register   chan *WebRTCClient
	Unregister chan *WebRTCClient
	mu         sync.RWMutex
}

var webrtcHubs = make(map[uint]*WebRTCHub)
var webrtcMutex = sync.RWMutex{}

// GetOrCreateWebRTCHub gets or creates a signaling hub
func GetOrCreateWebRTCHub(sessionID uint) *WebRTCHub {
	webrtcMutex.Lock()
	defer webrtcMutex.Unlock()

	if hub, exists := webrtcHubs[sessionID]; exists {
		return hub
	}

	hub := &WebRTCHub{
		SessionID:  sessionID,
		Clients:    make(map[*WebRTCClient]bool),
		Register:   make(chan *WebRTCClient),
		Unregister: make(chan *WebRTCClient),
	}

	webrtcHubs[sessionID] = hub
	go hub.run()

	return hub
}

func (h *WebRTCHub) run() {
	for {
		select {
		case client := <-h.Register:
			h.mu.Lock()
			
			// First, notify the new client about all existing users
			// This ensures the new user knows who is already in the room
			for existingClient := range h.Clients {
				existingUserMsg := &WebRTCMessage{
					Type:      "user_join",
					SessionID: h.SessionID,
					UserID:    existingClient.UserID,
					UserName:  existingClient.UserName,
					Timestamp: time.Now().UnixMilli(),
				}
				// Send to the new client
				select {
				case client.Send <- existingUserMsg:
					log.Printf("[WebRTC] Notified new user %d about existing user %d", client.UserID, existingClient.UserID)
				default:
					log.Printf("[WebRTC] Failed to notify new user about existing user")
				}
			}
			
			// Add the new client to the room
			h.Clients[client] = true
			h.mu.Unlock()

			// Notify others that a peer joined
			msg := &WebRTCMessage{
				Type:      "user_join",
				SessionID: h.SessionID,
				UserID:    client.UserID,
				UserName:  client.UserName,
				Timestamp: time.Now().UnixMilli(),
			}
			h.broadcastToOthers(client, msg)

		case client := <-h.Unregister:
			h.mu.Lock()
			if _, ok := h.Clients[client]; ok {
				delete(h.Clients, client)
				close(client.Send)
			}
			h.mu.Unlock()

			msg := &WebRTCMessage{
				Type:      "user_leave",
				SessionID: h.SessionID,
				UserID:    client.UserID,
				UserName:  client.UserName,
				Timestamp: time.Now().UnixMilli(),
			}
			h.broadcastToOthers(client, msg)

			if len(h.Clients) == 0 {
				webrtcMutex.Lock()
				delete(webrtcHubs, h.SessionID)
				webrtcMutex.Unlock()
			}
		}
	}
}

func (h *WebRTCHub) broadcastToOthers(sender *WebRTCClient, message *WebRTCMessage) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	for client := range h.Clients {
		if client != sender {
			select {
			case client.Send <- message:
			default:
				log.Printf("WebRTC: Client send channel full for user %d", client.UserID)
			}
		}
	}
}

// HandleWebRTCConnection handles a new signaling connection
func HandleWebRTCConnection(conn *websocket.Conn, sessionID uint, user *models.User) {
	log.Printf("[WebRTC] Starting connection handler for user %d in session %d", user.ID, sessionID)
	hub := GetOrCreateWebRTCHub(sessionID)

	client := &WebRTCClient{
		SessionID: sessionID,
		UserID:    user.ID,
		UserName:  user.FullName,
		Conn:      conn,
		Send:      make(chan *WebRTCMessage, 256),
	}

	log.Printf("[WebRTC] Registering client for user %d", user.ID)
	hub.Register <- client

	go client.readPump(hub)
	go client.writePump()
}

func (c *WebRTCClient) readPump(hub *WebRTCHub) {
	defer func() {
		log.Printf("[WebRTC] readPump ending for user %d", c.UserID)
		hub.Unregister <- c
		c.Conn.Close()
	}()

	c.Conn.SetReadLimit(512 * 1024) // 512KB limit for SDP
	c.Conn.SetReadDeadline(time.Now().Add(300 * time.Second)) 
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(300 * time.Second))
		return nil
	})

	log.Printf("[WebRTC] readPump started for user %d", c.UserID)

	for {
		var msg WebRTCMessage
		err := c.Conn.ReadJSON(&msg)
		if err != nil {
			log.Printf("[WebRTC] readPump error for user %d: %v", c.UserID, err)
			break
		}

		msg.UserID = c.UserID
		msg.UserName = c.UserName
		msg.SessionID = c.SessionID
		msg.Timestamp = time.Now().UnixMilli()

		log.Printf("[WebRTC] Received message type '%s' from user %d", msg.Type, c.UserID)
		hub.broadcastToOthers(c, &msg)
	}
}

func (c *WebRTCClient) writePump() {
	ticker := time.NewTicker(50 * time.Second)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.Send:
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.Conn.WriteJSON(message); err != nil {
				return
			}
		case <-ticker.C:
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
