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
	config           *config.Config
}
 
// NewVideoSessionServiceWithNotification creates a new video session service
func NewVideoSessionServiceWithNotification(
	videoSessionRepo *repository.VideoSessionRepository,
	sessionRepo *repository.SessionRepository,
	userRepo *repository.UserRepository,
	notificationSvc *NotificationService,
	cfg *config.Config,
) *VideoSessionService {
	return &VideoSessionService{
		videoSessionRepo: videoSessionRepo,
		sessionRepo:      sessionRepo,
		userRepo:         userRepo,
		notificationSvc:  notificationSvc,
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

	return &dto.StartVideoSessionResponse{
		ID:       videoSession.ID,
		RoomID:   videoSession.RoomID,
		Status:   videoSession.Status,
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

// StartScreenSharing marks a user as sharing their screen
func (s *VideoSessionService) StartScreenSharing(sessionID uint, userID uint) error {
	// Get the session to verify user is a participant
	session, err := s.sessionRepo.GetByID(sessionID)
	if err != nil {
		return err
	}

	// Verify user is part of session
	if session.TeacherID != userID && session.StudentID != userID {
		return errors.New("you are not authorized to share screen in this session")
	}

	// Get active video session
	videoSession, err := s.videoSessionRepo.GetActiveVideoSession(sessionID)
	if err != nil {
		return errors.New("no active video session found")
	}

	// Check if someone else is already sharing screen
	if videoSession.IsScreenSharing && videoSession.ScreenSharingUserID != nil && *videoSession.ScreenSharingUserID != userID {
		return errors.New("another user is already sharing their screen")
	}

	// Update video session
	videoSession.IsScreenSharing = true
	videoSession.ScreenSharingUserID = &userID

	// Update metadata to track screen sharing history
	if videoSession.Metadata == nil {
		videoSession.Metadata = make(map[string]interface{})
	}

	// Track screen sharing start time in metadata
	now := time.Now()
	screenSharingData := map[string]interface{}{
		"user_id":    userID,
		"started_at": now,
	}

	// Append to screen sharing sessions array
	if sessions, ok := videoSession.Metadata["screen_sharing_sessions"].([]interface{}); ok {
		videoSession.Metadata["screen_sharing_sessions"] = append(sessions, screenSharingData)
	} else {
		videoSession.Metadata["screen_sharing_sessions"] = []interface{}{screenSharingData}
	}

	_, err = s.videoSessionRepo.UpdateVideoSession(videoSession.ID, videoSession)
	return err
}

// StopScreenSharing stops screen sharing for a user
func (s *VideoSessionService) StopScreenSharing(sessionID uint, userID uint) error {
	// Get active video session
	videoSession, err := s.videoSessionRepo.GetActiveVideoSession(sessionID)
	if err != nil {
		return errors.New("no active video session found")
	}

	// Verify this user is the one sharing screen
	if !videoSession.IsScreenSharing || videoSession.ScreenSharingUserID == nil || *videoSession.ScreenSharingUserID != userID {
		return errors.New("you are not currently sharing your screen")
	}

	// Update metadata to record screen sharing duration
	if videoSession.Metadata != nil {
		if sessions, ok := videoSession.Metadata["screen_sharing_sessions"].([]interface{}); ok && len(sessions) > 0 {
			// Update the last session with end time
			lastSession := sessions[len(sessions)-1].(map[string]interface{})
			if startedAt, ok := lastSession["started_at"].(time.Time); ok {
				duration := int(time.Since(startedAt).Seconds())
				lastSession["ended_at"] = time.Now()
				lastSession["duration"] = duration
			}
		}
	}

	// Clear screen sharing status
	videoSession.IsScreenSharing = false
	videoSession.ScreenSharingUserID = nil

	_, err = s.videoSessionRepo.UpdateVideoSession(videoSession.ID, videoSession)
	return err
}

// GetScreenSharingStatus returns current screen sharing status
func (s *VideoSessionService) GetScreenSharingStatus(sessionID uint) (*dto.ScreenSharingStatusResponse, error) {
	videoSession, err := s.videoSessionRepo.GetActiveVideoSession(sessionID)
	if err != nil {
		return nil, errors.New("no active video session found")
	}

	response := &dto.ScreenSharingStatusResponse{
		IsScreenSharing:     videoSession.IsScreenSharing,
		ScreenSharingUserID: videoSession.ScreenSharingUserID,
	}

	// Get user name if someone is sharing
	if videoSession.IsScreenSharing && videoSession.ScreenSharingUserID != nil {
		user, err := s.userRepo.GetByID(*videoSession.ScreenSharingUserID)
		if err == nil && user != nil {
			response.ScreenSharingUserName = user.FullName
		}

		// Get start time from metadata
		if videoSession.Metadata != nil {
			if sessions, ok := videoSession.Metadata["screen_sharing_sessions"].([]interface{}); ok && len(sessions) > 0 {
				lastSession := sessions[len(sessions)-1].(map[string]interface{})
				if startedAt, ok := lastSession["started_at"].(time.Time); ok {
					response.StartedAt = &startedAt
				}
			}
		}
	}

	return response, nil
}
