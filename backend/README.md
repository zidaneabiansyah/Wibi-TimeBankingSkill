# Time Banking Backend API

Backend API server untuk Time Banking Skill Platform menggunakan Golang + Gin + GORM.

## 🛠️ Tech Stack

- **Language**: Go 1.21+
- **Framework**: Gin (HTTP web framework)
- **ORM**: GORM (Object-Relational Mapping)
- **Database**: PostgreSQL (Supabase)
- **Auth**: JWT (JSON Web Tokens)

## 📁 Project Structure

```
backend/
├── cmd/
│   └── server/
│       └── main.go           # Application entrypoint
├── internal/
│   ├── config/               # Configuration management
│   ├── database/             # Database connection & migrations
│   ├── models/               # Database models
│   ├── handlers/             # HTTP handlers (controllers)
│   ├── middleware/           # HTTP middleware
│   ├── services/             # Business logic
│   └── utils/                # Utility functions
├── migrations/               # SQL migrations (if needed)
├── .env.example              # Environment variables template
├── go.mod                    # Go module dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Go 1.21 or higher
- PostgreSQL database (or Supabase account)

### Installation

1. **Clone the repository** (if not already)
```bash
cd backend
```

2. **Install dependencies**
```bash
go mod download
```

3. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Run the server**
```bash
go run cmd/server/main.go
```

The server will start on `http://localhost:8080`

### Development

**Run with auto-reload** (install air first):
```bash
# Install air
go install github.com/cosmtrek/air@latest

# Run with hot reload
air
```

**Run tests**:
```bash
go test ./...
```

**Build for production**:
```bash
go build -o server cmd/server/main.go
./server
```

## 📋 API Endpoints

### Health Check
```
GET /health
```

### Authentication (Coming soon)
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
```

### Users (Coming soon)
```
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
GET    /api/v1/users/:id/skills
POST   /api/v1/users/:id/skills
```

### Skills (Coming soon)
```
GET    /api/v1/skills
GET    /api/v1/skills/:id
POST   /api/v1/skills
```

### Sessions (Coming soon)
```
GET    /api/v1/sessions
POST   /api/v1/sessions
GET    /api/v1/sessions/:id
PUT    /api/v1/sessions/:id
DELETE /api/v1/sessions/:id
```

## 🗄️ Database Models

- **User**: User accounts & profiles
- **Skill**: Master skill data
- **UserSkill**: Skills that users can teach
- **LearningSkill**: Skills users want to learn
- **Session**: Teaching/learning sessions
- **Transaction**: Credit transaction history
- **Review**: Session ratings & reviews
- **Badge**: Achievement badges
- **UserBadge**: Badges earned by users

## 🔐 Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Database connection
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 8080)

## 📝 Notes

- Database migrations run automatically on server start
- Initial skills and badges are seeded on first run
- All timestamps are in UTC
- API uses JSON for request/response
