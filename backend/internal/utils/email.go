package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

// BrevoEmailRequest represents a Brevo email send request
type BrevoEmailRequest struct {
	Sender    Sender        `json:"sender"`
	To        []Recipient   `json:"to"`
	Subject   string        `json:"subject"`
	HTMLContent string      `json:"htmlContent"`
	TextContent string      `json:"textContent"`
}

type Sender struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type Recipient struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

// SendVerificationEmail sends email verification link via Brevo
func SendVerificationEmail(recipientEmail string, recipientName string, verificationLink string) error {
	apiKey := os.Getenv("BREVO_API_KEY")
	if apiKey == "" {
		log.Println("⚠️  BREVO_API_KEY not set, skipping email sending")
		return nil // Don't fail if API key not set
	}

	htmlContent := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background-color: #f97316; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
		.content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
		.button { display: inline-block; padding: 12px 30px; background-color: #f97316; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
		.footer { font-size: 12px; color: #666; margin-top: 20px; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>Email Verification</h1>
		</div>
		<div class="content">
			<p>Hello %s,</p>
			<p>Welcome to Wibi! Please verify your email address by clicking the button below:</p>
			<a href="%s" class="button">Verify Email</a>
			<p>If you didn't create an account, you can ignore this email.</p>
			<p>This link will expire in 24 hours.</p>
			<div class="footer">
				<p>Waktu Indonesia Berbagi Ilmu (Wibi) - Time Banking Skill Platform</p>
			</div>
		</div>
	</div>
</body>
</html>
	`, recipientName, verificationLink)

	textContent := fmt.Sprintf(
		"Hello %s,\n\nWelcome to Wibi! Please verify your email by visiting: %s\n\nThis link will expire in 24 hours.",
		recipientName,
		verificationLink,
	)

	request := BrevoEmailRequest{
		Sender: Sender{
			Name:  "Wibi",
			Email: "noreply@wibi.com",
		},
		To: []Recipient{
			{
				Name:  recipientName,
				Email: recipientEmail,
			},
		},
		Subject:     "Verify your Wibi email address",
		HTMLContent: htmlContent,
		TextContent: textContent,
	}

	jsonData, err := json.Marshal(request)
	if err != nil {
		return fmt.Errorf("failed to marshal email request: %w", err)
	}

	// Send to Brevo API
	req, err := http.NewRequest("POST", "https://api.brevo.com/v3/smtp/email", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("api-key", apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return fmt.Errorf("brevo API error: %s", string(body))
	}

	log.Printf("✅ Verification email sent to %s", recipientEmail)
	return nil
}

// SendPasswordResetEmail sends password reset link via Brevo
func SendPasswordResetEmail(recipientEmail string, recipientName string, resetLink string) error {
	apiKey := os.Getenv("BREVO_API_KEY")
	if apiKey == "" {
		log.Println("⚠️  BREVO_API_KEY not set, skipping email sending")
		return nil
	}

	htmlContent := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		.header { background-color: #ef4444; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
		.content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
		.button { display: inline-block; padding: 12px 30px; background-color: #ef4444; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
		.footer { font-size: 12px; color: #666; margin-top: 20px; }
		.warning { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin: 20px 0; }
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<h1>Reset Your Password</h1>
		</div>
		<div class="content">
			<p>Hello %s,</p>
			<p>We received a request to reset your password. Click the button below to create a new password:</p>
			<a href="%s" class="button">Reset Password</a>
			<div class="warning">
				<strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request this reset, you can safely ignore this email.
			</div>
			<p><strong>Why did you receive this?</strong> Someone (hopefully you) requested a password reset for your Wibi account. If this wasn't you, your account is still secure and you can ignore this email.</p>
			<div class="footer">
				<p>Waktu Indonesia Berbagi Ilmu (Wibi) - Time Banking Skill Platform</p>
			</div>
		</div>
	</div>
</body>
</html>
	`, recipientName, resetLink)

	textContent := fmt.Sprintf(
		"Hello %s,\n\nWe received a request to reset your password. Click the link below to create a new password:\n%s\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, you can safely ignore this email.",
		recipientName,
		resetLink,
	)

	request := BrevoEmailRequest{
		Sender: Sender{
			Name:  "Wibi Security",
			Email: "security@wibi.com",
		},
		To: []Recipient{
			{
				Name:  recipientName,
				Email: recipientEmail,
			},
		},
		Subject:     "Reset Your Wibi Password",
		HTMLContent: htmlContent,
		TextContent: textContent,
	}

	jsonData, err := json.Marshal(request)
	if err != nil {
		return fmt.Errorf("failed to marshal email request: %w", err)
	}

	req, err := http.NewRequest("POST", "https://api.brevo.com/v3/smtp/email", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("api-key", apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusOK {
		return fmt.Errorf("brevo API error: %s", string(body))
	}

	log.Printf("✅ Password reset email sent to %s", recipientEmail)
	return nil
}
