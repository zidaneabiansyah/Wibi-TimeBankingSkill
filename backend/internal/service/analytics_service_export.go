package service

import (
	"bytes"
	"encoding/csv"
	"fmt"
	"strconv"
	"time"

	"github.com/go-pdf/fpdf"
	"github.com/timebankingskill/backend/internal/dto"
)

// ExportAnalytics generates a report for analytics data
func (s *AnalyticsService) ExportAnalytics(req dto.ExportAnalyticsRequest) ([]byte, string, error) {
	// Fetch data to export - currently focusing on Platform Analytics for the report
	// You might want to customize this based on req.Type ("user" vs "platform")
	data, err := s.GetPlatformAnalytics()
	if err != nil {
		return nil, "", err
	}

	timestamp := time.Now().Format("2006-01-02-150405")

	if req.Format == "csv" {
		filename := fmt.Sprintf("analytics_report_%s.csv", timestamp)
		content, err := s.generateCSV(data)
		return content, filename, err
	} else if req.Format == "pdf" {
		filename := fmt.Sprintf("analytics_report_%s.pdf", timestamp)
		content, err := s.generatePDF(data)
		return content, filename, err
	}

	return nil, "", fmt.Errorf("unsupported format: %s", req.Format)
}

func (s *AnalyticsService) generateCSV(data *dto.PlatformAnalyticsResponse) ([]byte, error) {
	var b bytes.Buffer
	w := csv.NewWriter(&b)

	// Header
	w.Write([]string{"Metric", "Value"})

	// General Stats
	w.Write([]string{"Total Users", strconv.Itoa(data.TotalUsers)})
	w.Write([]string{"Active Users", strconv.Itoa(data.ActiveUsers)})
	w.Write([]string{"Total Sessions", strconv.Itoa(data.TotalSessions)})
	w.Write([]string{"Completed Sessions", strconv.Itoa(data.CompletedSessions)})
	w.Write([]string{"Total Credits in Flow", fmt.Sprintf("%.2f", data.TotalCreditsInFlow)})
	w.Write([]string{"Average Session Rating", fmt.Sprintf("%.2f", data.AverageSessionRating)})
	w.Write([]string{"Total Skills", strconv.Itoa(data.TotalSkills)})

	// Top Skills Section (Spacer)
	w.Write([]string{""})
	w.Write([]string{"--- Top Skills ---"})
	w.Write([]string{"Skill Name", "Sessions", "Teachers", "Learners", "Avg Rating"})
	
	for _, skill := range data.TopSkills {
		w.Write([]string{
			skill.SkillName,
			strconv.Itoa(skill.SessionCount),
			strconv.Itoa(skill.TeacherCount),
			strconv.Itoa(skill.LearnerCount),
			fmt.Sprintf("%.2f", skill.AverageRating),
		})
	}

	w.Flush()
	return b.Bytes(), w.Error()
}

func (s *AnalyticsService) generatePDF(data *dto.PlatformAnalyticsResponse) ([]byte, error) {
	pdf := fpdf.New("P", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetFont("Arial", "B", 16)
	
	// Title
	pdf.Cell(40, 10, "Wibi Time Banking - Platform Analytics Report")
	pdf.Ln(12)

	pdf.SetFont("Arial", "", 10)
	pdf.Cell(40, 10, fmt.Sprintf("Generated on: %s", time.Now().Format("2006-01-02 15:04:05")))
	pdf.Ln(20)

	// General Stats Table
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(0, 10, "General Statistics")
	pdf.Ln(10)

	pdf.SetFont("Arial", "", 11)
	stats := [][]string{
		{"Total Users", strconv.Itoa(data.TotalUsers)},
		{"Active Users", strconv.Itoa(data.ActiveUsers)},
		{"Total Sessions", strconv.Itoa(data.TotalSessions)},
		{"Completed Sessions", strconv.Itoa(data.CompletedSessions)},
		{"Total Credits", fmt.Sprintf("%.2f", data.TotalCreditsInFlow)},
		{"Avg Rating", fmt.Sprintf("%.2f", data.AverageSessionRating)},
		{"Total Skills", strconv.Itoa(data.TotalSkills)},
	}

	for _, stat := range stats {
		pdf.Cell(50, 8, stat[0])
		pdf.Cell(50, 8, stat[1])
		pdf.Ln(8)
	}
	pdf.Ln(10)

	// Top Skills Section
	pdf.SetFont("Arial", "B", 12)
	pdf.Cell(0, 10, "Top Skills By Popularity")
	pdf.Ln(10)

	// Table Header
	pdf.SetFillColor(240, 240, 240)
	pdf.SetFont("Arial", "B", 10)
	pdf.CellFormat(60, 8, "Skill Name", "1", 0, "", true, 0, "")
	pdf.CellFormat(30, 8, "Sessions", "1", 0, "C", true, 0, "")
	pdf.CellFormat(30, 8, "Teachers", "1", 0, "C", true, 0, "")
	pdf.CellFormat(30, 8, "Avg Rating", "1", 0, "C", true, 0, "")
	pdf.Ln(8)

	// Table Body
	pdf.SetFont("Arial", "", 10)
	for _, skill := range data.TopSkills {
		pdf.CellFormat(60, 8, skill.SkillName, "1", 0, "", false, 0, "")
		pdf.CellFormat(30, 8, strconv.Itoa(skill.SessionCount), "1", 0, "C", false, 0, "")
		pdf.CellFormat(30, 8, strconv.Itoa(skill.TeacherCount), "1", 0, "C", false, 0, "")
		pdf.CellFormat(30, 8, fmt.Sprintf("%.2f", skill.AverageRating), "1", 0, "C", false, 0, "")
		pdf.Ln(8)
	}

	var buf bytes.Buffer
	err := pdf.Output(&buf)
	return buf.Bytes(), err
}
