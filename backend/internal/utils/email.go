package utils

import (
	"fmt"
	"log"
	"net/smtp"
	"os"
)

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
	}
	
	.code-container {
		text-align: center;
		margin: 32px 0;
	}
	
	.code-box {
		display: inline-block;
		background: linear-gradient(180deg, #262626 0%, #1a1a1a 100%);
		border: 2px solid #f97316;
		border-radius: 12px;
		padding: 16px 32px;
		font-size: 32px;
		font-weight: 700;
		color: #f97316;
		font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
		letter-spacing: 8px;
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
</style>
`

// SendVerificationEmail sends email with 6-digit verification code via Mailtrap SMTP
func SendVerificationEmail(recipientEmail string, recipientName string, verificationCode string) error {
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	smtpUser := os.Getenv("SMTP_USER")
	smtpPass := os.Getenv("SMTP_PASS")
	fromEmail := os.Getenv("EMAIL_FROM")

	if smtpHost == "" || smtpUser == "" || smtpPass == "" {
		log.Println("⚠️  SMTP credentials not set, skipping email sending")
		log.Printf("📧 [DEV] Verification code for %s: %s", recipientEmail, verificationCode)
		return nil
	}

	if fromEmail == "" {
		fromEmail = "noreply@wibi.local"
	}
	if smtpPort == "" {
		smtpPort = "587"
	}

	subject := "Your Wibi verification code: " + verificationCode

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
				<h1>Verify Your Email</h1>
			</div>
			
			<div class="content">
				<p class="greeting">Hello %s! 👋</p>
				<p class="text">
					Welcome to Wibi - Waktu Indonesia Berbagi Ilmu! We're excited to have you join our community of skill sharers.
				</p>
				<p class="text">
					Enter this verification code to complete your registration:
				</p>
				
				<div class="code-container">
					<div class="code-box">%s</div>
				</div>
				
				<div class="info-box">
					<p>⏰ This code will expire in <strong>5 minutes</strong>.</p>
				</div>
				
				<p class="text" style="font-size: 13px; color: #737373;">
					If you didn't create an account on Wibi, you can safely ignore this email.
				</p>
			</div>
			
			<div class="footer">
				<p class="footer-logo">Wibi</p>
				<p class="footer-text">Waktu Indonesia Berbagi Ilmu<br>Time Banking Skill Platform</p>
			</div>
		</div>
	</div>
	</body>
	</html>
	`, emailBaseStyles, recipientName, verificationCode)

	return sendSMTPEmail(smtpHost, smtpPort, smtpUser, smtpPass, fromEmail, recipientEmail, subject, htmlContent)
}

// SendPasswordResetEmail sends password reset link via Mailtrap SMTP
func SendPasswordResetEmail(recipientEmail string, recipientName string, resetLink string) error {
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	smtpUser := os.Getenv("SMTP_USER")
	smtpPass := os.Getenv("SMTP_PASS")
	fromEmail := os.Getenv("EMAIL_FROM")

	if smtpHost == "" || smtpUser == "" || smtpPass == "" {
		log.Println("⚠️  SMTP credentials not set, skipping email sending")
		log.Printf("📧 [DEV] Password reset link for %s: %s", recipientEmail, resetLink)
		return nil
	}

	if fromEmail == "" {
		fromEmail = "security@wibi.local"
	}
	if smtpPort == "" {
		smtpPort = "587"
	}

	subject := "Reset Your Wibi Password"

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
				<div class="header" style="background: linear-gradient(135deg, #ef4444 0%%, #dc2626 100%%);">
					<h1>Reset Your Password</h1>
				</div>
				
				<div class="content">
					<p class="greeting">Hello %s,</p>
					<p class="text">
						We received a request to reset your password for your Wibi account. Click the button below to create a new password:
					</p>
					
					<div class="button-wrapper">
						<a href="%s" class="button" style="background: linear-gradient(135deg, #ef4444 0%%, #dc2626 100%%);">Reset Password</a>
					</div>
					
					<div class="warning-box">
						<p>⚠️ <strong>Security Notice:</strong> This link will expire in <strong>1 hour</strong>. If you didn't request this reset, you can safely ignore this email.</p>
					</div>
					
					<p class="text" style="font-size: 13px; color: #737373;">
						<strong>Why did you receive this?</strong><br>
						Someone (hopefully you) requested a password reset for your Wibi account.
					</p>
				</div>
				
				<div class="footer">
					<p class="footer-logo">Wibi Security</p>
					<p class="footer-text">Waktu Indonesia Berbagi Ilmu<br>Time Banking Skill Platform</p>
				</div>
			</div>
		</div>
	</body>
	</html>
	`, emailBaseStyles, recipientName, resetLink)

	return sendSMTPEmail(smtpHost, smtpPort, smtpUser, smtpPass, fromEmail, recipientEmail, subject, htmlContent)
}

// sendSMTPEmail is a helper function to send emails via SMTP (Mailtrap)
func sendSMTPEmail(host, port, username, password, from, to, subject, htmlBody string) error {
	// SMTP authentication
	auth := smtp.PlainAuth("", username, password, host)

	// Build email headers and body
	headers := make(map[string]string)
	headers["From"] = from
	headers["To"] = to
	headers["Subject"] = subject
	headers["MIME-Version"] = "1.0"
	headers["Content-Type"] = "text/html; charset=UTF-8"

	message := ""
	for k, v := range headers {
		message += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	message += "\r\n" + htmlBody

	// Send email
	addr := fmt.Sprintf("%s:%s", host, port)
	err := smtp.SendMail(addr, auth, from, []string{to}, []byte(message))
	if err != nil {
		log.Printf("❌ SMTP error: %v", err)
		return fmt.Errorf("failed to send email: %w", err)
	}

	log.Printf("✅ Email sent to %s (via Mailtrap)", to)
	return nil
}
