package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/seedfundin/backend/pkg/response"
)

type rateLimiter struct {
	mu       sync.Mutex
	requests map[string][]time.Time
	limit    int
	window   time.Duration
}

func NewRateLimiter(limit int, window time.Duration) *rateLimiter {
	rl := &rateLimiter{
		requests: make(map[string][]time.Time),
		limit:    limit,
		window:   window,
	}

	// Cleanup stale entries periodically
	go func() {
		for {
			time.Sleep(window)
			rl.mu.Lock()
			now := time.Now()
			for ip, times := range rl.requests {
				var valid []time.Time
				for _, t := range times {
					if now.Sub(t) < window {
						valid = append(valid, t)
					}
				}
				if len(valid) == 0 {
					delete(rl.requests, ip)
				} else {
					rl.requests[ip] = valid
				}
			}
			rl.mu.Unlock()
		}
	}()

	return rl
}

func (rl *rateLimiter) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := r.RemoteAddr
		if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
			ip = xff
		}

		rl.mu.Lock()
		now := time.Now()
		var valid []time.Time
		for _, t := range rl.requests[ip] {
			if now.Sub(t) < rl.window {
				valid = append(valid, t)
			}
		}

		if len(valid) >= rl.limit {
			rl.mu.Unlock()
			response.Error(w, http.StatusTooManyRequests, "RATE_LIMIT_EXCEEDED", "Rate limit exceeded. Please try again later.")
			return
		}

		rl.requests[ip] = append(valid, now)
		rl.mu.Unlock()

		next.ServeHTTP(w, r)
	})
}
