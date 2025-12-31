# Couples Game API (Node + TypeScript + MongoDB)

Working starter backend:
- Email signup + verification + login
- Google OAuth login (Passport)
- Pair with a verified partner (request/accept)
- Joint dashboard anchored on a relationship
- Unlink and relink with the same partner to continue progress
- Questions + shared progress answers

## Setup
```bash
npm install
cp .env.example .env
npm run dev
```

Health:
GET http://localhost:5000/health

## Email auth flow
1) POST /api/v1/auth/signup -> returns verificationToken (dev)
2) POST /api/v1/auth/verify-email
3) POST /api/v1/auth/login -> returns accessToken

Use Authorization header:
Bearer <accessToken>

## Google OAuth
Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL in .env
GET /api/v1/auth/google

Redirects to:
CLIENT_BASE_URL/auth/callback?accessToken=...&refreshToken=...

## Couples
- POST /api/v1/couples/request { partnerEmail }
- POST /api/v1/couples/accept { relationshipId }
- POST /api/v1/couples/unlink
- POST /api/v1/couples/relink { partnerEmail }
- GET  /api/v1/couples/history

## Dashboard
GET /api/v1/dashboard/me

## Questions + progress
POST /api/v1/questions/seed
GET  /api/v1/questions
POST /api/v1/progress/answer { questionId, answer }
GET  /api/v1/progress
