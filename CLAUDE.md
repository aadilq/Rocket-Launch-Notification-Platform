# Rocket Launch Notification Platform

## Project Overview
A microservices-based platform where users subscribe to upcoming rocket launches and receive email/SMS notifications when a launch is imminent, delayed, or changes status. Built to learn Docker, Kubernetes, and Jenkins.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind |
| API Gateway | Nginx |
| Backend API | Python/FastAPI |
| Notification Service | Node.js |
| Data Ingestion Service | Python |
| Database | PostgreSQL |
| Message Queue | RabbitMQ |
| Containerization | Docker + docker-compose |
| Orchestration | Kubernetes (minikube) |
| CI/CD | Jenkins |

**External APIs:**
- The Space Devs Launch Library 2 (free, no API key required)

**Notification Providers:**
- Email: SendGrid
- SMS: Twilio

---

## Project Structure

```
rocket-launch-platform/
├── frontend/              # React dashboard
├── api-gateway/           # Nginx config
├── backend-api/           # FastAPI — users, subscriptions, launch data
├── notification-service/  # Node.js — email (SendGrid) + SMS (Twilio)
├── ingestion-service/     # Python — polls launch APIs, pushes to queue
├── k8s/                   # Kubernetes manifests
├── jenkins/               # Jenkinsfile + pipeline config
├── docker-compose.yml
└── CLAUDE.md
```

---

## Features

### MVP (Phase 1-2)
- [ ] User signup/login
- [ ] Browse upcoming launches
- [ ] Subscribe to specific launches or agencies (SpaceX, NASA, ESA)
- [ ] Email notifications — T-24hr, T-1hr, launch status changes

### V2 (Phase 3-4)
- [ ] SMS notifications via Twilio
- [ ] Launch countdown timers on dashboard
- [ ] Notification history/log per user
- [ ] Retry logic for failed notifications

### V3 (Phase 5)
- [ ] UI polish — countdown timers, notification history/log

---

## Data Flow

### Overview
```
RocketLaunch.Live API
        │
        ▼
 Ingestion Service  ──── polls every 15 min
        │
        │  compares incoming data against DB
        │
        ├──── no change → do nothing
        │
        └──── change detected (status update, T-24hr, T-1hr)
                    │
                    ▼
              PostgreSQL  ──── update launch record
                    │
                    ▼
               RabbitMQ  ──── publish event to queue
                    │
                    ▼
        Notification Service  ──── consumes event
                    │
                    │  queries DB for subscribed users
                    │
                    ├──── email subscribers → SendGrid → Email
                    │
                    └──── SMS subscribers   → Twilio  → SMS
```

### Step-by-Step

1. **Poll** — Ingestion service calls RocketLaunch.Live every 15 minutes and receives a list of upcoming launches with fields like `name`, `agency`, `status`, `net` (Net Expected Time)

2. **Diff** — Ingestion service compares the incoming data against what is stored in PostgreSQL:
   - Has the launch `status` changed? (e.g. `Go` → `Hold`, `TBD` → `Go`)
   - Is the launch within 24 hours of `net`?
   - Is the launch within 1 hour of `net`?

3. **Persist** — Any updated launch data is written to the `launches` table in PostgreSQL

4. **Publish** — If a relevant change is detected, the ingestion service publishes an event to RabbitMQ with a payload like:
   ```json
   {
     "launch_id": "abc123",
     "event_type": "STATUS_CHANGE" | "T_MINUS_24HR" | "T_MINUS_1HR",
     "launch_name": "Falcon 9 — Starlink Group 6-10",
     "agency": "SpaceX",
     "net": "2025-06-15T14:30:00Z",
     "status": "Go"
   }
   ```

5. **Consume** — Notification service picks up the event from the RabbitMQ queue

6. **Lookup** — Notification service queries PostgreSQL for all users subscribed to this launch or its agency

7. **Dispatch** — For each subscribed user:
   - If they have email notifications enabled → build email template → send via SendGrid
   - If they have SMS notifications enabled → build SMS message → send via Twilio

### Notification Triggers

| Trigger | Condition | Message |
|---|---|---|
| T-24hr alert | `net` is 24 hours away | "Launch tomorrow: Falcon 9 lifts off in 24 hours" |
| T-1hr alert | `net` is 1 hour away | "Launch imminent: Falcon 9 lifts off in 1 hour" |
| Status change | `status` field changes | "Update: Falcon 9 launch has been scrubbed / moved to Go" |

---

## Build Phases

### Phase 1 — Foundation

#### 1.1 GitHub Setup
- [✅] Create GitHub repo (`rocket-launch-platform`)
- [✅] Clone repo locally, set `main` as default branch
- [✅] Add `.gitignore` (Python, Node, React, Docker, env files)
- [✅] Push initial commit with just `CLAUDE.md` and `.gitignore`
- [✅] Establish branch convention: `main` for stable, `feature/<name>` for work-in-progress

#### 1.2 Project Scaffolding
- [✅] Create top-level directory structure (`frontend/`, `backend-api/`, `notification-service/`, `ingestion-service/`, `api-gateway/`, `k8s/`, `jenkins/`)
- [✅] Add placeholder `README.md` in each service folder

#### 1.3 Backend API (FastAPI)
- [✅] Initialize FastAPI project with `requirements.txt`
- [✅] Create basic app entry point (`main.py`) with a health check route (`GET /health`)
- [✅] Set up PostgreSQL connection with SQLAlchemy
- [✅] Define initial DB models: `User`, `Launch`, `Subscription`
- [✅] Write `Dockerfile` for backend-api
- [✅] Test image builds and runs locally

#### 1.4 Frontend (React + Tailwind)
- [✅] Scaffold React app with Vite
- [✅] Install and configure Tailwind CSS
- [✅] Create skeleton pages: Home, Launches, Subscribe
- [✅] Add basic Navbar component
- [✅] Write `Dockerfile` for frontend
- [✅] Test image builds and runs locally

#### 1.5 API Gateway (Nginx)
- [✅] Write `nginx.conf` to route `/api/*` to backend-api and `/` to frontend
- [✅] Write `Dockerfile` for api-gateway
- [✅] Test routing locally

#### 1.6 Docker Compose
- [✅] Write `docker-compose.yml` wiring all services: frontend, backend-api, api-gateway, PostgreSQL
- [✅] Add environment variable support via `.env` file
- [✅] Verify all containers start and communicate (`docker-compose up`)
- [✅] Confirm health check route is reachable through Nginx

---

### Phase 2 — Core Features

#### 2.1 Data Ingestion Service
- [✅] Initialize Python project with `requirements.txt`
- [✅] Write scheduler (APScheduler or cron) to poll RocketLaunch.Live API every 15 minutes
- [✅] Parse and normalize launch data
- [✅] Persist launches to PostgreSQL via backend-api or direct DB write
- [✅] Write `Dockerfile` for ingestion-service
- [✅] Add to `docker-compose.yml`

#### 2.2 RabbitMQ Integration
- [✅] Add RabbitMQ to `docker-compose.yml`
- [✅] Connect ingestion-service as a producer — publish launch status change events to a queue
- [✅] Connect notification-service as a consumer — listen for events on the queue

#### 2.3 Backend API — User & Subscription Endpoints
- [✅] `POST /auth/register` — user signup
- [✅] `POST /auth/login` — user login (JWT)
- [✅] `GET /launches` — list upcoming launches
- [✅] `POST /subscriptions` — subscribe to a launch or agency
- [✅] `DELETE /subscriptions/:id` — unsubscribe

#### 2.4 Notification Service (Node.js + SendGrid)
- [✅] Initialize Node.js project with Express
- [✅] Integrate SendGrid SDK
- [✅] Build email templates: T-24hr alert, T-1hr alert, status change alert
- [✅] Consume RabbitMQ events and trigger appropriate email
- [✅] Write `Dockerfile` for notification-service
- [✅] Add to `docker-compose.yml`

#### 2.5 Frontend — Core UI
- [✅] Fetch and display upcoming launches from backend API
- [✅] Implement user signup/login forms with JWT storage
- [✅] Add subscribe/unsubscribe buttons per launch
- [✅] Show user's active subscriptions

---

### Phase 3 — Kubernetes

#### 3.1 Minikube Setup
- [✅] Install and start minikube
- [ ] Configure `kubectl` to point to minikube cluster
- [ ] Enable Ingress addon (`minikube addons enable ingress`)

#### 3.2 K8s Manifests
- [ ] Write `Deployment` + `Service` manifest for each service (frontend, backend-api, notification-service, ingestion-service, api-gateway)
- [ ] Write `Deployment` + `Service` for PostgreSQL and RabbitMQ
- [ ] Write `Ingress` manifest to replace Nginx routing

#### 3.3 ConfigMaps & Secrets
- [ ] Move environment variables to `ConfigMap` (non-sensitive: API URLs, queue names)
- [ ] Move credentials to `Secret` (DB password, SendGrid API key, JWT secret)

#### 3.4 Deploy & Verify
- [ ] Apply all manifests (`kubectl apply -f k8s/`)
- [ ] Verify all pods are running (`kubectl get pods`)
- [ ] Test end-to-end flow through the Ingress

---

### Phase 4 — Polish
- [ ] Launch countdown timers on dashboard (live, client-side)
- [ ] Notification history/log page per user
- [ ] UI cleanup — loading states, error handling, responsive layout

