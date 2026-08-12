package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/seedfundin/backend/internal/domain"
	"github.com/seedfundin/backend/internal/middleware"
	"github.com/seedfundin/backend/pkg/response"
)

type MessageHandler struct {
	repo        domain.MessageRepository
	userService domain.UserService
}

func NewMessageHandler(repo domain.MessageRepository, uService domain.UserService) *MessageHandler {
	return &MessageHandler{
		repo:        repo,
		userService: uService,
	}
}

type SendMessageRequest struct {
	ListingID  string `json:"listing_id,omitempty"`
	LandlordID string `json:"landlord_id,omitempty"` // For initial tenant contact
	Content    string `json:"content"`
}

func (h *MessageHandler) SendMessage(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserClaims(r.Context())
	if !ok {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing claims")
		return
	}

	user, err := h.userService.GetCurrentUser(r.Context(), claims.Sub)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "User profile not found")
		return
	}

	convID := chi.URLParam(r, "id")

	var req SendMessageRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error(w, http.StatusBadRequest, "INVALID_INPUT", "Invalid JSON payload")
		return
	}

	// Create conversation if it's the first message and convID is "new"
	if convID == "new" {
		conv := &domain.Conversation{
			ListingID:  req.ListingID,
			TenantID:   user.ID.String(),
			LandlordID: req.LandlordID,
		}
		if err := h.repo.CreateConversation(r.Context(), conv); err != nil {
			response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to start conversation")
			return
		}
		convID = conv.ID
	}

	msg := &domain.Message{
		ConversationID: convID,
		SenderID:       user.ID.String(),
		Content:        req.Content,
	}

	if err := h.repo.CreateMessage(r.Context(), msg); err != nil {
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to send message")
		return
	}

	response.JSON(w, http.StatusCreated, msg)
}

func (h *MessageHandler) ListConversations(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserClaims(r.Context())
	if !ok {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing claims")
		return
	}

	user, err := h.userService.GetCurrentUser(r.Context(), claims.Sub)
	if err != nil {
		response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "User profile not found")
		return
	}

	convs, err := h.repo.GetConversationsByUserID(r.Context(), user.ID.String())
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to fetch conversations")
		return
	}

	if convs == nil {
		convs = []*domain.Conversation{}
	}
	response.JSON(w, http.StatusOK, convs)
}

func (h *MessageHandler) ListMessages(w http.ResponseWriter, r *http.Request) {
	convID := chi.URLParam(r, "id")

	msgs, err := h.repo.GetMessagesByConversationID(r.Context(), convID)
	if err != nil {
		response.Error(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Failed to fetch messages")
		return
	}
	
	if msgs == nil {
		msgs = []*domain.Message{}
	}

	response.JSON(w, http.StatusOK, msgs)
}
