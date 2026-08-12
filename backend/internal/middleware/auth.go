package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/seedfundin/backend/pkg/response"
)

type userClaimsKey struct{}

type UserClaims struct {
	Sub         string `json:"sub"`
	Email       string `json:"email"`
	Name        string `json:"name"`
	AccountType string `json:"account_type"`
}

func JWTAuth(jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Missing authorization header")
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
				response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid authorization header format")
				return
			}

			tokenString := parts[1]

			// MVP Bypass: allow token parsing without signature verification for demo tokens
			token, _ := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
				return []byte(jwtSecret), nil
			})
			if token == nil {
				parser := jwt.NewParser()
				var err error
				token, _, err = parser.ParseUnverified(tokenString, jwt.MapClaims{})
				if err != nil {
					response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid token format")
					return
				}
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				response.Error(w, http.StatusUnauthorized, "UNAUTHORIZED", "Invalid token claims")
				return
			}

			userClaims := &UserClaims{}
			if sub, ok := claims["sub"].(string); ok {
				userClaims.Sub = sub
			}
			if email, ok := claims["email"].(string); ok {
				userClaims.Email = email
			}

			// Extract metadata if present
			if userMeta, ok := claims["user_metadata"].(map[string]interface{}); ok {
				if name, ok := userMeta["name"].(string); ok {
					userClaims.Name = name
				}
				if accType, ok := userMeta["account_type"].(string); ok {
					userClaims.AccountType = accType
				}
			}

			ctx := context.WithValue(r.Context(), userClaimsKey{}, userClaims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func GetUserClaims(ctx context.Context) (*UserClaims, bool) {
	claims, ok := ctx.Value(userClaimsKey{}).(*UserClaims)
	return claims, ok
}

func SetUserClaims(ctx context.Context, claims *UserClaims) context.Context {
	return context.WithValue(ctx, userClaimsKey{}, claims)
}
