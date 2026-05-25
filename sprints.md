# Sprint 1 - AI Email Writer MVP

## User Story 1: Enter Email Description

**As a user**
I want to enter a description of the email I need
**So that**
AI can understand my request and generate the appropriate email.

### Acceptance Criteria

- A textarea is displayed on the main page.
- The user can type a free-text description.
- The description field is required.
- The Generate button remains enabled only when valid input exists.
- The entered text is included in the API request.

---

## User Story 2: Select Email Type

**As a user**
I want to choose the type of email
**So that**
The generated content matches my purpose.

### Acceptance Criteria

- A dropdown is available for email type selection.
- Available options:
  - Professional
  - Friendly
  - Formal
  - Follow-up
  - Sales
- Professional is selected by default.
- The selected type is sent to the AI service.

---

## User Story 3: Generate Email Using AI

**As a user**
I want AI to generate a complete email
**So that**
I do not have to write it manually.

### Acceptance Criteria

- Clicking Generate sends a request to the backend.
- The backend sends the prompt to the AI provider.
- The generated response contains:
  - Subject
  - Email Body
- Generated content is displayed on the page.
- Generation is completed within a reasonable time.

---

## User Story 4: View Generated Result

**As a user**
I want to view the generated email in a clear format
**So that**
I can review it before using it.

### Acceptance Criteria

- Subject is displayed in a dedicated section.
- Email body is displayed below the subject.
- Content formatting is preserved.
- The result section is hidden until a response is generated.

---

## User Story 5: Copy Generated Email

**As a user**
I want to copy the generated email
**So that**
I can paste it directly into my email client.

### Acceptance Criteria

- A Copy button is displayed after generation.
- Clicking Copy copies the full email content.
- A success message is displayed.
- No page refresh occurs.

---

## User Story 6: Loading State

**As a user**
I want visual feedback during generation
**So that**
I know the system is processing my request.

### Acceptance Criteria

- A loading spinner appears after clicking Generate.
- The Generate button is disabled during processing.
- The loading state disappears once a response is received.
- Users cannot submit duplicate requests while processing.

---

## User Story 7: Error Handling

**As a user**
I want clear error messages
**So that**
I understand when something goes wrong.

### Acceptance Criteria

- Empty requests cannot be submitted.
- API failures are handled gracefully.
- User-friendly error messages are displayed.
- The application remains functional after an error.

---

## User Story 8: Regenerate Email

**As a user**
I want to generate an alternative version of the email
**So that**
I can get different wording without re-entering my description.

### Acceptance Criteria

- A Regenerate button is visible after the first result is displayed.
- Clicking Regenerate sends a new request to the backend using the same inputs.
- The previous result is replaced by the new result.
- Loading state applies during regeneration.
- The Regenerate button is disabled while processing.

---

## User Story 9: Select Email Tone

**As a user**
I want to choose the tone of the email
**So that**
The generated email matches my desired communication style.

### Acceptance Criteria

- A dropdown is available for tone selection.
- Available options: Polite, Confident, Friendly, Persuasive.
- Polite is selected by default.
- The selected tone is sent to the AI service alongside description and type.

---

# Sprint 2 - Polish, Hardening & Security

## User Story 10: Description Character Counter

**As a user**
I want to see how many characters I have left in my description
**So that**
I know when I am approaching the input limit.

### Acceptance Criteria

- A character counter is displayed below the description textarea.
- The maximum allowed length is 500 characters.
- The counter shows remaining characters (e.g. "320 / 500").
- The counter turns red when fewer than 50 characters remain.
- Input beyond 500 characters is prevented.
- The backend rejects descriptions exceeding 500 characters with a 400 error.

---

## User Story 11: Granular Copy Buttons

**As a user**
I want to copy the subject or body independently
**So that**
I can paste each part into my email client separately.

### Acceptance Criteria

- A copy icon button is shown next to the Subject label.
- A copy icon button is shown next to the Body label.
- Clicking either copies only that field to the clipboard.
- A success toast notification confirms the copy action.
- The existing "Copy Email" button continues to copy the full email.

---

## User Story 12: Toast Notifications

**As a user**
I want to see brief confirmation messages after actions
**So that**
I receive clear feedback without the UI permanently changing.

### Acceptance Criteria

- A toast notification appears after copying (subject, body, or full email).
- The toast is non-blocking and dismisses automatically after ~2.5 seconds.
- The toast appears in the bottom-right corner.
- No page refresh or state reset occurs.

---

## User Story 13: Backend Health Check

**As a developer**
I want a health check endpoint on the backend
**So that**
I can verify the service is running before sending AI requests.

### Acceptance Criteria

- GET /api/health returns 200 with `{ "status": "ok" }`.
- No authentication or input is required.
- Response time is under 100ms.

---

## User Story 14: Input Length Validation

**As a system**
I want to reject descriptions that are too long
**So that**
Excessive prompts do not cause unnecessary AI API costs or errors.

### Acceptance Criteria

- Backend rejects descriptions longer than 500 characters with a 400 error.
- Frontend prevents input beyond 500 characters.
- An appropriate error message is shown to the user.

---

## User Story 15: Secrets Protection (.gitignore)

**As a developer**
I want sensitive files excluded from version control
**So that**
API keys and environment variables are never accidentally committed.

### Acceptance Criteria

- `mail-writer-back/.env` is listed in `.gitignore`.
- `mail-writer-front/.env.local` is listed in `.gitignore`.
- The venv directory remains excluded.
- node_modules remain excluded.

---

# Sprint 3 - Reliability, UX Refinements & Mobile

## User Story 16: Request Timeout (NFR-001)

**As a user**
I want the application to stop waiting if AI takes too long
**So that**
I am not left staring at a spinner indefinitely.

### Acceptance Criteria

- All API requests have a 30-second timeout.
- If the request times out, a clear error message is shown: "Request timed out. Please try again."
- After a timeout the user can immediately retry.
- The request is aborted cleanly (no dangling network request).

---

## User Story 17: Persistent Result During Regeneration

**As a user**
I want to see my previous result while a new one is being generated
**So that**
I do not lose context and can compare the new result when it arrives.

### Acceptance Criteria

- The result card stays visible during regeneration.
- A loading overlay covers the result card with a "Regenerating…" indicator.
- The previous subject and body remain readable beneath the overlay.
- When regeneration completes the overlay disappears and new content is shown.
- Copy buttons remain functional on the previous result during regeneration.

---

## User Story 18: Reset / Start Over

**As a user**
I want to clear the form and start fresh
**So that**
I can write a completely different email without manually deleting my previous input.

### Acceptance Criteria

- A "Start over" action is available after a result is generated.
- Clicking it clears the description, resets type and tone to defaults, and hides the result.
- The action is not available during loading.

---

## User Story 19: Mobile Responsive Layout (NFR-003)

**As a user on a mobile device**
I want the form to be usable on small screens
**So that**
I can generate emails from my phone without horizontal scrolling or broken layouts.

### Acceptance Criteria

- On screens narrower than 640px the Email Type and Tone dropdowns stack vertically.
- The header, main container, and result card have correct padding on mobile.
- All buttons remain fully tappable on mobile screen sizes.
- No horizontal overflow occurs on any supported screen size.

---

## User Story 20: Backend Startup Validation

**As a developer**
I want the backend to detect and report a missing API key at startup
**So that**
Misconfiguration is caught immediately rather than at the first user request.

### Acceptance Criteria

- If `GROQ_API_KEY` is not set, a clear warning is logged to the console at startup.
- The `GET /api/health` endpoint returns `{ "status": "degraded", "openai_configured": false }` when the key is missing.
- The `GET /api/health` endpoint returns `{ "status": "ok", "openai_configured": true }` when the key is set.
- The `/api/generate` endpoint returns a descriptive 500 error when the key is missing.