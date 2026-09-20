# AI Automation Agency — AI Agent Instructions

## Quick Start

**Backend**: `npm run dev` (Express on `:3000`, auto-reload via nodemon)  
**Frontend**: Open `/frontend/index.html` directly (no build needed—vanilla HTML/CSS/JS)  
**Database**: `npm run db:init` (initializes PostgreSQL schema)

---

## Architecture at a Glance

**AutomaAI** is a B2B SaaS for automating business processes using n8n + AI. It has two layers:

1. **Frontend** — Static HTML landing pages + vanilla JS form capture (no framework)
2. **Backend** — Express REST API + PostgreSQL (skeleton: routes & controllers exist but are empty)

**Status**: Frontend ~80% complete. Backend needs implementation:
- Route handlers in `/backend/routes/` and `/backend/controllers/` 
- Service layer in `/backend/services/` (business logic goes here, not controllers)
- Database schema in `/backend/database/schema.sql`
- n8n workflow orchestration

Frontend patterns are established; new pages copy existing patterns from `contact.html` + `contact.js`.

---

## Frontend Patterns (Mature)

### Form Flow
Every form follows this pattern:
1. HTML form in page (e.g., `contact.html`) with `id="contact-form"`
2. JS module imports `{ submitContactForm }` from `api.js` (e.g., `contact.js`)
3. On submit: validate fields → call API → handle response → update status DOM element

**Example** `frontend/js/contact.js`:
```javascript
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validate()) {
    statusEl.classList.add('error');
    return;
  }
  const payload = { name, email, message, ... };
  await submitContactForm(payload);
  statusEl.classList.add('success');
});
```

### API Wrapper
Use `frontend/js/api.js` for all backend calls—it centralizes `API_BASE_URL` and error handling:
```javascript
export function submitContactForm(payload) {
  return request('/contact', { method: 'POST', body: JSON.stringify(payload) });
}
```

### CSS & Design Tokens
All colors/spacing/shadows in `frontend/css/main.css` `:root`. Use CSS variables:
```css
color: var(--color-text-muted);     /* #9aa5b3 */
padding: var(--space-5);             /* 1.5rem */
background: var(--color-accent-gradient);  /* cyan→purple */
```

### Scroll Animations
Add `.reveal` class to fade-in elements on scroll (auto-handled by `frontend/js/ui.js`):
```html
<section class="reveal">
  <h2>Fades in on scroll</h2>
</section>
```

### Accessibility Rules
- Skip link at top: `<a class="skip-link" href="#main-content">Skip to main</a>`
- Main content: `<main id="main-content">`
- Forms: add `aria-invalid`, `aria-label`, `role="alert"` to errors
- Nav: use `aria-current="page"` for active link

---

## Backend Patterns (Needs Implementation)

### Service Layer (Business Logic Home)
Create service files in `/backend/services/{feature}.js`. Services are **static classes** that export functions:

```javascript
// services/leadScoringService.js
export async function scoreContacts(contacts) {
  // AI/ML logic to rank leads
  return contacts.map(c => ({ ...c, score: 95, reason: 'High revenue potential' }));
}
```

Controllers are **thin**: accept HTTP input → call service → return response.

### Adding a Route
1. Create route file `/backend/routes/{domain}.routes.js` (e.g., `leads.routes.js`)
2. Add handler in `/backend/controllers/{domain}.controller.js`
3. Call service from controller: `const result = await leadService.scoreLeads(payload)`
4. Mount in `server.js`: `app.use('/api/leads', leadsRouter)`
5. Apply middleware as needed: `validate()`, `authenticate()`, `rateLimiter()`

**Example route structure**:
```javascript
// routes/contact.routes.js
import express from 'express';
import { postContact } from '../controllers/contact.controller.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();
router.post('/', validate(['name', 'email', 'message']), postContact);
export default router;
```

### Database & Migrations
- Schema: `/backend/database/schema.sql` (currently empty)
- Migrations: place SQL files in `/backend/database/`, auto-run via `migrate.js`
- Connection: use `backend/utils/db.js` pool (currently empty, needs implementation)

Create idempotent migrations:
```sql
-- migrations/001-contacts.sql
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### n8n Integration
Bridge: `backend/services/n8nClient.js` (currently empty). Should expose:
```javascript
export async function triggerWorkflow(workflowId, payload) {
  // POST to n8n webhook endpoint
  return axios.post(`${N8N_URL}/webhook/${workflowId}`, payload);
}
```

Workflows in `/backend/n8n/` (JSON files, currently empty) define:
- Trigger type (webhook, schedule, email)
- Input schema
- External integrations (CRM, email, calendar)
- Escalation conditions

---

## Key Middleware (Mostly Empty—Implement as Needed)

| File | Purpose | Status |
|------|---------|--------|
| `backend/middleware/validate.js` | express-validator wrapper | **Empty** |
| `backend/middleware/auth.js` | JWT verification | **Empty** |
| `backend/middleware/rateLimiter.js` | express-rate-limit wrapper | **Empty** |
| `backend/middleware/errorHandler.js` | Global error catcher | **Empty** |

---

## Config & Environment

`backend/config/env.js` is empty—should export:
```javascript
export default {
  DATABASE_URL: process.env.DATABASE_URL,
  N8N_URL: process.env.N8N_URL,
  API_PORT: process.env.API_PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
  MAIL_FROM: process.env.MAIL_FROM,
};
```

Use `.env` file for secrets (not in code).

---

## Cross-Codebase Communication Flow

```
Frontend form submit
  ↓ (vanilla JS event listener in contact.js)
Call api.js → request('/contact', { POST })
  ↓
Backend route: /api/contact
  ↓ (Express router in contact.routes.js)
Controller: postContact() → calls mailService.send()
  ↓ (Service layer handles business logic)
If automation needed: n8nClient.triggerWorkflow('contact-lead', payload)
  ↓
n8n receives webhook, orchestrates CRM/email/calendar
  ↓
Database updated (contacts, audits, bookings tables)
  ↓
Response → frontend status element (success/error)
```

---

## Development Priorities (by Completion)

1. **Backend skeleton** (60% empty)
   - Implement `backend/config/env.js` config loader
   - Setup `backend/utils/db.js` PostgreSQL pool
   - Implement `backend/middleware/validate.js` middleware
   - Fill in `backend/server.js` with route mounting + error handler
   - Implement `backend/middleware/auth.js` JWT middleware (for future login)

2. **Core routes & controllers**
   - `backend/routes/contact.routes.js` + controller → capture leads
   - `backend/routes/audit.routes.js` + controller → qualification forms
   - `backend/routes/booking.routes.js` + controller → schedule follow-ups

3. **Service layer**
   - `backend/services/mailService.js` → send emails via nodemailer
   - `backend/services/leadScoringService.js` → rank leads (mock for now)
   - `backend/services/n8nClient.js` → trigger workflows

4. **Database**
   - Define schema in `backend/database/schema.sql`
   - Create migrations (contacts, audits, bookings, leads tables)
   - Setup migration runner in `backend/database/migrate.js`

5. **n8n workflows**
   - Define JSON in `/backend/n8n/` (placeholder files exist)
   - Setup webhook endpoints and escalation logic

---

## Quick Patterns to Copy

**Add new HTML page**:
1. Copy `contact.html` → `newpage.html`
2. Update `<title>`, form `id`, page content
3. Create `newpage.js` that imports `{ submitForm }` from `api.js`
4. Add form export to `api.js`: `export function submitNewPage(payload) { ... }`
5. Link nav in other pages

**Add new backend route**:
1. Copy structure from `backend/routes/contact.routes.js`
2. Implement controller method in `backend/controllers/contact.controller.js`
3. Call service: `await automationService.qualifyLead(data)`
4. Mount in `backend/server.js`: `app.use('/api/newroute', newRouter)`

---

## Dependencies Overview

| Package | Version | Purpose | Status |
|---------|---------|---------|--------|
| **express** | 4.19.2 | HTTP server + routing | Core |
| **pg** | 8.11.3 | PostgreSQL client | Needs: pool setup in `backend/utils/db.js` |
| **dotenv** | 16.4.5 | Environment variables | Needs: load in `backend/config/env.js` |
| **express-validator** | 7.0.1 | Form validation | Needs: wrap in `backend/middleware/validate.js` |
| **jsonwebtoken** | 9.0.2 | Auth tokens | Needs: verify in `backend/middleware/auth.js` |
| **bcrypt** | 5.1.1 | Password hashing | Needs: integrate with auth |
| **express-rate-limit** | 7.2.0 | Rate limiting | Needs: configure in `backend/middleware/rateLimiter.js` |
| **helmet** | 7.1.0 | Security headers | Core |
| **cors** | 2.8.5 | CORS middleware | Core |
| **winston** | 3.12.0 | Logging | Use `backend/utils/logger.js` for structured logs |

---

## Avoid These Pitfalls

- **Hardcoded URLs**: Use `API_BASE_URL` (frontend) or `N8N_URL` from env (backend)
- **Secrets in code**: Use `.env` file only
- **Logic in controllers**: Move to services—controllers just orchestrate
- **Skipping validation**: Validate on both client (UX) and server (security)
- **Mutating database**: Use transactions for multi-step operations
- **Inline styles**: Use CSS variables in `frontend/css/main.css`
- **Blocking n8n workflows**: Keep n8n calls async; don't wait for complex operations
