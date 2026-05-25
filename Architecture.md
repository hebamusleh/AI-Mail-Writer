# AI Mail Writer - System Architecture

---

# 1. Architecture Overview

The system follows a **3-layer architecture**:

1. Frontend (Next.js)
2. Backend API (Flask)
3. External AI Service (OpenAI)

The frontend handles UI and user interaction.

The backend handles business logic and secure AI communication.

The AI service generates email content.

---

# 2. High-Level Architecture

```text
+----------------------+
|      Frontend        |
|   Next.js (React)    |
+----------+-----------+
           |
           | HTTPS
           v
+----------------------+
|     Backend API      |
|       Flask          |
+----------+-----------+
           |
           | OpenAI API Call
           v
+----------------------+
|     AI Provider      |
|    Groq (Llama)      |
+----------------------+
```

---

# 3. Frontend Architecture (Next.js)

## 3.1 Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS v4
- shadcn/ui (Radix UI)
- Native Fetch API

---

## 3.2 Folder Structure in mail-writer-front folder

```text
src/
│
├── app/
│   ├── page.tsx             # Home page — renders EmailGenerator
│   ├── layout.tsx           # Root layout + app metadata
│   └── globals.css          # Tailwind + shadcn theme variables
│
├── components/
│   ├── email-generator.tsx  # Main client component (all UI + state)
│   └── ui/
│       ├── button.tsx
│       └── input.tsx
│
└── lib/
    ├── api.ts               # generateEmail() — fetch wrapper
    └── utils.ts
```

Note: No Sidebar component. SRS constraints prohibit user accounts and storage.
Note: No Header/Sidebar navigation — single-page, stateless MVP.

---

## 3.3 Frontend Responsibilities

- Render UI
- Collect user input
- Send requests to backend
- Display AI response
- Handle loading & errors

---

## 3.4 Main Components

### EmailForm

- Description input
- Email type dropdown
- Generate button

---

### EmailResult

- Displays subject
- Displays email body
- Copy button
- Regenerate button

---

### Header

- App title
- Branding

---

### LoadingSpinner

- Shows processing state

---

# 4. Backend Architecture (Flask)

## 4.1 Tech Stack

- Flask 3.1
- Python 3.11+
- Flask-CORS 6.x
- groq (Python SDK — llama-3.3-70b-versatile)
- python-dotenv
- gunicorn (production server)

---

## 4.2 Folder Structure

```text
mail-writer-back/
│
├── app.py          # Flask app + /api/generate route (single file for MVP)
├── requirements.txt
└── .env.example
```

Note: No routes/, services/, models/ split — MVP scope does not justify this overhead.
One endpoint, one file. Refactor if endpoints exceed 3 in future sprints.

---

## 4.3 Backend Responsibilities

- Validate requests
- Build AI prompts
- Communicate with OpenAI API
- Return structured response
- Handle errors

---

## 4.4 API Endpoint

### Generate Email

```http
POST /api/generate
```

### Request Body

```json
{
  "description": "Write an apology email for a project delivery delay",
  "type": "professional",
  "tone": "polite"
}
```

**Field rules:**
- `description` — required, non-empty string
- `type` — one of: `professional`, `friendly`, `formal`, `follow-up`, `sales` (default: `professional`)
- `tone` — one of: `polite`, `confident`, `friendly`, `persuasive` (default: `polite`)

### Success Response — 200

```json
{
  "subject": "Project Delay Apology",
  "body": "Dear Client..."
}
```

### Error Response — 400

```json
{
  "error": "Description is required."
}
```

### Error Response — 500

```json
{
  "error": "AI service error. Please try again."
}
```

---

# 4.5 Environment Variables

### Backend — `mail-writer-back/.env`
```
GROQ_API_KEY=gsk_...
FLASK_ENV=development
PORT=5000
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend — `mail-writer-front/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

# 5. AI Integration Layer

## Responsibilities

- Convert user input into structured prompt
- Send request to OpenAI
- Parse response
- Return structured JSON

---

## Model

- Provider: Groq
- Model: `llama-3.3-70b-versatile`
- Response format: JSON object (`{ "subject": "", "body": "" }`)

---

## Example Prompt

```text
Generate a professional email with a polite tone.

Context: Apology for 3-day delay in project delivery.

Return ONLY JSON:
{
  "subject": "",
  "body": ""
}
```

---

# 6. System Flow

```text
1. User opens Next.js app
2. User enters email description
3. User selects email type
4. User clicks Generate
5. Next.js sends request to Flask API
6. Flask validates request
7. Flask sends prompt to OpenAI
8. OpenAI returns email content
9. Flask returns structured response
10. Next.js displays result
```

---

# 7. Security Architecture

## API Key Protection

- OpenAI API key stored only in Flask backend
- Never exposed to frontend

---

## Input Validation

- Empty inputs rejected
- Invalid data sanitized

---

## CORS Policy

- Flask allows requests only from frontend domain

---

# 8. Deployment Architecture

```text
Frontend (Next.js)
→ Vercel

Backend (Flask + gunicorn)
→ Railway / Render

AI Service
→ Groq API (llama-3.3-70b-versatile)
```

---

# 9. Non-Functional Requirements

- Response time < 10 seconds
- Responsive UI (mobile + desktop)
- High availability depends on OpenAI service
- Secure API communication

---

# 10. Future Enhancements

- Authentication system
- Email history storage
- Database integration
- Multiple AI models support
- Email templates
- Export to PDF
- Multi-language support
