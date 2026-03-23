# Greenhill Hornets Scheduler

A comprehensive sports scheduling platform built for Greenhill School (Addison, Texas). Manage teams, schedule games, track stats, capture media, and stream live across soccer, softball, and basketball.

**School Colors:** Hunter Green & Vegas Gold | **Mascot:** Hornets

## Features

### Teams & Rosters
- Create and manage teams across soccer, softball, and basketball
- Build detailed rosters with player names, jersey numbers, positions
- Role-based access (Owner, Coach, Assistant Coach, Player, Parent, Scorekeeper)

### Family Accounts
- Create family groups and share access with family members via linked accounts
- Invite family members via email with secure token-based invitations
- Shared visibility into schedules, stats, and media

### League & Team Invites
- Send email invitations to join leagues or teams
- Accept/decline invitations with role assignment
- Real-time notifications for invite activity

### Game Scheduling
- Schedule individual games or full seasons
- Support for soccer, softball, and basketball
- Game statuses: Scheduled, In Progress, Completed, Postponed, Cancelled
- Location and field assignment

### Sport-Specific Stats
- **Soccer:** Goals, assists, shots, saves, cards, minutes played
- **Softball:** At bats, hits, runs, RBIs, home runs, pitching stats
- **Basketball:** Points, rebounds, assists, steals, blocks, shooting percentages

### Media Capture
- In-app photo and video capture
- Upload from device library
- Media gallery organized by team and game
- Support for large video files (up to 500MB)

### Live Streaming
- Stream games live via RTMP/HLS
- Real-time viewer count
- Automatic team notifications when stream starts
- Stream archive management

### Security
- Strong password requirements (8+ chars, mixed case, numbers, special chars)
- JWT session management with 30-day expiration
- Rate limiting on auth endpoints
- CSRF protection and origin validation
- Security headers (CSP, HSTS, X-Frame-Options)
- Comprehensive audit logging
- Input sanitization

## Tech Stack

### Web App (Next.js)
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js with credentials provider
- **Styling:** Tailwind CSS
- **Validation:** Zod
- **Email:** Nodemailer

### Mobile App (React Native)
- **Framework:** Expo SDK 52
- **Navigation:** React Navigation 7
- **Camera:** expo-camera, expo-image-picker
- **Video:** react-native-video
- **Storage:** AsyncStorage
- **Notifications:** expo-notifications

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Web App Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Start development server
npm run dev
```

### Mobile App Setup

```bash
cd mobile

# Install dependencies
npm install

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Publishing to App Store

```bash
cd mobile

# Build for iOS
npm run build:ios

# Submit to App Store
npm run submit:ios

# Build for Android
npm run build:android

# Submit to Google Play
npm run submit:android
```

## Project Structure

```
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication
│   │   │   ├── teams/         # Team management
│   │   │   ├── rosters/       # Roster management
│   │   │   ├── leagues/       # League management
│   │   │   ├── seasons/       # Season management
│   │   │   ├── games/         # Game scheduling
│   │   │   ├── stats/         # Stat capture
│   │   │   ├── families/      # Family accounts
│   │   │   ├── invites/       # Invite system
│   │   │   ├── media/         # Photo/video upload
│   │   │   ├── streams/       # Live streaming
│   │   │   └── notifications/ # Notifications
│   │   ├── dashboard/         # Dashboard page
│   │   ├── teams/             # Teams page
│   │   ├── leagues/           # Leagues page
│   │   ├── games/             # Games page
│   │   ├── family/            # Family page
│   │   ├── media/             # Media gallery
│   │   ├── streams/           # Live streams
│   │   └── auth/              # Login/Register
│   ├── components/            # Shared components
│   ├── lib/                   # Core utilities
│   │   ├── auth.ts            # NextAuth config
│   │   ├── prisma.ts          # Database client
│   │   ├── security.ts        # Security utilities
│   │   ├── email.ts           # Email service
│   │   ├── validations.ts     # Zod schemas
│   │   └── stats-helpers.ts   # Sport stat helpers
│   └── types/                 # TypeScript types
├── mobile/                    # React Native mobile app
│   ├── App.tsx                # App entry point
│   ├── src/
│   │   ├── screens/           # Screen components
│   │   ├── services/          # API service
│   │   ├── hooks/             # Custom hooks
│   │   └── utils/             # Theme & utilities
│   ├── app.json               # Expo config
│   └── eas.json               # EAS Build config
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/[...nextauth]` | NextAuth login/session |
| GET/POST | `/api/teams` | List/create teams |
| GET/PATCH/DELETE | `/api/teams/[teamId]` | Team details/update/delete |
| GET/POST | `/api/rosters` | List/create rosters |
| POST/DELETE | `/api/rosters/[rosterId]/players` | Add/remove players |
| GET/POST | `/api/leagues` | List/create leagues |
| GET/DELETE | `/api/leagues/[leagueId]` | League details/delete |
| GET/POST | `/api/seasons` | List/create seasons |
| GET/POST | `/api/games` | List/create games |
| GET/PATCH | `/api/games/[gameId]` | Game details/update score |
| GET/POST | `/api/stats` | List/record player stats |
| GET/POST | `/api/families` | List/create families |
| POST | `/api/families/[familyId]/invite` | Invite family member |
| POST | `/api/families/join` | Join family via token |
| GET/POST | `/api/invites` | List/send invites |
| POST | `/api/invites/[inviteId]/accept` | Accept invite |
| GET/POST | `/api/media` | List/upload media |
| GET/POST | `/api/streams` | List/create streams |
| PATCH | `/api/streams/[streamId]` | Start/end stream |
| GET/PATCH | `/api/notifications` | List/mark read |

## License

Private - Greenhill School
