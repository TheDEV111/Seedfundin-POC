# Multi-stage build for single static Go binary
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install ca-certificates and tzdata
RUN apk add --no-cache ca-certificates tzdata

# Copy go.mod and go.sum first for dependency caching
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build statically compiled binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/api ./cmd/api

# Minimal scratch runtime image
FROM scratch

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=builder /app/api /api
COPY --from=builder /app/docs /docs

EXPOSE 8080

ENTRYPOINT ["/api"]
