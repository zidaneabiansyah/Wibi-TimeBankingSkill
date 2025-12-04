# 🎓 Wibi - Waktu Indonesia Berbagi Ilmu
## Time Banking Skill Platform untuk Pelajar

> **Berbagi ilmu, tukar waktu, tumbuh bersama** 🚀

Wibi adalah platform peer-to-peer yang revolusioner untuk pertukaran skill berbasis sistem Time Banking. Pelajar dapat mengajar skill mereka dan belajar skill baru tanpa perlu uang - hanya dengan menukar waktu!

---

## 💡 Konsep Time Banking

**Waktu = Mata Uang**

Dalam Wibi, semua orang memiliki nilai yang sama. Tidak peduli skill apa yang Anda ajarkan, 1 jam mengajar = 1 Time Credit yang dapat digunakan untuk belajar skill lain.

```
┌─────────────────────────────────────────┐
│  1 Jam Mengajar = 1 Time Credit         │
│  1 Time Credit = 1 Jam Belajar          │
│  Semua Skill Dihargai Sama              │
│  Tanpa Uang, Murni Pertukaran Skill     │
└─────────────────────────────────────────┘
```

### Mengapa Time Banking?
- ✨ **Adil**: Semua skill dihargai sama
- 🤝 **Komunitas**: Membangun jaringan pelajar
- 💰 **Gratis**: Tidak ada biaya, hanya pertukaran
- 🌱 **Pertumbuhan**: Belajar dan mengajar sekaligus

## 🛠️ Tech Stack

### 🎨 Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Date Handling**: date-fns
- **Icons**: Lucide React

### ⚙️ Backend
- **Language**: Go (Golang)
- **Framework**: Gin Web Framework
- **ORM**: GORM
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: PostgreSQL
- **Architecture**: Clean Architecture (MVC Pattern)

## 📁 Project Structure

```
wibi/
├── backend/                    # Go API Server
│   ├── cmd/main.go            # Entry point
│   ├── internal/
│   │   ├── config/            # Configuration
│   │   ├── database/          # Database setup
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── handler/           # HTTP handlers
│   │   ├── middleware/        # Auth & middleware
│   │   ├── models/            # Database models
│   │   ├── repository/        # Data access layer
│   │   ├── routes/            # API routes
│   │   ├── service/           # Business logic
│   │   └── utils/             # Utilities
│   └── migrations/            # Database migrations
│
├── frontend/                   # Next.js Application
│   ├── src/
│   │   ├── app/               # Pages & layouts
│   │   ├── components/        # React components
│   │   │   ├── badge/         # Badge components
│   │   │   ├── session/       # Session components
│   │   │   ├── skill/         # Skill components
│   │   │   └── ui/            # shadcn/ui components
│   │   ├── lib/
│   │   │   ├── api/           # API client
│   │   │   └── services/      # Service layer
│   │   ├── stores/            # Zustand stores
│   │   └── types/             # TypeScript types
│   └── public/                # Static assets
│
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (Frontend)
- **Go** 1.21+ (Backend)
- **PostgreSQL** 14+ (Database)
- **Git** (Version control)

### 🔧 Backend Setup

```bash
# Navigate to backend directory
cd backend

# Download dependencies
go mod download

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
go run cmd/main.go migrate

# Start the server
go run cmd/main.go
# Server runs on http://localhost:8080
```

### 🎨 Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
# App runs on http://localhost:3000
```

## ✨ Features

### 🔐 Authentication & User Management
- ✅ User registration & login with JWT
- ✅ User profile management
- ✅ Password change & avatar upload
- ✅ Role-based access control

### 🎓 Skill Management
- ✅ Browse skill marketplace
- ✅ Add teaching skills
- ✅ Add learning wishlist
- ✅ Skill categories & levels
- ✅ Search & filter skills

### 📅 Session Management
- ✅ Request sessions from tutors
- ✅ Approve/reject session requests
- ✅ Schedule sessions (online/offline)
- ✅ Session status tracking
- ✅ Session completion & confirmation

### 💳 Credit System
- ✅ Time Credit balance tracking
- ✅ Credit hold during sessions
- ✅ Credit transfer on completion
- ✅ Transaction history
- ✅ Bonus credits for achievements

### ⭐ Review & Rating System
- ✅ Rate tutors & students
- ✅ Detailed rating breakdown
- ✅ Review comments & feedback
- ✅ Rating summaries
- ✅ Public profile ratings

### 🏆 Gamification
- ✅ Badge system (4 types: Achievement, Milestone, Quality, Special)
- ✅ Automatic badge awarding
- ✅ Pin favorite badges
- ✅ 5 leaderboards (Badges, Rarity, Sessions, Rating, Credits)
- ✅ Rarity levels (Common to Legendary)
- ✅ Bonus credits for rare badges

## 👥 User Flow

### 👨‍🏫 As Teacher (Earn Credits)
1. **Register** → Create account
2. **Setup Profile** → Add bio, avatar, interests
3. **List Skills** → Add skills you can teach
4. **Receive Requests** → Get session requests from students
5. **Approve & Teach** → Conduct sessions
6. **Earn Credits** → Get Time Credits + ratings
7. **Climb Leaderboard** → Earn badges & recognition

### 👨‍🎓 As Student (Spend Credits)
1. **Register** → Create account
2. **Browse Marketplace** → Explore available skills
3. **Find Tutor** → View profiles, ratings, reviews
4. **Request Session** → Book a session
5. **Attend & Learn** → Participate in session
6. **Rate & Review** → Give feedback to tutor
7. **Spend Credits** → Use Time Credits to learn

## 📊 API Documentation

### Base URL
```
http://localhost:8080/api/v1
```

### Key Endpoints

**Authentication**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

**Skills**
- `GET /skills` - Browse all skills
- `POST /user/skills` - Add teaching skill
- `GET /user/skills` - Get my teaching skills

**Sessions**
- `POST /sessions` - Request session
- `GET /sessions` - Get my sessions
- `PUT /sessions/:id/approve` - Approve session
- `PUT /sessions/:id/complete` - Complete session

**Badges & Leaderboard**
- `GET /badges` - Get all badges
- `GET /user/badges` - Get my badges
- `GET /leaderboard/badges` - Badge leaderboard
- `GET /leaderboard/rating` - Rating leaderboard

## 🎯 Development Phases

- ✅ **Phase 1**: Authentication & User Profile
- ✅ **Phase 2**: Skill Management
- ✅ **Phase 3**: Session Management
- ✅ **Phase 4**: Credit System
- ✅ **Phase 5**: Review & Rating System
- ✅ **Phase 6**: Gamification (Badges & Leaderboard)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Creator

**Zidane Abiansyah**

---

## 📝 License

MIT License - see LICENSE file for details

---

<div align="center">

**Made with ❤️ by Zidane Abiansyah**

*Berbagi ilmu, tukar waktu, tumbuh bersama* 🚀

</div>