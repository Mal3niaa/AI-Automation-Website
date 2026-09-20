# AI Automation Website

> Full-stack platform for AI-powered business process automation.

AI Automation Website is a full-stack web application designed for an AI automation agency. The platform demonstrates how businesses can use AI agents, workflow automation and API integrations to automate repetitive operations, manage leads and improve customer communication.

The project combines a responsive frontend, Node.js/Express backend, PostgreSQL database and n8n automation workflows.

---

## 🚀 Features

### 🤖 AI Business Automation

The platform is designed around AI-powered automation of repetitive business processes.

The backend communicates with automation workflows through n8n and provides a dedicated automation service layer.

### 🔎 Automation Audit

Businesses can submit information about their current processes through the automation audit.

The audit workflow can be used to identify:

* repetitive tasks
* potential automation opportunities
* possible integrations
* estimated business improvements

The frontend contains a dedicated `automation-audit.html` page and the backend provides a separate audit controller and route.

### 🎯 Lead Qualification & Scoring

The application contains a dedicated lead scoring service:

```text
backend/services/leadScoringService.js
```

Leads can be classified according to their characteristics and qualification data.

This functionality can be connected to automated follow-up and notification workflows.

### 📅 Appointment Booking

The platform provides appointment booking functionality.

The booking system consists of:

* frontend booking interface
* backend controller
* API route
* n8n appointment workflow

The corresponding n8n workflow is:

```text
backend/n8n/appointment-booking.json
```

### 📩 Contact & Lead Management

The contact form allows visitors to submit inquiries.

Contact requests can be processed through the backend and connected to automated workflows.

The project includes:

```text
backend/controllers/contact.controller.js
backend/routes/contact.routes.js
backend/n8n/contact-lead.json
```

### 🔐 Authentication

The application includes user authentication functionality.

The project contains:

```text
backend/routes/auth.routes.js
backend/middleware/auth.js
frontend/login.html
frontend/dashboard.html
```

Protected resources can be handled using authentication middleware.

### 📊 Dashboard

Authenticated users have access to a dedicated dashboard.

The frontend dashboard is implemented in:

```text
frontend/dashboard.html
frontend/js/dashboard.js
frontend/css/dashboard.css
```

---

# ⚡ n8n Automation

A major part of the project is the integration with **n8n**.

The repository contains several automation workflows:

```text
backend/n8n/
│
├── appointment-booking.json
├── automation-audit.json
├── contact-lead.json
├── follow-up.json
├── lead-qualification.json
└── notification.json
```

These workflows represent different business automation scenarios.

### Automation Architecture

```text
                    ┌──────────────────┐
                    │     Frontend     │
                    │ HTML / CSS / JS  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   REST API       │
                    │ Node.js/Express  │
                    └────────┬─────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
          PostgreSQL       Services      n8n
                              │            │
                              │            ▼
                              │      AI Automation
                              │            │
                              └────────────┘
```

---

## 🧠 AI Agent

The project includes a dedicated AI agent prompt:

```text
backend/n8n/prompts/business-automation-agent.txt
```

This prompt is used as part of the business automation workflow and provides the AI agent with instructions for analyzing business automation scenarios.

---

# 🏗️ Backend Architecture

The backend follows a modular Express.js structure.

```text
backend/
│
├── config/
├── controllers/
├── database/
├── middleware/
├── n8n/
├── routes/
├── services/
└── utils/
```

### Controllers

Business logic for HTTP requests is separated into controllers:

```text
controllers/
├── audit.controller.js
├── booking.controller.js
├── contact.controller.js
└── content.controller.js
```

This keeps request handling separated from routing and reusable service logic.

### Routes

API endpoints are organized into dedicated route modules:

```text
routes/
├── audit.routes.js
├── auth.routes.js
├── booking.routes.js
├── contact.routes.js
├── content.routes.js
└── n8n.routes.js
```

### Services

Reusable business logic is located in:

```text
services/
├── automationService.js
├── leadScoringService.js
├── mailService.js
├── mockAutomationService.js
└── n8nClient.js
```

This layer separates external integrations and business logic from HTTP request handling.

---

# 🛡️ Middleware

The backend includes several middleware modules:

```text
middleware/
├── auth.js
├── errorHandler.js
├── rateLimiter.js
└── validate.js
```

They are responsible for:

* authentication
* request validation
* rate limiting
* centralized error handling

This provides a more structured and maintainable backend architecture.

---

# 🗄️ PostgreSQL

The application uses PostgreSQL for persistent data storage.

Database-related files are located in:

```text
backend/database/
├── migrate.js
└── schema.sql
```

The database connection utility is:

```text
backend/utils/db.js
```

Database configuration is loaded through environment variables.

---

# 🌐 Frontend

The frontend is built using:

* HTML5
* CSS3
* JavaScript

No frontend framework is required.

## Pages

```text
frontend/
├── index.html
├── about.html
├── services.html
├── solutions.html
├── case-studies.html
├── pricing.html
├── automation-audit.html
├── contact.html
├── login.html
└── dashboard.html
```

### JavaScript

Frontend functionality is separated into dedicated modules:

```text
frontend/js/
├── api.js
├── audit.js
├── calculator.js
├── contact.js
├── dashboard.js
├── main.js
├── navigation.js
└── ui.js
```

### CSS

The styling system is separated into:

```text
frontend/css/
├── main.css
├── landing.css
├── components.css
├── forms.css
├── dashboard.css
└── responsive.css
```

The dedicated responsive stylesheet provides support for different screen sizes.

---

# 📋 Business Solutions

The platform is designed around several common business automation scenarios:

### Lead Qualification

```text
New Lead
   ↓
Backend
   ↓
Lead Qualification
   ↓
AI Analysis
   ↓
Lead Score
   ↓
Follow-up / Notification
```

### Appointment Booking

```text
Customer
   ↓
Booking Form
   ↓
Backend API
   ↓
n8n Workflow
   ↓
Appointment Processing
```

### Contact Automation

```text
Contact Form
   ↓
Backend
   ↓
n8n
   ↓
Lead Processing
   ↓
Notification / Follow-up
```

### Automation Audit

```text
Business Information
        ↓
Automation Audit
        ↓
AI Analysis
        ↓
Automation Opportunities
        ↓
Recommendations
```

---

# 📂 Complete Project Structure

```text
AI-Automation-Website/
│
├── backend/
│   ├── config/
│   │   └── env.js
│   │
│   ├── controllers/
│   │   ├── audit.controller.js
│   │   ├── booking.controller.js
│   │   ├── contact.controller.js
│   │   └── content.controller.js
│   │
│   ├── database/
│   │   ├── migrate.js
│   │   └── schema.sql
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validate.js
│   │
│   ├── n8n/
│   │   ├── appointment-booking.json
│   │   ├── automation-audit.json
│   │   ├── contact-lead.json
│   │   ├── follow-up.json
│   │   ├── lead-qualification.json
│   │   ├── notification.json
│   │   └── prompts/
│   │       └── business-automation-agent.txt
│   │
│   ├── routes/
│   │   ├── audit.routes.js
│   │   ├── auth.routes.js
│   │   ├── booking.routes.js
│   │   ├── contact.routes.js
│   │   ├── content.routes.js
│   │   └── n8n.routes.js
│   │
│   ├── services/
│   │   ├── automationService.js
│   │   ├── leadScoringService.js
│   │   ├── mailService.js
│   │   ├── mockAutomationService.js
│   │   └── n8nClient.js
│   │
│   ├── utils/
│   │   ├── db.js
│   │   └── logger.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/
│   │   └── logos/
│   │
│   ├── css/
│   ├── js/
│   │
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   ├── solutions.html
│   ├── case-studies.html
│   ├── pricing.html
│   ├── automation-audit.html
│   ├── contact.html
│   ├── login.html
│   └── dashboard.html
│
├── .gitignore
├── package-lock.json
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/seregabarcan-afk/AI-Automation-Website.git
cd AI-Automation-Website
```

## 2. Install dependencies

Install the project dependencies:

```bash
npm install
```

Backend dependencies can be installed separately if required:

```bash
cd backend
npm install
```

## 3. Configure environment variables

Create:

```text
backend/.env
```

based on:

```text
backend/.env.example
```

Example configuration:

```env
PORT=3000

DATABASE_URL=your_database_url

N8N_ENABLED=false
N8N_WEBHOOK_URL=your_n8n_webhook_url

OPENAI_API_KEY=your_api_key

SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_password
```

> Never commit the `.env` file or API keys to the repository.

## 4. Configure PostgreSQL

Create the required PostgreSQL database and run the database schema/migration process provided by the project.

Database schema:

```text
backend/database/schema.sql
```

Migration script:

```text
backend/database/migrate.js
```

## 5. Configure n8n

Import the required workflows from:

```text
backend/n8n/
```

into your n8n instance.

Configure the webhook URLs and credentials required by the workflows.

For local development, n8n integration can be disabled if supported by the current environment configuration.

## 6. Start the backend

```bash
cd backend
npm run dev
```

The backend will run on the port configured in `.env`.

---

# 🔒 Security

The project includes several security-related mechanisms:

* environment-based secrets
* authentication middleware
* request validation
* API rate limiting
* centralized error handling
* structured logging

Sensitive configuration should always remain outside version control.

---

# 🧪 Development

The project includes a mock automation service:

```text
backend/services/mockAutomationService.js
```

This allows automation functionality to be developed and tested without requiring every external automation service to be active.

---

# 🎯 Project Goals

The project was created to demonstrate a complete AI automation platform rather than a static business website.

It demonstrates practical experience with:

* frontend development
* backend development
* REST API design
* Node.js
* Express.js
* PostgreSQL
* authentication
* middleware architecture
* request validation
* rate limiting
* AI agents
* n8n automation
* webhooks
* lead qualification
* appointment automation
* email automation
* responsive web design
* database migrations
* modular application architecture

---

# 🚧 Project Status

**In development**

The project is being developed as a portfolio project and as a foundation for an AI automation agency platform.

---

# 👨‍💻 Author

**Serhii Barchan**

Web Developer & AI Automation Developer

GitHub:
https://github.com/Mal3niaa
