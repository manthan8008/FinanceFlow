# FinanceFlow

FinanceFlow is a full-stack AI-powered personal finance tracker built with the MERN stack. It is designed like a production SaaS dashboard: authenticated users can track income and expenses, manage budgets, monitor savings goals, scan receipts, generate reports, and ask a Gemini-powered financial assistant for personalized insights.

This project was built to demonstrate end-to-end product engineering: frontend architecture, REST API design, secure authentication, MongoDB data modeling, AI integration, responsive UI, and deployment-ready configuration.

## Highlights

- Full-stack MERN application with a separated `client/` and `server/` architecture
- JWT authentication with bcrypt password hashing and protected routes
- AI financial assistant powered by Google Gemini 2.5 Flash
- Expense, income, budget, goal, notification, report, and profile modules
- Dashboard analytics with Recharts visualizations
- Responsive SaaS-style UI with Tailwind CSS, Framer Motion, dark mode, loading states, and toast notifications
- Secure Express API with Helmet, CORS, rate limiting, request validation, and MongoDB input sanitization
- Environment-based configuration for local development and cloud deployment

## Tech Stack

**Frontend**

- React
- Vite
- JavaScript ES modules
- Tailwind CSS
- React Router DOM
- Axios
- Recharts
- Framer Motion
- React Hot Toast
- Lucide React

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Zod
- Multer
- Helmet
- Express Rate Limit
- Google Generative AI SDK

## Core Features

### Authentication

- Register, login, logout, and demo account access
- JWT-based session persistence
- Password hashing with bcrypt
- Change password and reset password endpoints
- Auth middleware for protected API routes

### Personal Finance Tracking

- Add, edit, delete, search, filter, and sort expenses
- Track income by source and category
- Manage category budgets with usage percentages and overspending alerts
- Create and monitor financial goals with animated progress bars
- View recent transactions and financial calendar data

### Analytics Dashboard

- Current balance
- Monthly income
- Monthly expenses
- Savings
- Budget usage
- Net cash flow
- Monthly spending trend
- Category breakdown
- Income vs expense comparison

### AI Financial Assistant

- Conversational assistant using Gemini 2.5 Flash
- Spending analysis based on user transaction history
- Budget recommendations
- Monthly summaries
- Savings suggestions
- Educational financial guidance
- Persistent AI chat history

### Reports and Receipts

- Monthly, annual, category, and budget report data
- CSV export support on the frontend
- Backend report endpoints
- Receipt upload endpoint for JPG, PNG, and PDF files
- Modular OCR-ready receipt scanner service

## Architecture

```txt
FinanceFlow/
  client/
    src/
      components/
      contexts/
      data/
      layouts/
      pages/
      services/
      utils/
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
```

The frontend communicates with the backend through an Axios API client. JWT tokens are stored on the client and sent as `Authorization: Bearer <token>` headers for protected requests.

The backend follows an MVC-style REST architecture:

- `models/` define MongoDB collections with Mongoose
- `routes/` map HTTP endpoints to controllers
- `controllers/` handle request/response logic
- `middleware/` handles authentication, validation, uploads, sanitization, and errors
- `services/` contains reusable business logic such as Gemini and notifications

## Database Models

FinanceFlow uses MongoDB collections for:

- `Users`
- `Expenses`
- `Income`
- `Budgets`
- `FinancialGoals`
- `Notifications`
- `AIChatHistory`
- `Receipts`
- `PasswordResetTokens`

Each finance record is scoped to a user, which keeps data isolated and enables secure multi-user behavior.

## API Overview

Base URL:

```txt
http://localhost:5000/api
```

### Auth

```txt
POST /auth/register
POST /auth/login
POST /auth/demo
GET  /auth/me
POST /auth/change-password
POST /auth/reset-password
POST /auth/confirm-reset-password
```

### Finance

```txt
GET    /expenses
POST   /expenses
PUT    /expenses/:id
DELETE /expenses/:id
POST   /expenses/scan-receipt

GET    /incomes
POST   /incomes
PUT    /incomes/:id
DELETE /incomes/:id

GET    /budgets
POST   /budgets
PUT    /budgets/:id
DELETE /budgets/:id

GET    /goals
POST   /goals
PUT    /goals/:id
DELETE /goals/:id
```

### Insights

```txt
GET  /dashboard/summary
GET  /ai/history
POST /ai/chat
GET  /reports/:type
GET  /notifications
PUT  /profile
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB running locally or a MongoDB Atlas connection string
- Google Gemini API key for live AI responses

### 1. Clone and install

```bash
git clone <your-repository-url>
cd FinanceFlow
npm install
npm run install:all
```

### 2. Configure environment variables

Create the backend environment file:

```bash
cp server/.env.example server/.env
```

Update `server/.env`:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/financeflow
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-characters
JWT_EXPIRES_IN=7d
DEMO_EMAIL=demo@financeflow.app
DEMO_PASSWORD=Demo@12345
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

Create the frontend environment file:

```bash
cp client/.env.example client/.env
```

Expected frontend value:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the application

Run frontend and backend together:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev --prefix server
npm run dev --prefix client
```

Frontend:

```txt
http://localhost:5173
```

Backend:

```txt
http://localhost:5000
```

### Demo Account

```txt
Email: demo@financeflow.app
Password: Demo@12345
```

## Scripts

Root:

```bash
npm run dev          # Run client and server together
npm run build        # Build the frontend
npm run start        # Start the backend
npm run install:all  # Install client and server dependencies
```

Client:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Server:

```bash
npm run dev
npm run start
```

## Security Considerations

FinanceFlow includes several production-minded security practices:

- Passwords are never stored in plain text
- JWT tokens protect private routes
- API input is validated with Zod
- MongoDB operator injection is sanitized
- Helmet sets secure HTTP headers
- Rate limiting reduces brute-force and abuse risk
- CORS is restricted through environment configuration
- Secrets are loaded from `.env` and should never be committed

## Deployment

### Frontend

The React app can be deployed to Vercel, Netlify, or any static hosting platform.

Set:

```env
VITE_API_URL=https://your-backend-url/api
```

For this project on Vercel, the value should include the Render origin and the
`/api` path:

```env
VITE_API_URL=https://financeflow-backend-58w4.onrender.com/api
```

Vite reads `VITE_*` variables at build time, so redeploy the frontend after
changing this value.

### Backend

The Express API can be deployed to Render, Railway, Fly.io, or similar Node hosting providers.

Set:

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-url
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-production-secret
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

`CLIENT_URL` must be the exact browser origin of the deployed frontend, such as:

```env
CLIENT_URL=https://your-vercel-project.vercel.app
```

To allow multiple frontend origins, separate them with commas:

```env
CLIENT_URL=http://localhost:5173,https://your-vercel-project.vercel.app,https://www.your-custom-domain.com
```

After changing Render environment variables, redeploy or restart the Render
service. You can verify CORS from a terminal with:

```bash
curl -i -H "Origin: https://your-vercel-project.vercel.app" https://financeflow-backend-58w4.onrender.com/api/health
```

The response should include:

```txt
access-control-allow-origin: https://your-vercel-project.vercel.app
```

### Database

MongoDB Atlas is recommended for production. Create a cluster, add the connection string to `MONGODB_URI`, and ensure the deployment host has network access.

## Engineering Decisions

- **Separated client and server folders** keep deployment targets clean and make the project easy to evaluate.
- **Mongoose models** enforce consistent document structure while keeping MongoDB flexible.
- **Controller-based API design** keeps routes small and business logic testable.
- **Gemini runs on the backend** so API keys are not exposed to the browser.
- **Dashboard values are aggregated server-side** to keep client code focused on presentation.
- **Fallback-friendly receipt scanner design** allows OCR providers to be replaced without changing the rest of the expense workflow.

## Future Improvements

- Add automated API and component tests
- Add email delivery for password reset tokens
- Replace the receipt scanner stub with Gemini Vision or a dedicated OCR provider
- Add recurring transaction automation
- Add PDF generation with a production PDF renderer
- Add role-based admin analytics
- Add Docker Compose for one-command local infrastructure

## What This Project Demonstrates

This project demonstrates practical full-stack engineering skills that are directly relevant to SaaS product teams:

- Building production-style REST APIs
- Designing MongoDB schemas for multi-user applications
- Implementing secure authentication and authorization
- Creating responsive React dashboards
- Integrating AI safely through a backend service layer
- Managing real-world app concerns such as validation, environment configuration, uploads, reports, and deployment readiness

## License

This project is available for portfolio and educational use.
