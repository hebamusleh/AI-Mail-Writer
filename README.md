# AI Mail Writer

A single-page web app that generates professional emails using AI. Describe what you need, pick a type and tone, and get a ready-to-use subject + body in seconds.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui |
| Backend | Flask 3.1, Python 3.11+, Gunicorn |
| AI | Groq API — `llama-3.3-70b-versatile` |
| Package manager | pnpm (frontend) |

---

## Project Structure

```
AI Mail Writer/
├── mail-writer-front/   # Next.js frontend
│   └── src/
│       ├── app/
│       │   ├── page.tsx             # Home page
│       │   └── globals.css          # Tailwind + shadcn theme
│       ├── components/
│       │   └── email-generator.tsx  # Main UI component
│       └── lib/
│           └── api.ts               # generateEmail() fetch wrapper
│
├── mail-writer-back/    # Flask backend
│   ├── app.py           # Single-file Flask app
│   └── requirements.txt
│
├── Architecture.md
├── SRS.md
└── sprints.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Python 3.11+
- A [Groq API key](https://console.groq.com)

---

### Backend Setup

```bash
cd mail-writer-back

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env and set your GROQ_API_KEY
```

**.env** (backend)
```
GROQ_API_KEY=gsk_...
FLASK_ENV=development
PORT=5000
ALLOWED_ORIGINS=http://localhost:3000
```

Start the backend:
```bash
python app.py
```

Backend runs at `http://localhost:5000`.

---

### Frontend Setup

```bash
cd mail-writer-front

# Install dependencies
pnpm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
```

Start the frontend:
```bash
pnpm dev
```

App runs at `http://localhost:3000`.

---

## API Reference

### `POST /api/generate`

Generates an email from the given inputs.

**Request body**
```json
{
  "description": "Apology for a 3-day delay in project delivery",
  "type": "professional",
  "tone": "polite"
}
```

| Field | Required | Values |
|-------|----------|--------|
| `description` | Yes | Free text, max 500 characters |
| `type` | No | `professional` · `friendly` · `formal` · `follow-up` · `sales` (default: `professional`) |
| `tone` | No | `polite` · `confident` · `friendly` · `persuasive` (default: `polite`) |

**Success — 200**
```json
{
  "subject": "Apology for Project Delivery Delay",
  "body": "Dear Client,\n\nI wanted to reach out..."
}
```

**Error — 400**
```json
{ "error": "Description is required." }
```

**Error — 500**
```json
{ "error": "AI service not configured" }
```

---

### `GET /api/health`

Returns the service status.

```json
{ "status": "ok", "openai_configured": true }
```

Returns `"status": "degraded"` if `GROQ_API_KEY` is missing.

---

## Deployment

### Frontend → Vercel

1. Push to GitHub.
2. Import the `mail-writer-front` folder in Vercel.
3. Add environment variable: `NEXT_PUBLIC_API_URL=<your-backend-url>`.

### Backend → Railway / Render

Start command:
```bash
gunicorn app:app
```

Add environment variables:
```
GROQ_API_KEY=gsk_...
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

---

## Features

- Free-text email description (up to 500 characters)
- Email type selection: Professional, Friendly, Formal, Follow-up, Sales
- Tone selection: Polite, Confident, Friendly, Persuasive
- One-click copy for subject, body, or full email
- Regenerate without re-entering your description
- Reset / start over button
- Toast notifications for copy actions
- Loading state with persistent result during regeneration
- 30-second request timeout with clean abort
- Mobile-responsive layout
- Backend health check endpoint
- Startup validation for missing API key
