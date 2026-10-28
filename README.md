# WishCraft — Personalized Celebration Website Builder

WishCraft is a full-stack web application for creating, customizing, and sharing personalized birthday and celebration mini-websites. It features 8 distinct celebration themes, permanent photo uploads, real-time customizer controls, live interactive reveals, PIN access protection, AI-assisted message generation, and responsive mobile rendering.

---

## 🌟 Key Features

1. **8 Interactive Celebration Themes**:
   - `Blush Celebration`: Petal animations, floral flourishes, and interactive envelope reveal.
   - `Midnight Surprise`: Starry night backdrop, purple neon glows, and dark-mode luxury.
   - `Cute & Playful`: Candy pastels, celebration doodle stickers, and an interactive birthday cake with blowable candles.
   - `Memory Lane`: Vintage scrapbook aesthetics with taped polaroids and photo timeline.
   - `Minimal Elegance`: Timeless Scandinavian aesthetics, gold foil borders, and clean typography.
   - `Love Letter`: Sealed parchment envelope with wax seal tap-to-reveal interaction.
   - `Retro Party`: 90s party pop-art, neo-brutalist drop shadows, and confetti cannons.
   - `Golden Moments`: Black velvet and liquid champagne gold for milestone celebrations.
2. **Permanent Media Uploads**: Secure image processing with Pillow verification, UUID key generation, and local or Cloudinary/S3 storage.
3. **Drafting & Autosave**: Real-time debounced autosave, optimistic concurrency, and draft persistence.
4. **Publishing & Sharing**:
   - Collision-resistant unique slugs (e.g. `/wish/sophia-birthday-a8f31c`).
   - Standalone recipient celebration route (`/wish/:slug`) requiring no login.
   - Instant QR code generation, WhatsApp share link, and native mobile share API.
   - Unpublish toggle allowing creators to deactivate links at any time.
5. **Privacy & Access Protection**:
   - Public, Unlisted, or PIN-protected celebration sites.
   - Argon2id PIN hashing protecting private messages until unlocked.
6. **AI Message Generator**:
   - Backend endpoint supporting OpenAI, Gemini, or intelligent contextual generator based on tone, relationship, and recipient name.
7. **Secure Authentication**:
   - Argon2id password hashing.
   - Signed JWT sessions with HTTP-only cookies and Bearer tokens.
   - Time-limited password reset tokens and account management.

---

## 🛠 Technology Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite 8**
- **Tailwind CSS**
- **React Router 7**
- **Lucide React Icons** & **Canvas Confetti**
- **Vitest** & **Testing Library**

### Backend
- **Python 3.12**
- **FastAPI**
- **SQLAlchemy 2.x**
- **PostgreSQL** (with SQLite fallback for unit testing)
- **Alembic** migrations
- **Pydantic v2** & **Pydantic-Settings**
- **Argon2id** password and PIN hashing
- **PyJWT** authentication tokens
- **Pillow** image validation
- **Pytest** & **HTTPX**

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js** >= 18 and **npm**
- **Python** >= 3.10
- **PostgreSQL** running locally (or SQLite fallback)

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy .env.example to .env and adjust if needed
cp .env.example .env

# Run database migrations
python -m alembic upgrade head

# Start FastAPI server
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation (Swagger UI) is available at: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
# From the project root
npm install

# Run frontend development server
npm run dev
```
Frontend will be running at: `http://localhost:5173/`

---

## 🧪 Running Tests

### Run Backend Tests (Pytest)
```bash
cd backend
python -m pytest -v
```

### Run Frontend Tests (Vitest)
```bash
npm test
```

### Run Production Build Check
```bash
npm run build
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | SQLAlchemy connection string | `postgresql+psycopg://postgres:postgres@localhost:5432/wishcraft` |
| `SECRET_KEY` | JWT signing secret | 32+ character random string |
| `FRONTEND_URL` | Public frontend URL | `http://localhost:5173` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:5173,http://localhost:3000` |
| `STORAGE_BACKEND` | `local`, `cloudinary`, or `s3` | `local` |
| `UPLOAD_DIR` | Local uploads directory | `./uploads` |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary credentials (optional) | |
| `OPENAI_API_KEY` | OpenAI API key for AI suggestions (optional) | |
| `GEMINI_API_KEY` | Google Gemini API key (optional) | |

### Frontend (`.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL for FastAPI backend | `http://localhost:8000/api/v1` |

---

## 📂 Repository Structure

```
├── backend/
│   ├── alembic/              # Database migration versions
│   ├── app/
│   │   ├── api/v1/           # API endpoints (auth, creations, templates, uploads, public, ai)
│   │   ├── core/             # Configuration & Argon2/JWT security
│   │   ├── db/               # Session & SQLAlchemy Base
│   │   ├── models/           # User, Creation, CreationPhoto, Template, PublishedSite, SiteEvent
│   │   ├── schemas/          # Pydantic v2 schemas
│   │   ├── services/         # Storage & AI message services
│   │   └── main.py           # FastAPI entrypoint, lifespan, CORS & static file mount
│   ├── tests/                # Automated pytest test suite
│   ├── requirements.txt      # Backend Python dependencies
│   └── .env.example          # Backend environment example
├── src/
│   ├── components/           # Navbar, Footer, QRCode, Toast, Template Cards, Template Renderer
│   │   ├── templates/        # 8 celebration template implementations
│   │   └── wizard/           # Photo uploader & step progress
│   ├── context/              # AuthContext, WishContext & WishContextBase
│   ├── data/                 # Template definitions & occasion metadata
│   ├── pages/                # Landing, Templates, Detail, Create, Editor, Publish, MyCreations, Auth, PublicWish
│   ├── services/             # Central API client
│   └── types/                # TypeScript interfaces
├── vitest.config.ts          # Vitest testing configuration
├── tailwind.config.js        # Tailwind styling & animations
└── package.json              # Frontend scripts & dependencies
```
