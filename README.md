# The Weekly Byte — AI Podcast Web App

A fully automated, end-to-end AI-powered podcast platform. Every week, the system fetches trending news, generates a conversational two-host script using Gemini 2.5 Flash, synthesizes natural-sounding audio via Google Cloud TTS, and publishes the episode through this responsive web interface.

🎙️ **Live:** [patrick.aipodcast.blog](https://patrick.aipodcast.blog)
👤 **Portfolio:** [Personal Homepage](https://pengyaoli-portfolio-service-202278901138.us-central1.run.app)

---

## Tech Stack

**Frontend**
- [Next.js 15](https://nextjs.org/) (App Router) + React 19 + TypeScript
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
- Deployed on Google Cloud Run via Docker

**Backend API** (separate repo)
- Python + FastAPI
- Google Gemini 2.5 Flash (LLM) via Vertex AI
- Google Cloud Text-to-Speech (WaveNet)
- Google Cloud Storage + Google Cloud Scheduler

---

## Features

- Episode list with background images, auto-cached via ISR
- Full audio player — seek, speed control (0.5×–2×), volume, download
- Per-episode article summaries with images and source links
- Dark / Light theme with OS preference detection
- Responsive design for mobile, tablet, and desktop
- Markdown-rendered content pages (Project Intro, About Me)

---

## Local Development

**Prerequisites:** Node.js 18+, npm or pnpm

```bash
# Clone and install
git clone <repo-url>
cd podcast-web
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API URL

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

See `.env.example` for all required variables:

```
NEXT_PUBLIC_API_BASE_URL=      # Backend FastAPI service URL
NEXT_PUBLIC_ADMIN_PASSWORD=    # Admin settings panel password
```

---

## Deployment

Deployed to Google Cloud Run using Cloud Build (no local Docker required):

```bash
# Authenticate
gcloud auth login

# Deploy
bash deploy-source-to-cloud-run.sh
```

The script builds the Docker image via Cloud Build, pushes to GCR, and deploys to Cloud Run automatically.

---

## Project Structure

```
app/
├── content/          # Markdown files (About Me, Project Intro)
├── podcast/[date]/   # Episode detail pages
├── about-me/
├── project-intro/
└── page.tsx          # Home — episode list

components/
├── enhanced-audio-player.tsx
├── podcast-list-with-view-more.tsx
├── navigation-banner.tsx
└── ui/               # shadcn/ui components

lib/
├── api.ts            # FastAPI client
├── cache.ts          # ISR cache logic
└── markdown.ts       # Remark rendering pipeline
```

---

## License

MIT
