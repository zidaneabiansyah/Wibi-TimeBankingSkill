# Wibi - Waktu Indonesia Berbagi Ilmu

## Time Banking Skill Exchange Platform

Wibi is a peer-to-peer skill exchange platform based on the Time Banking system, enabling students to teach and learn skills through time-based credit transactions without monetary exchange.

## Core Concept: Time Banking

The platform operates on a fundamental principle where time serves as the universal currency:

- 1 hour of teaching = 1 Time Credit
- 1 Time Credit = 1 hour of learning
- All skills are valued equally regardless of type or complexity
- Zero monetary transactions required

### Key Advantages

- **Equity**: Equal valuation of all skills and knowledge
- **Community Building**: Fosters peer-to-peer learning networks
- **Accessibility**: Removes financial barriers to skill acquisition
- **Reciprocity**: Encourages both teaching and learning behaviors

## Technology Stack

### Frontend Architecture
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Date Utilities**: date-fns
- **UI Icons**: Lucide React
- **Real-time**: WebSocket, WebRTC
- **Testing**: Jest, React Testing Library, Playwright

### Backend Architecture
- **Language**: Go 1.25
- **Web Framework**: Gin
- **ORM**: GORM
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: PostgreSQL 14+
- **Architecture Pattern**: Clean Architecture (MVC)
- **API Documentation**: Swagger/OpenAPI
- **Security**: Bcrypt, Rate Limiting, CORS, Input Sanitization

## Installation and Setup

### Prerequisites
- Node.js 18 or higher
- Go 1.21 or higher
- PostgreSQL 14 or higher
- Git

### Backend Configuration

```bash
# Navigate to backend directory
cd backend

# Install dependencies
go mod download

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Run database migrations
go run cmd/server/main.go

# Start development server
go run cmd/server/main.go
# Server available at http://localhost:8080
```

### Frontend Configuration

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL to your backend URL

# Start development server
npm run dev
# Application available at http://localhost:3000
```

## Core Features

### Authentication and User Management
- JWT-based authentication with token refresh
- User registration and email verification
- Profile management with avatar upload
- Password reset functionality
- Role-based access control (User/Admin)

### Skill Marketplace
- Browse and search skill catalog (17 pre-seeded skills)
- Filter by category (Academic, Technical, Creative, Language, Sports)
- Add teaching skills with experience level and hourly rate
- Create learning wishlist with priority levels
- View teacher profiles with ratings and reviews

### Session Management
- Request sessions from skill teachers
- Approve/reject session requests
- Schedule sessions (online/offline/hybrid modes)
- Real-time session status tracking
- Check-in system for both parties
- Mutual completion confirmation
- Session cancellation with reason tracking
- Dispute resolution system

### Credit System
- Time Credit balance tracking
- Credit hold mechanism during active sessions
- Automatic credit transfer upon session completion
- Comprehensive transaction history
- Peer-to-peer credit transfers
- Bonus credits for achievements and milestones
- Transaction rollback for cancelled sessions

### Review and Rating System
- Rate teachers and students (1-5 stars)
- Detailed rating breakdown (Communication, Knowledge, Punctuality, Helpfulness)
- Written review comments
- Public rating summaries on profiles
- Review moderation and reporting

### Gamification System
- Badge system with 4 types (Achievement, Milestone, Quality, Special)
- Automatic badge awarding based on criteria
- Badge pinning for profile display
- 5 leaderboards (Badges, Rarity, Sessions, Rating, Credits)
- Rarity levels (Common, Uncommon, Rare, Epic, Legendary)
- Bonus credit rewards for rare badges

### Real-time Features
- WebSocket notifications for instant updates
- WebRTC video calling for online sessions
- Collaborative whiteboard with real-time synchronization
- Live session status updates

### Community Features
- Forum with categories and threaded discussions
- Success story sharing with likes and comments
- Skill endorsements from peers
- User favorites list
- Session templates for recurring sessions

### Administrative Tools
- User management dashboard
- Session monitoring and resolution
- Transaction oversight
- Content moderation
- Analytics and reporting

## User Workflows

### Teacher Workflow
1. Register and complete profile setup
2. Add teaching skills with experience level and availability
3. Receive session requests from students
4. Review and approve/reject requests
5. Conduct teaching sessions
6. Confirm session completion
7. Receive time credits and ratings
8. Earn badges and climb leaderboards

### Student Workflow
1. Register and complete profile setup
2. Browse skill marketplace
3. Review teacher profiles, ratings, and reviews
4. Request session from preferred teacher
5. Attend scheduled session
6. Confirm session completion
7. Rate and review teacher
8. Spend earned credits on learning new skills

## API Documentation

### Base URL
```
http://localhost:8080/api/v1
```

### Authentication Endpoints
```
POST   /auth/register              Register new user
POST   /auth/login                 User login
POST   /auth/logout                User logout
POST   /auth/verify-email          Verify email address
POST   /auth/forgot-password       Request password reset
POST   /auth/reset-password        Reset password
GET    /auth/profile               Get authenticated user profile
```

### User Management
```
GET    /user/profile               Get user profile
PUT    /user/profile               Update user profile
POST   /user/change-password       Change password
POST   /user/avatar                Upload avatar
GET    /user/stats                 Get user statistics
```

### Skills
```
GET    /skills                     List all skills
GET    /skills/:id                 Get skill details
POST   /user/skills                Add teaching skill
GET    /user/skills                Get user's teaching skills
PUT    /user/skills/:id            Update teaching skill
DELETE /user/skills/:id            Remove teaching skill
POST   /user/learning-skills       Add learning skill
GET    /user/learning-skills       Get learning wishlist
DELETE /user/learning-skills/:id   Remove learning skill
```

### Sessions
```
POST   /sessions                   Create session request
GET    /sessions                   List user sessions
GET    /sessions/:id               Get session details
POST   /sessions/:id/approve       Approve session request
POST   /sessions/:id/reject        Reject session request
POST   /sessions/:id/checkin       Check in to session
POST   /sessions/:id/start         Start session
POST   /sessions/:id/complete      Confirm completion
POST   /sessions/:id/cancel        Cancel session
POST   /sessions/:id/dispute       Dispute session
```

### Transactions
```
GET    /user/transactions          Get transaction history
GET    /user/transactions/:id      Get transaction details
POST   /user/transfer              Transfer credits to another user
```

### Reviews
```
POST   /reviews                    Create review
GET    /reviews/:id                Get review details
PUT    /reviews/:id                Update review
DELETE /reviews/:id                Delete review
GET    /users/:id/reviews          Get user reviews
GET    /users/:id/rating-summary   Get rating summary
```

### Badges and Leaderboards
```
GET    /badges                     List all badges
GET    /user/badges                Get user badges
POST   /user/badges/check          Check and award badges
POST   /user/badges/:id/pin        Pin badge to profile
GET    /leaderboard/badges         Badge leaderboard
GET    /leaderboard/rarity         Rarity leaderboard
GET    /leaderboard/sessions       Session leaderboard
GET    /leaderboard/rating         Rating leaderboard
GET    /leaderboard/credits        Credit leaderboard
```

### Notifications
```
GET    /notifications              Get notifications
GET    /notifications/unread       Get unread notifications
GET    /notifications/unread/count Get unread count
PUT    /notifications/:id/read     Mark as read
PUT    /notifications/read-all     Mark all as read
DELETE /notifications/:id          Delete notification
```

### WebSocket Endpoints
```
WS     /ws/notifications           Real-time notifications
WS     /ws/whiteboard/:sessionId   Collaborative whiteboard
WS     /ws/video/:sessionId        WebRTC signaling
```

For complete API documentation, visit `/api/v1/swagger` when the server is running.

## Database Schema

The application uses PostgreSQL with 19 tables organized into the following domains:

### Core Tables
- **users**: User accounts and profiles
- **admins**: Administrative accounts
- **used_tokens**: JWT token blacklist

### Skills and Learning
- **skills**: Master skill catalog
- **user_skills**: Skills users can teach
- **learning_skills**: Skills users want to learn
- **skill_progress**: Learning progress tracking

### Sessions and Transactions
- **sessions**: Teaching/learning sessions
- **transactions**: Credit transaction history
- **video_sessions**: Video call metadata

### Social Features
- **reviews**: Ratings and feedback
- **favorites**: Favorite teachers
- **notifications**: Real-time notifications
- **endorsements**: Peer endorsements

### Community
- **forum_threads**: Discussion threads
- **forum_comments**: Thread comments
- **stories**: Success stories
- **story_comments**: Story comments

### Gamification
- **badges**: Achievement badges
- **user_badges**: Badges earned by users

### Content Management
- **shared_files**: Session materials
- **whiteboards**: Collaborative whiteboard data
- **templates**: Session templates
- **reports**: User reports
- **availabilities**: Teacher availability schedules

## Deployment

### Production Stack
- **Frontend**: Vercel (Free tier)
- **Backend**: Render (Free tier)
- **Database**: Supabase PostgreSQL (Free tier)

### Environment Variables

Backend (.env):
```
PORT=8080
GIN_MODE=release
DB_HOST=your-database-host
DB_PORT=5432
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_SSLMODE=require
JWT_SECRET=your-jwt-secret-min-32-chars
JWT_EXPIRY=168h
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

For detailed deployment instructions, see DEPLOYMENT.md.

## Testing

### Backend Tests
```bash
cd backend
go test ./...
go test -cover ./...
```

### Frontend Tests
```bash
cd frontend
npm run test
npm run test:coverage
```

## Performance Optimizations

### Backend
- Connection pooling (10 idle, 100 max connections)
- Materialized views for leaderboards (auto-refresh every 10 minutes)
- Composite database indexes for common queries
- GORM query optimization with preloading
- Rate limiting (100 requests/minute per IP)
- GZIP compression for responses

### Frontend
- Next.js App Router with Server Components
- Image optimization with next/image
- Code splitting with dynamic imports
- Edge caching via Vercel CDN
- Zustand for lightweight state management (3KB)
- PWA support with service workers

## Security Features

- JWT authentication with token expiry and refresh
- Bcrypt password hashing (cost factor: 10)
- SQL injection prevention via parameterized queries
- XSS protection with HTML sanitization (Bluemonday)
- CSRF protection
- Rate limiting per IP address
- CORS whitelist configuration
- Input validation and sanitization
- HTTPS enforcement
- Security headers middleware

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Commit changes with clear messages
4. Write tests for new features
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Author

Zidane Abiansyah

## Acknowledgments

Built with modern web technologies and best practices in software architecture.
