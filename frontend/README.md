# Seedfundin Rental Marketplace Frontend MVP

A Next.js 15 App Router frontend for the room & apartment rental marketplace MVP, built using TypeScript, Tailwind CSS, and an Olive Green & White design system.

---

## Tech Stack & Highlights

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS + CSS Variables Design System (`styles/tokens.css`)
- **Design Tokens**: Olive Primary (`#6B7A3A`), Olive Deep (`#4A5A2A`), Olive Muted (`#A8B589`), White (`#FFFFFF`), Off-White (`#F7F7F2`), Charcoal Text (`#2B2B26`)
- **API Client**: Single typed API wrapper (`lib/api-client.ts`) pointing to Go backend `/api/v1` endpoints.
- **Auth**: Passwordless OTP / JWT authentication linked with Supabase Auth schema.

---

## Directory Structure

```
frontend/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx              # Landing page (hero, dual value prop, how it works, trust signals)
│   ├── (auth)/
│   │   ├── signup/page.tsx       # Unified signup flow (tenant vs landlord toggle)
│   │   └── login/page.tsx        # Fallback login page
│   ├── (dashboard)/
│   │   └── listings/new/page.tsx # Landlord property creation form
│   ├── search/
│   │   ├── page.tsx              # Tenant search & filter page
│   │   └── [id]/page.tsx         # Detailed listing page & WhatsApp contact reveal
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                       # Design system primitives (Button, Card, Badge, Input, Modal, Toggle)
│   └── features/                 # Domain components (Header, ListingCard, SearchFilters, ContactModal, LoginModal, Footer)
├── lib/
│   ├── api-client.ts             # Single typed API client for Go backend endpoints
│   └── auth.ts                   # Token storage & JWT helpers
└── styles/
    └── tokens.css                # Olive Green & White CSS variables (Single Source of Truth)
```

---

## Design Tokens Location

All color tokens are strictly defined in `styles/tokens.css`:

```css
:root {
  --color-olive-primary: #6B7A3A;
  --color-olive-deep: #4A5A2A;
  --color-olive-muted: #A8B589;
  --color-white: #FFFFFF;
  --color-off-white: #F7F7F2;
  --color-charcoal-text: #2B2B26;
}
```

Components consume these variables via Tailwind utility classes (`bg-olive`, `bg-surface-offwhite`, `text-charcoal`) or directly via CSS variables.

---

## Running the Dev Server

1. Install dependencies:
```bash
npm install
```

2. Set environment variable for backend URL (optional, defaults to `http://localhost:8080/api/v1`):
```bash
export NEXT_PUBLIC_API_URL="http://localhost:8080/api/v1"
```

3. Start dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
