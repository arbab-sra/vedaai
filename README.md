# VedaAI - AI Assessment Creator

VedaAI is an intelligent platform designed for teachers to effortlessly create and generate well-structured assessment papers using Artificial Intelligence.

# DEPLOYMENT_URL = https://vedaai-phi.vercel.app/

## 🚀 Architecture Overview

The system follows a modern full-stack architecture separated into two main parts:

### Frontend (Next.js)

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui for beautiful, accessible components.
- **State Management:** Zustand for lightweight, scalable global state.
- **Data Fetching & Real-time:** HTTP Polling (every 3 seconds) for robust, stateless status updates instead of WebSockets, making it fully compatible with serverless environments.
- **PDF Generation:** Client-side HTML to PDF generation using `html2pdf.js`.

### Backend (Node.js/Express)

- **Framework:** Express.js + Node.js
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose) to store assignment configurations and generated results.
- **Caching Layer (New):** Redis-based API caching for extremely fast response times on list and detail endpoints.
- **Background Jobs:** BullMQ + Redis for asynchronous processing of long-running AI tasks, ensuring the API doesn't block and scales well.
- **Deployment:** Vercel Serverless Functions compatible.
- **AI Integration:** Groq SDK utilizing `openai/gpt-oss-120b` (or similar fast models) for generating structured JSON question papers.

## 🧠 Approach

1. **Assignment Creation:** The user sets the constraints (Due Date, Question Types, Number of Questions, and Marks) via a clean, multi-step inspired UI.
2. **Job Queueing:** Upon submission, the Express API saves the pending assignment to MongoDB, invalidates the Redis cache, and adds a job to the BullMQ queue.
3. **Background Processing:** A dedicated worker picks up the job, constructs a highly-structured prompt, and queries the Groq API enforcing a JSON output format.
4. **Fast Polling & Caching:** The frontend polls the server every 3 seconds. The backend responds instantly (often in under 5ms) by serving the cached JSON directly from Redis.
5. **Result Display:** As the worker updates the status in the database and invalidates the cache, the frontend immediately fetches the newest data and replaces the loading state with a beautifully formatted Question Paper and Answer Key.

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18+)
- Docker (for local MongoDB & Redis)
- A [Groq API Key](https://console.groq.com/)

### 1. Start Infrastructure

Run the provided `docker-compose.yml` to spin up MongoDB and Redis locally.
\`\`\`bash
docker-compose up -d
\`\`\`

### 2. Setup Backend

\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file in the `backend` directory:
\`\`\`env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vedaai
REDIS_URL=redis://127.0.0.1:6379
GROQ_API_KEY=your_groq_api_key_here
\`\`\`
Start the development server:
\`\`\`bash
npm run dev

# Note: You may need to add "dev": "nodemon src/index.ts" to package.json scripts

\`\`\`

### 3. Setup Frontend

\`\`\`bash
cd frontend
npm install
\`\`\`
Create a `.env.local` file in the `frontend` directory:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
\`\`\`
Start the frontend server:
\`\`\`bash
npm run dev
\`\`\`

## 🌟 Bonus Features Implemented

- **Caching Layer:** Redis cache layer for the backend endpoints ensures fast load times and minimal database load.
- **PDF Export:** High-quality PDF generation retaining visual structure using `html2pdf.js`.
- **Robust Background Processing:** BullMQ + Redis ensures reliability. The main API operates statelessly on Vercel, delegating long-running AI generation to robust workers.
- **Beautiful UI:** Fully responsive design matching the Figma reference exactly.
