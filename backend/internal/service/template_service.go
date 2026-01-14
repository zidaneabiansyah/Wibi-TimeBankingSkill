package service

import (
	"github.com/timebankingskill/backend/internal/models"
	"github.com/timebankingskill/backend/internal/repository"
)

type TemplateService interface {
	CreateTemplate(template *models.SessionTemplate) error
	GetTemplateByID(id uint) (*models.SessionTemplate, error)
	GetUserTemplates(userID uint) ([]models.SessionTemplate, error)
	UpdateTemplate(template *models.SessionTemplate) error
	DeleteTemplate(id uint, userID uint) error
}

type templateService struct {
	repo repository.TemplateRepository
}

func NewTemplateService(repo repository.TemplateRepository) TemplateService {
	return &templateService{repo: repo}
}

func (s *templateService) CreateTemplate(template *models.SessionTemplate) error {
	return s.repo.Create(template)
}

func (s *templateService) GetTemplateByID(id uint) (*models.SessionTemplate, error) {
	return s.repo.GetByID(id)
}

func (s *templateService) GetUserTemplates(userID uint) ([]models.SessionTemplate, error) {
	return s.repo.GetByUserID(userID)
}

func (s *templateService) UpdateTemplate(template *models.SessionTemplate) error {
	return s.repo.Update(template)
}

func (s *templateService) DeleteTemplate(id uint, userID uint) error {
	return s.repo.Delete(id, userID)
}
