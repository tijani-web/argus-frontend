# ARGUS Frontend

### Real-Time Event Analytics & Observability Dashboard

The ARGUS frontend is a modern, high-performance web application built with [Next.js](https://nextjs.org/) (App Router), React, and Tailwind CSS. It serves as the primary visualization and management portal for the ARGUS ingestion pipeline.

---

## ⚡ Features

- **Real-Time Stream Visualizer**: A rich, animated UI component that visualizes events flowing through the pipeline in real-time.
- **Dynamic Analytics Dashboard**: Connects to the ARGUS backend to visualize TimescaleDB aggregations and Redis live counters.
- **Project & API Key Management**: Provision isolated workspaces (Projects) and generate secure `argus_live_*` API keys instantly.
- **Dark Mode Aesthetic**: A sleek, dark-themed UI built with custom Tailwind configuration and Lucide React icons.
- **Integration Docs**: Interactive, copy-paste ready documentation for JavaScript, Python, Node.js, and raw cURL integrations.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS with custom theme extensions
- **Icons**: Lucide React
- **Hosting**: Deployed seamlessly on [Vercel](https://vercel.com)

---

## 🚀 Getting Started Locally

### Environment Setup
Create a `.env.local` file in the root of the project to map the frontend to your local or live backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8100
# OR set to your live Azure backend URL:
# NEXT_PUBLIC_API_URL=http://20.109.155.247:8100
```

### Running the App

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The application will hot-reload as you make modifications.

---

## 🔌 API Connectivity

The frontend uses Next.js `rewrites` configured in `next.config.ts` to cleanly proxy local API calls directly to the Spring Boot backend. 

All fetch calls within the frontend (e.g. `lib/api.ts`) hit `/api/v1/*`. If `NEXT_PUBLIC_API_URL` is defined, the edge network seamlessly forwards the request to your backend, avoiding CORS issues and protecting your API endpoint topology.

---

## 📦 Deployment

This project is optimized for deployment on Vercel.

1. Connect your GitHub repository to Vercel.
2. In your Vercel Project Settings > **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL` = `http://your-live-backend-ip:8100`
3. Hit Deploy! Vercel will automatically build the Next.js production bundle.
