# Seedfundin - Project Handover & Context Document

## 1. Product Overview (Context & PRD Summary)
**Product Name:** Seedfundin 
**Core Value Proposition:** A modern, mobile-first real estate marketplace that connects landlords/agents directly with tenants (students, young professionals, etc.).
**MVP Focus:** The MVP strictly focuses on solving the immediate problem: helping a room or apartment get matched faster and more safely. Features that do not directly contribute to finding a place or listing a place quickly have been cut.

### Key Workflows
* **For Tenants:** Browse verified listings, view property details, and request to reveal the landlord's direct contact information.
* **For Landlords:** Quickly list new properties with minimal friction, manage active/drafted properties, and receive email notifications when a tenant is interested.
* **For Admins (P0 Requirement):** A dedicated moderation dashboard to approve/hide listings and ensure marketplace quality.

---

## 2. Technology Stack
* **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide React (Icons).
* **Backend:** Go (Golang) API, `go-chi` (Router), `sqlc` (Type-safe SQL query generation), standard `net/http` and `lib/pq`.
* **Database & Auth:** PostgreSQL + Supabase (Local Development Suite). Passwordless OTP Authentication via Supabase GoTrue.
* **Email:** Brevo (SMTP for Auth, REST API for Backend Notifications).

---

## 3. What Was Requested & Implemented

### User Requests
1. **Authentication:** Switch from dummy hardcoded JWTs to real passwordless OTP authentication using Supabase.
2. **Database & Backend Connectivity:** Start local Supabase, run migrations, spin up the Go backend, and connect the frontend to read/write real data.
3. **Responsive Design & Mobile UX:** Micro-manage the responsiveness of the entire app (xs, sm, md, lg, xl, 2xl). Specifically requested a modern, native-app-like mobile UX for the sidebar and navigation.
4. **Email Customization:** Integrate the Brevo API and customize the email templates to match the Seedfundin brand (theme, logo, colors).
5. **Admin Dashboard:** Implement the P0 Admin Moderation Dashboard.
6. **CORS:** Ensure secure and functional Cross-Origin Resource Sharing between the Next.js frontend and the Go backend.

### Technical Implementations
* **Supabase Local Setup:** Fully configured `supabase/config.toml`. Migrations are successfully running.
* **Passwordless OTP Auth Flow:** 
  * Integrated `@supabase/supabase-js` into the frontend.
  * Overhauled the `LoginModal.tsx` to handle the two-step OTP flow (Send Email -> Verify 6-digit Code).
  * *Crucial Fix:* Created a custom HTML template (`supabase/templates/magic_link.html`) and injected it into Supabase config so it sends the 6-digit `{{ .Token }}` instead of a magic link URL.
* **Mobile-First UX Overhaul:**
  * Created `MobileNav.tsx`, replacing the clunky hamburger menu with a sleek, fixed bottom navigation bar on mobile devices (matching iOS/Android native app patterns).
  * Adjusted `DashboardLayout`, `ProfileView`, `MyListingsPage`, and `AdminDashboardPage` to use smart flex-box stacking (`flex-col` on mobile, `flex-row` on desktop) and responsive padding (`p-4` on mobile, `p-8` on desktop).
* **Go Backend Enhancements:**
  * Created `BrevoMailer` service using Go's standard library to hit Brevo's v3 REST API.
  * Wrote a custom HTML email template inside `contact_service.go` for Landlord notifications, styled with Seedfundin's Olive green branding (`#6B7A3A`) and a professional layout.
  * Fixed the CORS middleware in `cors.go` to properly allow wildcard origins without strict credential matching, allowing smooth communication between `localhost:3000` and `localhost:8081`.
* **Auth Email Bypassing (Current State):** Brevo strictly blocked the new account from sending SMTP emails (Error 535 / 5.7.8), causing the Supabase Auth server to crash with 500 errors. I temporarily disabled custom SMTP in `supabase/config.toml` so you can continue building. OTP emails are currently intercepted by Supabase's local mail catcher at `http://localhost:54324`.

---

## 4. Current Environment State
* **Next.js Frontend:** Running on `http://localhost:3000`
* **Go Backend API:** Running on `http://localhost:8081`
* **Supabase DB & Auth:** Running locally (Port 54321/54322)
* **Local Email Inbox (Inbucket):** Running on `http://localhost:54324` (Use this to view OTP codes!).
* **Environment Variables:** The backend requires `.env` in the root folder (currently contains `BREVO_API_KEY` and `BREVO_SMTP_KEY`).

---

## 5. Next Steps / Pending Action Items

1. **Test the Happy Path Locally:**
   * Sign up using the frontend modal.
   * Grab the 6-digit OTP from `http://localhost:54324`.
   * Log in and view the responsive dashboard.
2. **Brevo Account Verification:**
   * Before production deployment, the Brevo account `henryagukwe01@gmail.com` must have its domain verified or be manually approved by Brevo support to lift the SMTP restriction.
3. **Production Deployment:**
   * **Database & Auth:** Migrate the local Supabase setup to a Supabase Cloud project.
   * **Backend:** Deploy the Go API to Render, injecting the production Database URL, Supabase JWT Secret, and Brevo API Key into Render's environment variables.
   * **Frontend:** Update the Vercel project with the Render Backend URL and the Supabase Cloud public keys.
4. **Photo Uploads (Supabase Storage):**
   * Integrate Supabase Storage buckets so landlords can upload real property photos from the `/listings/new` form. (This was planned but not yet implemented).
