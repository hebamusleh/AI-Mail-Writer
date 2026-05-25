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
|      OpenAI          |
+----------------------+
```

---

# 3. Frontend Architecture (Next.js)

## 3.1 Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- Axios

---

## 3.2 Folder Structure in mail-writer-front folder

```text
src/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── Layout ├── Header
|   |          └── Sidebar
|   |
│   └── ui
│
├── modules/
│   └── mail-writer├── email-form.tsx
|                  ├── email-result.tsx
|                  └── ai-mail-page.tsx
|
├── services/
│   └── api.ts
│
├── types/
│   └── email.ts
│
└── lib/
    └── utils.ts
```

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

- Flask
- Python
- Flask-CORS
- Requests (for OpenAI API)

---

## 4.2 Folder Structure

```text
mail-writer-back/
│
├── app.py
├── routes/
│   └── email_routes.py
│
├── services/
│   └── ai_service.py
│
├── models/
│   └── email_model.py
│
└── config.py
```

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
POST /api/generate-email
```

### Request Body

```json
{
  "description": "Write an apology email for delay",
  "emailType": "Professional"
}
```

### Response

```json
{
  "subject": "Project Delay Apology",
  "body": "Dear Client..."
}
```

---

# 5. AI Integration Layer

## Responsibilities

- Convert user input into structured prompt
- Send request to OpenAI
- Parse response
- Return structured JSON

---

## Example Prompt

```text
Write a professional email.

Type: Professional
Description: Apology for 3-day delay in project delivery.

Return:
- Subject
- Email Body
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

Backend (Flask)
→ Railway / Render

AI Service
→ OpenAI API
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
