package middleware

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

type logEntry struct {
	Level      string `json:"level"`
	Timestamp  string `json:"timestamp"`
	RequestID  string `json:"request_id,omitempty"`
	Method     string `json:"method"`
	Path       string `json:"path"`
	Status     int    `json:"status"`
	DurationMS int64  `json:"duration_ms"`
}

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rw := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}

		next.ServeHTTP(rw, r)

		duration := time.Since(start).Milliseconds()
		reqID := GetRequestID(r.Context())

		entry := logEntry{
			Level:      "INFO",
			Timestamp:  time.Now().Format(time.RFC3339),
			RequestID:  reqID,
			Method:     r.Method,
			Path:       r.URL.Path,
			Status:     rw.statusCode,
			DurationMS: duration,
		}

		if rw.statusCode >= 500 {
			entry.Level = "ERROR"
		} else if rw.statusCode >= 400 {
			entry.Level = "WARN"
		}

		b, err := json.Marshal(entry)
		if err == nil {
			log.Println(string(b))
		}
	})
}
