package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type MailerService interface {
	SendEmail(ctx context.Context, toEmail, toName, subject, htmlContent string) error
}

type brevoMailer struct {
	apiKey    string
	fromEmail string
	fromName  string
	client    *http.Client
}

func NewBrevoMailer(apiKey, fromEmail, fromName string) MailerService {
	return &brevoMailer{
		apiKey:    apiKey,
		fromEmail: fromEmail,
		fromName:  fromName,
		client:    &http.Client{},
	}
}

type brevoRecipient struct {
	Email string `json:"email"`
	Name  string `json:"name,omitempty"`
}

type brevoSender struct {
	Email string `json:"email"`
	Name  string `json:"name,omitempty"`
}

type brevoPayload struct {
	Sender      brevoSender      `json:"sender"`
	To          []brevoRecipient `json:"to"`
	Subject     string           `json:"subject"`
	HtmlContent string           `json:"htmlContent"`
}

func (m *brevoMailer) SendEmail(ctx context.Context, toEmail, toName, subject, htmlContent string) error {
	if m.apiKey == "" {
		// Log warning or silently ignore if email is disabled in dev
		fmt.Println("Warning: BREVO_API_KEY is not set. Email not sent.")
		return nil
	}

	payload := brevoPayload{
		Sender: brevoSender{Email: m.fromEmail, Name: m.fromName},
		To:     []brevoRecipient{{Email: toEmail, Name: toName}},
		Subject: subject,
		HtmlContent: htmlContent,
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal brevo payload: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, "https://api.brevo.com/v3/smtp/email", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("accept", "application/json")
	req.Header.Set("content-type", "application/json")
	req.Header.Set("api-key", m.apiKey)

	resp, err := m.client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("brevo API returned status %d: %s", resp.StatusCode, string(body))
	}

	return nil
}
