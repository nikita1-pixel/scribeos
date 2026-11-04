# ScribeOS

> An AI-powered B2B customer feedback intelligence SaaS. Ingests raw feedback, runs automated categorization and sentiment analysis, powers semantic search over customer pain points, and synthesizes support replies and product insights via Retrieval-Augmented Generation (RAG).

[![Node.js](https://img.shields.io/badge/Node.js-18+-68a063?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-black?logo=express)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18+-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📌 Problem & System Purpose

Product managers and customer success teams collect feedback across scattered channels (support emails, app store reviews, user interviews, chat logs). Processing this data manually introduces key friction points:

1. **Volume and Categorization Overhead:** Manually tagging sentiment, bug reports, and feature requests does not scale.
2. **Keyword Search Limitations:** Searching for *"checkout problems"* misses feedback mentioning *"card dropped on mobile Safari"* or *"Apple Pay spinner loops"*.
3. **API Latency Bottlenecks:** Running generative LLM inference inside standard HTTP request-response cycles causes client timeouts and UI freezing.

**ScribeOS** addresses this by separating immediate data ingestion from intensive AI tasks via an **event-driven, decoupled worker queue**, indexing feedback embeddings for semantic discovery, and using grounded RAG pipelines for deterministic query answers.

---

## 🏗️ Architecture & Processing Model

```text
[ Client (Vite + React) ]
            │
            ▼  (HTTP POST /api/feedback with JWT)
[ Express API Gateway ] ────── (Fast 201 ACK: Status "Pending") ────► [ Client UI ]
            │
            ├──► Persists base feedback document to MongoDB
            │
            └──► Enqueues lightweight job payload { feedbackId }
                        │
                        ▼
             [ Redis Broker (BullMQ) ]
                        │
                        ▼
             [ Background Worker Process ]
               ├── 1. Fetches feedback document by ID
               ├── 2. Dispatches inference call to Groq LLM (Categorization & Sentiment)
               ├── 3. Computes vector embedding
               ├── 4. Upserts vector index & results to MongoDB
               └── 5. Emits real-time completion event (Socket.io) ──► [ Client UI ]
```

---

## 🗺️ Project Roadmap & Current Progress

- [x] **Phase 1 — Project Scaffold:** Express server configuration, Vite/React client setup, single root Git repository, strict `.gitignore` configurations.
- [x] **Phase 2 — JWT Auth & Synchronous Feedback CRUD:** Mongoose schemas (`User`, `Feedback`), custom authentication gatekeeper middleware (`protect`), password hashing via salted bcrypt hooks, and user-scoped resource ownership verification.
- [x] **Phase 3 — Queue Broker (BullMQ + Redis):** Decoupling ingestion from heavy workloads via an asynchronous background job pipeline.
- [x] **Phase 4 — Worker & Groq LLM Engine:** Automated sentiment extraction, thematic tagging, and handling external API rate limits with exponential backoff and DLQs.
- [x] **Phase 5 — Vector Embeddings & MongoDB Atlas Vector Search:** Generating semantic embeddings for meaning-based query retrieval.
- [x] **Phase 6 — RAG Pipeline:** Context-bounded generation for customer reply drafts and trend synthesis.
- [x] **Phase 7 — Real-Time Client Dispatch:** Live status push via Socket.io to eliminate polling.
- [x] **Phase 8 — Production Deployment & CI/CD:** Multi-stage containerization, cloud hosting, and automated testing suites.

---

## 🛠️ Tech Stack & Technical Rationale

| Layer | Technology | Engineering Rationale |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite | Fast HMR, clean component boundary isolation, and responsive UI performance. |
| **Backend API** | Node.js, Express.js | Non-blocking I/O event loop optimized for concurrent RESTful API handling. |
| **Database** | MongoDB Atlas, Mongoose | Flexible document model for unstructured customer reviews; native vector index support. |
| **Authentication** | JWT, bcryptjs | Stateless, horizontally scalable token authentication with salted one-way password hashing. |
| **Job Queue** *(In Progress)* | Redis, BullMQ | Separates long-running inference jobs from the synchronous HTTP request thread. |
| **AI Inference** *(Planned)* | Groq SDK, Atlas Vector Search | Ultra-low latency LLM inference and semantic similarity scoring. |
| **Real-time** *(Planned)* | Socket.io | Pushes async processing updates to the UI without client polling. |

---

## 📁 Repository Structure

```text
scribeos/
├── client/                     # Vite + React single-page frontend
│   ├── src/
│   │   ├── components/         # Reusable UI elements
│   │   ├── pages/              # View screens (Login, Dashboard, Ingestion)
│   │   └── App.jsx             # Main routing and global state
│   └── package.json
│
├── server/                     # Express REST API backend
│   ├── index.js                # Server entry point, middleware registration, route mounting
│   ├── .env                    # Environment credentials (gitignored)
│   └── src/
│       ├── config/
│       │   └── db.js           # Mongoose MongoDB Atlas connection handler
│       ├── controllers/
│       │   ├── auth.controller.js     # User registration, login, and profile fetching
│       │   └── feedback.controller.js # CRUD operations and ownership enforcement
│       ├── middleware/
│       │   └── auth.middleware.js     # JWT extraction, signature verification, and req.user attachment
│       ├── models/
│       │   ├── User.js         # User model with pre-save hashing & bcrypt verification
│       │   └── Feedback.js     # Feedback document schema with User ObjectId references
│       ├── queues/             # BullMQ queue configurations (Phase 3)
│       ├── routes/
│       │   ├── auth.routes.js         # /api/auth routes
│       │   └── feedback.routes.js     # /api/feedback protected routes
│       └── workers/            # Background worker consumers (Phase 4)
│
├── .gitignore
└── README.md
```

---

## 🔑 Key Architectural & Engineering Decisions

1. **Separation of Concerns:** Controllers handle business logic, models isolate data schema validation, middleware governs request pre-conditions, and routes define endpoints.
2. **Stateless JWT Gatekeeping:** User authorization is verified on protected routes by reading the `Authorization: Bearer <token>` header, decoding the user ID, and querying the database without exposing password hashes (`.select("-password")`).
3. **Data Ownership & Isolation:** All feedback records link explicitly to their creator through a Mongoose `ObjectId` reference (`ref: "User"`). Mutation operations (`PUT`, `DELETE`) perform stringified ID comparisons (`feedback.createdby.toString() !== req.user._id.toString()`) to reject unauthorized modifications with HTTP `403 Forbidden`.
4. **Resilient Password Management:** Passwords are automatically salted (`genSalt(10)`) and hashed using a Mongoose `pre("save")` hook, ensuring raw credentials are never persisted to disk or the database.

---

## ⚙️ Local Setup & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Git](https://git-scm.com/)
* A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster connection string (or a local MongoDB instance)

### 1. Clone the Repository
```bash
git clone https://github.com/nikita1-pixel/scribeos.git
cd scribeos
```

### 2. Configure the Backend
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_private_key
```

### 3. Configure the Frontend
```bash
cd ../client
npm install
```

### 4. Run the Development Servers

Open two terminal sessions:

* **Terminal 1: Start Backend API**
  ```bash
  cd server
  node index.js
  # Or use nodemon for live reload:
  # npx nodemon index.js
  ```
  *Expected console output: Server running on port 5000 + MongoDB connected.*

* **Terminal 2: Start Frontend Client**
  ```bash
  cd client
  npm run dev
  ```
  *Accessible at `http://localhost:5173`.*

---

## 📡 REST API Reference (Phase 2 Baseline)

### Authentication Endpoints
| Method | Route | Description | Auth Required | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | No | `201`, `400` |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | No | `200`, `400` |
| `GET` | `/api/auth/me` | Fetch authenticated user data | Yes (`Bearer Token`) | `200`, `401` |

### Feedback Management Endpoints
| Method | Route | Description | Auth Required | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/feedback` | Create a new feedback entry | Yes (`Bearer Token`) | `201`, `400`, `401` |
| `GET` | `/api/feedback` | List feedback belonging to user | Yes (`Bearer Token`) | `200`, `401` |
| `GET` | `/api/feedback/:id` | Fetch a single feedback record | Yes (`Bearer Token`) | `200`, `401`, `404` |
| `PUT` | `/api/feedback/:id` | Update feedback content | Yes (`Bearer Token`) | `200`, `401`, `403`, `404` |
| `DELETE` | `/api/feedback/:id` | Remove a feedback record | Yes (`Bearer Token`) | `200`, `401`, `403`, `404` |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
