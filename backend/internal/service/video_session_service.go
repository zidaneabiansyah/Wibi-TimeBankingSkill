package service
 
import (
	"errors"
	"fmt"
	"time"
 
	"github.com/timebankingskill/backend/internal/config"
	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/models"
	"github.com/timebankingskill/backend/internal/repository"
)
 
// VideoSessionService handles video call business logic
type VideoSessionService struct {
	videoSessionRepo *repository.VideoSessionRepository
	sessionRepo      *repository.SessionRepository
	userRepo         *repository.UserRepository
	notificationSvc  *NotificationService
	jitsiSvc         *JitsiService
	config           *config.Config
}
 
// NewVideoSessionServiceWithNotification creates a new video session service
func NewVideoSessionServiceWithNotification(
	videoSessionRepo *repository.VideoSessionRepository,
	sessionRepo *repository.SessionRepository,
	userRepo *repository.UserRepository,
	notificationSvc *NotificationService,
	jitsiSvc *JitsiService,
	cfg *config.Config,
) *VideoSessionService {
	return &VideoSessionService{
		videoSessionRepo: videoSessionRepo,
		sessionRepo:      sessionRepo,
		userRepo:         userRepo,
		notificationSvc:  notificationSvc,
		jitsiSvc:         jitsiSvc,
		config:           cfg,
	}
}
 
// StartVideoSession starts a new video call for an existing session
func (s *VideoSessionService) StartVideoSession(userID uint, sessionID uint) (*dto.StartVideoSessionResponse, error) {
	session, err := s.sessionRepo.GetByID(sessionID)
	if err != nil {
		return nil, err
	}
 
	// Verify user is part of session
	if session.TeacherID != userID && session.StudentID != userID {
		return nil, errors.New("you are not authorized to start this video session")
	}

    var roomID string
    var videoSession *models.VideoSession

	// Check if there is already an active video session
    existingSession, err := s.videoSessionRepo.GetActiveVideoSession(sessionID)
    if err == nil && existingSession != nil {
        // Reuse existing session
        roomID = existingSession.RoomID
        videoSession = existingSession
    } else {
        // Create new session
        // Room ID is typically a combination of session ID and a unique string
        roomID = fmt.Sprintf("wibi-session-%d-%d", sessionID, time.Now().Unix())
    
        now := time.Now()
        newSession := &models.VideoSession{
            SessionID: sessionID,
            RoomID:    roomID,
            StartedAt: &now,
            Status:    "active",
        }
    
        videoSession, err = s.videoSessionRepo.CreateVideoSession(newSession)
        if err != nil {
            return nil, err
        }
    }

	// Generate Jitsi URL
	jitsiURL := fmt.Sprintf("%s/%s", s.config.Jitsi.BaseURL, roomID)
    
    // Generate JWT Token
    user, err := s.userRepo.GetByID(userID)
    if err != nil {
        return nil, err
    }
    
    // Teacher is moderator
    isModerator := session.TeacherID == userID
    var token string
    if s.jitsiSvc != nil {
        token, err = s.jitsiSvc.GenerateToken(user, roomID, isModerator)
        if err != nil {
            // Log error but proceed without token (might work for free tier/testing if disabled)
            // Or fail if strict. Let's log and return error for now as JaaS requires it.
            fmt.Printf("Failed to generate Jitsi token: %v\n", err)
            // For now preventing failure if key is missing, but ideally should return error
            if s.config.Jitsi.PrivateKey != "" {
                return nil, fmt.Errorf("failed to generate video token: %w", err)
            }
        }
    } else {
        fmt.Println("⚠️ Jitsi service not initialized, proceeding without token")
    }

	return &dto.StartVideoSessionResponse{
		ID:       videoSession.ID,
		RoomID:   videoSession.RoomID,
		JitsiURL: jitsiURL,
		Status:   videoSession.Status,
		Token:    token,
	}, nil
}
 
// EndVideoSession marks a video session as completed
func (s *VideoSessionService) EndVideoSession(userID uint, sessionID uint, duration int) (*dto.VideoSessionResponse, error) {
	videoSession, err := s.videoSessionRepo.GetActiveVideoSession(sessionID)
	if err != nil {
		return nil, err
	}
 
	now := time.Now()
	videoSession.EndedAt = &now
	videoSession.Duration = duration
	videoSession.Status = "completed"
 
	updated, err := s.videoSessionRepo.UpdateVideoSession(videoSession.ID, videoSession)
	if err != nil {
		return nil, err
	}
 
	return &dto.VideoSessionResponse{
		ID:               updated.ID,
		SessionID:        updated.SessionID,
		RoomID:           updated.RoomID,
		StartedAt:        updated.StartedAt,
		EndedAt:          updated.EndedAt,
		Duration:         updated.Duration,
		ParticipantCount: updated.ParticipantCount,
		Status:           updated.Status,
		CreatedAt:        updated.CreatedAt,
		UpdatedAt:        updated.UpdatedAt,
	}, nil
}
 
// GetVideoSessionStatus retrieves status of a video call
func (s *VideoSessionService) GetVideoSessionStatus(userID uint, sessionID uint) (*dto.VideoSessionResponse, error) {
	videoSession, err := s.videoSessionRepo.GetVideoSessionBySessionID(sessionID)
	if err != nil {
		return nil, err
	}
 
	return &dto.VideoSessionResponse{
		ID:               videoSession.ID,
		SessionID:        videoSession.SessionID,
		RoomID:           videoSession.RoomID,
		StartedAt:        videoSession.StartedAt,
		EndedAt:          videoSession.EndedAt,
		Duration:         videoSession.Duration,
		ParticipantCount: videoSession.ParticipantCount,
		Status:           videoSession.Status,
		CreatedAt:        videoSession.CreatedAt,
		UpdatedAt:        videoSession.UpdatedAt,
	}, nil
}
 
// GetVideoHistory returns completed video sessions for a user
func (s *VideoSessionService) GetVideoHistory(userID uint, limit int, offset int) ([]dto.VideoHistoryResponse, int64, error) {
	history, total, err := s.videoSessionRepo.GetUserVideoHistory(userID, limit, offset)
	if err != nil {
		return nil, 0, err
	}
 
	var response []dto.VideoHistoryResponse
	for _, vs := range history {
		partnerName := ""
		if vs.Session != nil {
			if vs.Session.TeacherID == userID {
				// Partner is student
				student, _ := s.userRepo.GetByID(vs.Session.StudentID)
				if student != nil {
					partnerName = student.FullName
				}
			} else {
				// Partner is teacher
				teacher, _ := s.userRepo.GetByID(vs.Session.TeacherID)
				if teacher != nil {
					partnerName = teacher.FullName
				}
			}
		}
 
		response = append(response, dto.VideoHistoryResponse{
			ID:               vs.ID,
			SessionID:        vs.SessionID,
			SkillName:        vs.Session.Title, // Assuming Title is used as skill name reference in session
			PartnerName:      partnerName,
			StartedAt:        vs.StartedAt,
			Duration:         vs.Duration,
			ParticipantCount: vs.ParticipantCount,
			Status:           vs.Status,
		})
	}
 
	return response, total, nil
}
 
// GetVideoStats returns video calling statistics
func (s *VideoSessionService) GetVideoStats(userID uint) (map[string]interface{}, error) {
	return s.videoSessionRepo.GetVideoSessionStats(userID)
}
