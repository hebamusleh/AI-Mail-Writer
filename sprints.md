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