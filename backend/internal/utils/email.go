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

// ResendEmailRequest represents a Resend email send request
type ResendEmailRequest struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	HTML    string   `json:"html"`
	Text    string   `json:"text,omitempty"`
}

// Email template base styles matching Wibi website design
const emailBaseStyles = `
<style>
	/* Reset */
	body, table, td { margin: 0; padding: 0; }
	img { border: 0; display: block; }
	
	/* Base styles */
	body {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		line-height: 1.6;
		color: #f5f5f5;
		background-color: #0a0a0a;
		-webkit-font-smoothing: antialiased;
	}
	
	.wrapper {
		max-width: 600px;
		margin: 0 auto;
		padding: 40px 20px;
	}
	
	.card {
		background: linear-gradient(180deg, #1a1a1a 0%, #141414 100%);
		border-radius: 16px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		overflow: hidden;
	}
	
	.header {
		background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
		padding: 32px 40px;
		text-align: center;
	}
	
	.header-icon {
		width: 56px;
		height: 56px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		margin: 0 auto 16px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.header h1 {
		color: white;
		font-size: 24px;
		font-weight: 700;
		margin: 0;
		letter-spacing: -0.5px;
	}
	
	.content {
		padding: 40px;
	}
	
	.greeting {
		font-size: 18px;
		font-weight: 600;
		color: #ffffff;
		margin-bottom: 16px;
	}
	
	.text {
		color: #a3a3a3;
		font-size: 15px;
		margin-bottom: 24px;
		line-height: 1.7;
	}
	
	.button-wrapper {
		text-align: center;
		margin: 32px 0;
	}
	
	.button {
		display: inline-block;
		padding: 14px 32px;
		background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
		color: white !important;
		text-decoration: none;
		border-radius: 10px;
		font-weight: 600;
		font-size: 15px;
		box-shadow: 0 4px 14px rgba(249, 115, 22, 0.4);
		transition: all 0.2s;
	}
	
	.button:hover {
		box-shadow: 0 6px 20px rgba(249, 115, 22, 0.5);
	}
	
	.info-box {
		background: rgba(249, 115, 22, 0.1);
		border-left: 3px solid #f97316;
		border-radius: 0 8px 8px 0;
		padding: 16px 20px;
		margin: 24px 0;
	}
	
	.info-box p {
		color: #fdba74;
		font-size: 14px;
		margin: 0;
	}
	
	.warning-box {
		background: rgba(239, 68, 68, 0.1);
		border-left: 3px solid #ef4444;
		border-radius: 0 8px 8px 0;
		padding: 16px 20px;
		margin: 24px 0;
	}
	
	.warning-box p {
		color: #fca5a5;
		font-size: 14px;
		margin: 0;
	}
	
	.divider {
		height: 1px;
		background: rgba(255, 255, 255, 0.1);
		margin: 32px 0;
	}
	
	.footer {
		text-align: center;
		padding: 24px 40px;
		background: rgba(0, 0, 0, 0.3);
	}
	
	.footer-logo {
		font-weight: 700;
		font-size: 16px;
		color: #f97316;
		margin-bottom: 8px;
	}
	
	.footer-text {
		color: #525252;
		font-size: 13px;
		margin: 0;
	}
	
	.footer-links {
		margin-top: 16px;
	}
	
	.footer-links a {
		color: #737373;
		font-size: 12px;
		text-decoration: none;
		margin: 0 12px;
	}
	
	.footer-links a:hover {
		color: #f97316;
	}
</style>
`

// SendVerificationEmail sends email verification link via Resend
func SendVerificationEmail(recipientEmail string, recipientName string, verificationLink string) error {
	apiKey := os.Getenv("RESEND_API_KEY")
	if apiKey == "" {
		log.Println("⚠️  RESEND_API_KEY not set, skipping email sending")
		log.Printf("📧 [DEV] Verification link for %s: %s", recipientEmail, verificationLink)
		return nil
	}

	fromEmail := os.Getenv("EMAIL_FROM")
	if fromEmail == "" {
		fromEmail = "Wibi <onboarding@resend.dev>"
	}

	htmlContent := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Verify your email - Wibi</title>
	%s
</head>
<body>
	<div class="wrapper">
		<div class="card">
			<div class="header">
				<div class="header-icon">
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
						<polyline points="22 4 12 14.01 9 11.01"></polyline>
					</svg>
				</div>
				<h1>Verify Your Email</h1>
			</div>
			
			<div class="content">
				<p class="greeting">Hello %s! 👋</p>
				<p class="text">
					Welcome to Wibi - Waktu Indonesia Berbagi Ilmu! We're excited to have you join our community of skill sharers.
				</p>
				<p class="text">
					Please verify your email address by clicking the button below to complete your registration:
				</p>
				
				<div class="button-wrapper">
					<a href="%s" class="button">Verify Email Address</a>
				</div>
				
				<div class="info-box">
					<p>⏰ This verification link will expire in <strong>24 hours</strong>.</p>
				</div>
				
				<p class="text" style="font-size: 13px; color: #737373;">
					If you didn't create an account on Wibi, you can safely ignore this email.
				</p>
			</div>
			
			<div class="footer">
				<p class="footer-logo">Wibi</p>
				<p class="footer-text">Waktu Indonesia Berbagi Ilmu<br>Time Banking Skill Platform</p>
				<div class="footer-links">
					<a href="#">Help Center</a>
					<a href="#">Privacy Policy</a>
					<a href="#">Terms of Service</a>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
	`, emailBaseStyles, recipientName, verificationLink)

	textContent := fmt.Sprintf(
		"Hello %s!\n\nWelcome to Wibi - Waktu Indonesia Berbagi Ilmu!\n\nPlease verify your email by visiting: %s\n\nThis link will expire in 24 hours.\n\nIf you didn't create an account, you can safely ignore this email.\n\n---\nWibi - Time Banking Skill Platform",
		recipientName,
		verificationLink,
	)

	request := ResendEmailRequest{
		From:    fromEmail,
		To:      []string{recipientEmail},
		Subject: "✉️ Verify your Wibi email address",
		HTML:    htmlContent,
		Text:    textContent,
	}

	return sendEmail(request, apiKey, recipientEmail, "verification")
}

// SendPasswordResetEmail sends password reset link via Resend
func SendPasswordResetEmail(recipientEmail string, recipientName string, resetLink string) error {
	apiKey := os.Getenv("RESEND_API_KEY")
	if apiKey == "" {
		log.Println("⚠️  RESEND_API_KEY not set, skipping email sending")
		log.Printf("📧 [DEV] Password reset link for %s: %s", recipientEmail, resetLink)
		return nil
	}

	fromEmail := os.Getenv("EMAIL_FROM")
	if fromEmail == "" {
		fromEmail = "Wibi Security <onboarding@resend.dev>"
	}

	htmlContent := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Reset your password - Wibi</title>
	%s
</head>
<body>
	<div class="wrapper">
		<div class="card">
			<div class="header" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
				<div class="header-icon">
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
						<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
						<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
					</svg>
				</div>
				<h1>Reset Your Password</h1>
			</div>
			
			<div class="content">
				<p class="greeting">Hello %s,</p>
				<p class="text">
					We received a request to reset your password for your Wibi account. Click the button below to create a new password:
				</p>
				
				<div class="button-wrapper">
					<a href="%s" class="button" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);">Reset Password</a>
				</div>
				
				<div class="warning-box">
					<p>⚠️ <strong>Security Notice:</strong> This link will expire in <strong>1 hour</strong>. If you didn't request this reset, you can safely ignore this email - your account is still secure.</p>
				</div>
				
				<div class="divider"></div>
				
				<p class="text" style="font-size: 13px; color: #737373;">
					<strong>Why did you receive this?</strong><br>
					Someone (hopefully you) requested a password reset for your Wibi account. If this wasn't you, your account is still secure and you can ignore this email.
				</p>
			</div>
			
			<div class="footer">
				<p class="footer-logo">Wibi Security</p>
				<p class="footer-text">Waktu Indonesia Berbagi Ilmu<br>Time Banking Skill Platform</p>
				<div class="footer-links">
					<a href="#">Help Center</a>
					<a href="#">Privacy Policy</a>
					<a href="#">Terms of Service</a>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
	`, emailBaseStyles, recipientName, resetLink)

	textContent := fmt.Sprintf(
		"Hello %s,\n\nWe received a request to reset your password for your Wibi account.\n\nClick the link below to create a new password:\n%s\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, you can safely ignore this email.\n\n---\nWibi Security - Time Banking Skill Platform",
		recipientName,
		resetLink,
	)

	request := ResendEmailRequest{
		From:    fromEmail,
		To:      []string{recipientEmail},
		Subject: "🔐 Reset Your Wibi Password",
		HTML:    htmlContent,
		Text:    textContent,
	}

	return sendEmail(request, apiKey, recipientEmail, "password reset")
}

// sendEmail is a helper function to send emails via Resend API
func sendEmail(request ResendEmailRequest, apiKey string, recipientEmail string, emailType string) error {
	jsonData, err := json.Marshal(request)
	if err != nil {
		return fmt.Errorf("failed to marshal email request: %w", err)
	}

	req, err := http.NewRequest("POST", "https://api.resend.com/emails", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		log.Printf("❌ Resend API error (status %d): %s", resp.StatusCode, string(body))
		return fmt.Errorf("resend API error: %s", string(body))
	}

	log.Printf("✅ %s email sent to %s", emailType, recipientEmail)
	return nil
}
