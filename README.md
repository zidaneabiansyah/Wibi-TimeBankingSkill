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
