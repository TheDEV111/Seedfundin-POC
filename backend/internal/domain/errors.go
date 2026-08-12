package domain

import "errors"

var (
	ErrNotFound       = errors.New("resource not found")
	ErrUnauthorized   = errors.New("unauthorized access")
	ErrForbidden      = errors.New("action forbidden for this user role")
	ErrInvalidInput   = errors.New("invalid input data")
	ErrConflict       = errors.New("resource conflict")
	ErrRateLimit      = errors.New("rate limit exceeded")
	ErrInternal       = errors.New("internal server error")
)
