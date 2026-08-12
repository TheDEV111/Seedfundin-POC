# Seedfundin POC

This repository contains the backend and frontend for the Seedfundin POC.

## Architecture
- **Backend:** Go, chi router, sqlc, PostgreSQL (PostGIS)
- **Frontend:** Next.js 15, App Router, TypeScript, Tailwind CSS

## Prerequisites
- Go (latest)
- Node.js (v18+)
- Docker (for local database)

## Running Locally

You can use the provided `Makefile` in the root directory to run the apps.

1. **Start the database:**
   ```bash
   make db
   ```
   *This starts a local PostGIS container on port 5432.*

2. **Run the backend:**
   Open a terminal in the root folder and run:
   ```bash
   make backend
   ```
   *The Go server will start, typically on port 8080.*

3. **Run the frontend:**
   Open another terminal in the root folder and run:
   ```bash
   make frontend
   ```
   *The Next.js app will start on http://localhost:3000.*

You can also run `make help` to see all available commands.

## Stopping the database
When you're done developing, you can stop and remove the local database container by running:
```bash
make db-down
```
