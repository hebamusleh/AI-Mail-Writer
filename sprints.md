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