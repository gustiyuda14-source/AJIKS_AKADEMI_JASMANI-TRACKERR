# JASMANI TRACKER

Physical Fitness Monitoring System for AJIKS Academy - built with React, TypeScript, and Vercel.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Vercel Account (for deployment)
- PostgreSQL Database (Vercel Postgres recommended)

### Installation

1. **Clone & install dependencies:**
```bash
npm install
```

2. **Create `.env.local` file:**
```bash
cp .env.example .env.local
# Edit .env.local with your Vercel Postgres database URL and JWT secret
```

3. **Run locally:**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) - backend runs on http://localhost:3001/api

## 📚 Project Structure

```
├── src/                      # React frontend
│   ├── components/           # Reusable components
│   ├── pages/               # Page components
│   ├── store/               # Zustand state management
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── api/                      # Vercel serverless functions
│   ├── auth/                # Authentication endpoints
│   ├── members/             # Member CRUD endpoints
│   ├── entries/             # Training entries endpoints
│   ├── db.ts                # Database connection
│   ├── auth.ts              # JWT & password utilities
│   └── polriEngine.ts       # POLRI scoring engine
├── public/                   # Static assets
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
├── tsconfig.json            # TypeScript config
└── vercel.json              # Vercel deployment config
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username & password
  - Demo credentials: username=`coach`, password=`password`

### Members
- `GET /api/members` - List all active members
- `POST /api/members` - Create new member

### Training Entries
- `GET /api/entries?memberId=1` - Get member's training history
- `POST /api/entries` - Record new training session with POLRI scoring

## 🎨 Design

- **Colors:** Fire (#FF4500), Gold (#FFB300), Dark (#0A0503)
- **Typography:** Barlow Condensed (headings), Barlow (body)
- **Framework:** React 18 + TypeScript + Tailwind CSS
- **State:** Zustand for global state management

## 🧪 Development

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build
```

## 🚢 Deployment

### To Vercel

1. **Push to GitHub**
```bash
git push origin main
```

2. **Create Vercel Project:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set Environment Variables in Vercel Dashboard:
     - `DATABASE_URL` - Your Vercel Postgres connection string
     - `JWT_SECRET` - Generate a secure random string (min 32 chars)
     - `FRONTEND_URL` - Your deployed frontend URL

3. **Deploy:**
   - Vercel automatically deploys on push to main
   - Frontend: Built and served by Vercel
   - API: Runs as serverless functions in `/api` directory

## 📊 Database

### Tables
- `users` - Coach/admin accounts
- `members` - Athletes data
- `training_entries` - Training sessions with POLRI scores

### Setup
Database tables are auto-created on first API call if they don't exist.

## 🏆 POLRI Standards

The POLRI Engine implements official POLRI (Polri Nasional) physical fitness standards:
- 12-minute run (meters)
- Figure-8 agility run (seconds)
- Push-ups (reps)
- Sit-ups (reps)
- Pull-ups (reps)

Scoring: Grade A (80+), B (61-79), C (41-60), D (<41), TMS (fail any test)

## 📝 Demo Login
- Username: `coach`
- Password: `password`

## 🤝 Contributing

Contributions welcome! Please follow the existing code style and create pull requests.

## 📄 License

MIT License - See LICENSE file for details
