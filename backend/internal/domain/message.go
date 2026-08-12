package domain

import (
	"context"
	"time"
)

type Conversation struct {
	ID         string    `json:"id"`
	ListingID  string    `json:"listing_id"`
	TenantID   string    `json:"tenant_id"`
	LandlordID string    `json:"landlord_id"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type Message struct {
	ID             string     `json:"id"`
	ConversationID string     `json:"conversation_id"`
	SenderID       string     `json:"sender_id"`
	Content        string     `json:"content"`
	ReadAt         *time.Time `json:"read_at"`
	CreatedAt      time.Time  `json:"created_at"`
}

type MessageRepository interface {
	CreateConversation(ctx context.Context, conv *Conversation) error
	GetConversationsByUserID(ctx context.Context, userID string) ([]*Conversation, error)
	GetConversationByListingAndTenant(ctx context.Context, listingID, tenantID string) (*Conversation, error)
	
	CreateMessage(ctx context.Context, msg *Message) error
	GetMessagesByConversationID(ctx context.Context, conversationID string) ([]*Message, error)
	MarkMessagesAsRead(ctx context.Context, conversationID, userID string) error
}
