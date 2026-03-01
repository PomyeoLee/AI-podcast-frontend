# AI Podcast — Project Introduction

**The Weekly Byte** is a fully automated, end-to-end AI-powered podcast platform that collects weekly news, generates conversational scripts using large language models, synthesizes multi-voice audio, and delivers episodes through a responsive web interface — with zero manual intervention.

---

## Overview

Every week, the system automatically:
1. Fetches trending news articles from multiple sources across 7 topic categories
2. Generates a two-host conversational podcast script using Gemini 2.5 Flash
3. Synthesizes natural-sounding audio with distinct voices and background music via Google Cloud TTS
4. Publishes the episode — audio, article summaries, and metadata — to a web app accessible anywhere

---

## System Architecture

The platform consists of three independently deployed services on **Google Cloud Platform**:

![System Architecture](/system-architecture.png)

---

## 01 · Backend Pipeline

The backend implements a **four-stage AI pipeline** that transforms raw news data into a fully produced podcast episode, running autonomously on a weekly schedule.

### Stage 1 — Multi-Source News Ingestion

A topic-aware ingestion layer aggregates news across 7 domains — *World, Business, Technology, Entertainment, Sports, Science, and Health* — using a dual-API strategy with automatic fallback for high availability. Raw article content is extracted and normalized through an NLP-based parsing pipeline, and a deduplication mechanism ensures semantic uniqueness across sources before the data proceeds downstream.

### Stage 2 — LLM-Driven Content Generation

The normalized corpus is fed into **Google Gemini 2.5 Flash** (via Vertex AI) through two parallel generation pipelines:

- **Script synthesis**: a prompt-engineered instruction set directs the model to produce a natural, two-host conversational script — weaving disparate news topics into a single coherent narrative with smooth transitions and a consistent editorial voice.
- **Episode summarization**: a structured summarization prompt generates rich, per-article write-ups with dynamic content injection (images, source attribution, read-more links) via a placeholder-replacement system, alongside a concise 30-word episode title through an abstractive summarization pass.

### Stage 3 — Neural Speech Synthesis & Audio Production

The generated script is passed to **Google Cloud Text-to-Speech** (WaveNet neural voices) for multi-speaker synthesis. Each speaker turn is rendered independently, then assembled into a continuous audio track through a post-production layer built on `pydub` — applying voice normalization, dynamic range control, and professional background music mixing with automated ducking and fade transitions.

### Stage 4 — Idempotent Artifact Persistence

All generated artifacts (audio, script, summaries, metadata) are persisted to **Google Cloud Storage** under a date-partitioned namespace. The pipeline is fully idempotent — each stage checks for existing artifacts before execution, enabling safe retries and fault-tolerant re-runs without redundant API calls or duplicated content.

---

## 02 · API Layer

The **FastAPI service** acts as a secure, stateless data gateway between the GCS storage layer and the web frontend. It abstracts all cloud storage concerns behind a clean REST interface, exposing only what the client needs — episode listings and on-demand content delivery.

Access to private media assets is governed through **GCS v4 signed URL generation**, producing time-scoped, cryptographically authorized URLs at request time. This approach enforces zero-trust access to raw storage without introducing a dedicated media server or exposing bucket credentials, keeping the security boundary tight while maintaining low latency for content delivery.

---

## 03 · Frontend

The frontend is a **Next.js 15** (App Router) application, designed around a server-component-first architecture that balances dynamic content freshness with performance at scale. Pages are rendered server-side with **Incremental Static Regeneration (ISR)**, minimizing redundant upstream API calls while ensuring episode data stays current.

The UI layer leverages **shadcn/ui** on top of Radix UI primitives for a fully accessible, composable component system — paired with Tailwind CSS for a utility-first design approach. Episode descriptions are delivered as raw Markdown and rendered client-side via a **remark/remark-gfm** pipeline, supporting rich content including images, tables, and inline source links.

The custom audio player is built as a stateful React component with full playback control — seek, variable speed, volume normalization, and direct download — providing a native app-like listening experience in the browser. A **dark/light theme system** with automatic OS-preference detection, skeleton-screen loading states, and background image customization round out a polished, production-grade user experience.

---

## Tech Stack

### Backend
| Component | Technology |
|-----------|-----------|
| Language | Python 3 |
| Web Framework | FastAPI + Uvicorn |
| LLM | Google Gemini 2.5 Flash (via Vertex AI) |
| Text-to-Speech | Google Cloud Text-to-Speech (WaveNet voices) |
| Audio Processing | pydub |
| News Sources | NewsAPI + GNews API |
| Article Parsing | newspaper3k |
| Cloud Storage | Google Cloud Storage |
| Deployment | Docker + Cloud Run Job & Service |
| Orchestration | Google Cloud Scheduler |

### Frontend
| Component | Technology |
|-----------|-----------|
| Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui (Radix UI) |
| Markdown | remark + remark-gfm |
| Deployment | Docker + Google Cloud Run |

---

## Scheduling & Automation

The pipeline is fully automated via **Google Cloud Scheduler**:

- **Trigger**: Every Monday at 8:00 AM Eastern Time
- **Target**: Cloud Run Job (`ai-podcast-job`)
- **Mode**: Production (fetches live news and calls real APIs)
- **Idempotent**: Re-running the job safely skips already-completed steps by checking GCS

---

## Data Flow

![Data Flow](/data-flow.png)

---

*Interested in my other projects? Visit my [personal homepage](https://pengyaoli-portfolio-service-202278901138.us-central1.run.app).*
