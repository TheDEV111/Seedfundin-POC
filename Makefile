.PHONY: help backend frontend db db-down

help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

backend: ## Run the Go backend server
	cd backend && go run cmd/api/main.go

frontend: ## Run the Next.js frontend server
	cd frontend && npm run dev

db: ## Start the local PostGIS database using Docker
	docker run --name seedfundin-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=seedfundin -p 5435:5432 -d postgis/postgis:15-3.3

db-down: ## Stop and remove the local PostGIS database
	docker stop seedfundin-db && docker rm seedfundin-db
