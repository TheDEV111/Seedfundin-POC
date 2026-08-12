-- name: CreateConversation :one
INSERT INTO conversations (listing_id, tenant_id, landlord_id)
VALUES ($1, $2, $3)
ON CONFLICT (listing_id, tenant_id) DO UPDATE SET updated_at = NOW()
RETURNING *;

-- name: ListUserConversations :many
SELECT * FROM conversations 
WHERE tenant_id = $1 OR landlord_id = $1
ORDER BY updated_at DESC;

-- name: CreateMessage :one
INSERT INTO messages (conversation_id, sender_id, content)
VALUES ($1, $2, $3)
RETURNING *;

-- name: ListMessagesByConversation :many
SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC;

-- name: MarkMessagesAsRead :exec
UPDATE messages SET read_at = NOW() WHERE conversation_id = $1 AND sender_id != $2 AND read_at IS NULL;
