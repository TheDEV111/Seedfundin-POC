package postgres

import (
	"context"
	"database/sql"
	"github.com/seedfundin/backend/internal/domain"
)

type messageRepo struct {
	db *sql.DB
}

func NewMessageRepository(db *sql.DB) domain.MessageRepository {
	return &messageRepo{db: db}
}

func (r *messageRepo) CreateConversation(ctx context.Context, conv *domain.Conversation) error {
	query := `
		INSERT INTO conversations (listing_id, tenant_id, landlord_id)
		VALUES ($1, $2, $3)
		ON CONFLICT (listing_id, tenant_id) DO UPDATE SET updated_at = NOW()
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRowContext(ctx, query, conv.ListingID, conv.TenantID, conv.LandlordID).
		Scan(&conv.ID, &conv.CreatedAt, &conv.UpdatedAt)
}

func (r *messageRepo) GetConversationsByUserID(ctx context.Context, userID string) ([]*domain.Conversation, error) {
	query := `
		SELECT id, listing_id, tenant_id, landlord_id, created_at, updated_at 
		FROM conversations 
		WHERE tenant_id = $1 OR landlord_id = $1
		ORDER BY updated_at DESC
	`
	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var convs []*domain.Conversation
	for rows.Next() {
		conv := &domain.Conversation{}
		if err := rows.Scan(&conv.ID, &conv.ListingID, &conv.TenantID, &conv.LandlordID, &conv.CreatedAt, &conv.UpdatedAt); err != nil {
			return nil, err
		}
		convs = append(convs, conv)
	}
	return convs, nil
}

func (r *messageRepo) GetConversationByListingAndTenant(ctx context.Context, listingID, tenantID string) (*domain.Conversation, error) {
	conv := &domain.Conversation{}
	query := `SELECT id, listing_id, tenant_id, landlord_id, created_at, updated_at FROM conversations WHERE listing_id = $1 AND tenant_id = $2`
	err := r.db.QueryRowContext(ctx, query, listingID, tenantID).Scan(
		&conv.ID, &conv.ListingID, &conv.TenantID, &conv.LandlordID, &conv.CreatedAt, &conv.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return conv, nil
}

func (r *messageRepo) CreateMessage(ctx context.Context, msg *domain.Message) error {
	query := `
		INSERT INTO messages (conversation_id, sender_id, content)
		VALUES ($1, $2, $3)
		RETURNING id, created_at
	`
	err := r.db.QueryRowContext(ctx, query, msg.ConversationID, msg.SenderID, msg.Content).
		Scan(&msg.ID, &msg.CreatedAt)
	if err != nil {
		return err
	}
	
	// Also update conversation updated_at
	_, _ = r.db.ExecContext(ctx, "UPDATE conversations SET updated_at = NOW() WHERE id = $1", msg.ConversationID)
	return nil
}

func (r *messageRepo) GetMessagesByConversationID(ctx context.Context, conversationID string) ([]*domain.Message, error) {
	query := `SELECT id, conversation_id, sender_id, content, read_at, created_at FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`
	rows, err := r.db.QueryContext(ctx, query, conversationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var msgs []*domain.Message
	for rows.Next() {
		msg := &domain.Message{}
		if err := rows.Scan(&msg.ID, &msg.ConversationID, &msg.SenderID, &msg.Content, &msg.ReadAt, &msg.CreatedAt); err != nil {
			return nil, err
		}
		msgs = append(msgs, msg)
	}
	return msgs, nil
}

func (r *messageRepo) MarkMessagesAsRead(ctx context.Context, conversationID, userID string) error {
	// Mark messages read where sender is NOT the current user
	query := `UPDATE messages SET read_at = NOW() WHERE conversation_id = $1 AND sender_id != $2 AND read_at IS NULL`
	_, err := r.db.ExecContext(ctx, query, conversationID, userID)
	return err
}
