import { z } from 'zod';

// Auth validations
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Team validations
export const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(100),
  sportType: z.enum(['SOCCER', 'SOFTBALL', 'BASKETBALL']),
  leagueId: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  location: z.string().optional(),
});

export const updateTeamSchema = createTeamSchema.partial();

// Roster validations
export const createRosterSchema = z.object({
  teamId: z.string().min(1),
  seasonId: z.string().optional(),
  name: z.string().min(1, 'Roster name is required').max(100),
});

export const addPlayerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  jerseyNumber: z.string().optional(),
  position: z.string().optional(),
  dateOfBirth: z.string().optional(),
  heightInches: z.number().optional(),
  weightLbs: z.number().optional(),
});

// League validations
export const createLeagueSchema = z.object({
  name: z.string().min(1, 'League name is required').max(100),
  sportType: z.enum(['SOCCER', 'SOFTBALL', 'BASKETBALL']),
  description: z.string().optional(),
  location: z.string().optional(),
  isPublic: z.boolean().optional(),
});

// Season validations
export const createSeasonSchema = z.object({
  leagueId: z.string().min(1),
  name: z.string().min(1, 'Season name is required').max(100),
  sportType: z.enum(['SOCCER', 'SOFTBALL', 'BASKETBALL']),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});

// Game validations
export const createGameSchema = z.object({
  seasonId: z.string().min(1),
  homeTeamId: z.string().min(1),
  awayTeamId: z.string().min(1),
  sportType: z.enum(['SOCCER', 'SOFTBALL', 'BASKETBALL']),
  scheduledAt: z.string().min(1),
  location: z.string().optional(),
  fieldName: z.string().optional(),
});

export const updateGameScoreSchema = z.object({
  homeScore: z.number().min(0),
  awayScore: z.number().min(0),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'POSTPONED', 'CANCELLED']).optional(),
  period: z.number().optional(),
});

// Stat validations - sport-specific
export const soccerStatSchema = z.object({
  goals: z.number().min(0).default(0),
  assists: z.number().min(0).default(0),
  shots: z.number().min(0).default(0),
  shotsOnTarget: z.number().min(0).default(0),
  saves: z.number().min(0).default(0),
  fouls: z.number().min(0).default(0),
  yellowCards: z.number().min(0).default(0),
  redCards: z.number().min(0).default(0),
  minutesPlayed: z.number().min(0).default(0),
  cornerKicks: z.number().min(0).default(0),
});

export const softballStatSchema = z.object({
  atBats: z.number().min(0).default(0),
  hits: z.number().min(0).default(0),
  runs: z.number().min(0).default(0),
  rbis: z.number().min(0).default(0),
  homeRuns: z.number().min(0).default(0),
  doubles: z.number().min(0).default(0),
  triples: z.number().min(0).default(0),
  walks: z.number().min(0).default(0),
  strikeouts: z.number().min(0).default(0),
  stolenBases: z.number().min(0).default(0),
  errors: z.number().min(0).default(0),
  inningsPitched: z.number().min(0).default(0),
  earnedRuns: z.number().min(0).default(0),
  pitchStrikeouts: z.number().min(0).default(0),
  pitchWalks: z.number().min(0).default(0),
});

export const basketballStatSchema = z.object({
  points: z.number().min(0).default(0),
  rebounds: z.number().min(0).default(0),
  assists: z.number().min(0).default(0),
  steals: z.number().min(0).default(0),
  blocks: z.number().min(0).default(0),
  turnovers: z.number().min(0).default(0),
  fouls: z.number().min(0).default(0),
  freeThrowsMade: z.number().min(0).default(0),
  freeThrowsAttempted: z.number().min(0).default(0),
  twoPointersMade: z.number().min(0).default(0),
  twoPointersAttempted: z.number().min(0).default(0),
  threePointersMade: z.number().min(0).default(0),
  threePointersAttempted: z.number().min(0).default(0),
  minutesPlayed: z.number().min(0).default(0),
});

// Invite validations
export const createInviteSchema = z.object({
  type: z.enum(['LEAGUE', 'TEAM']),
  leagueId: z.string().optional(),
  teamId: z.string().optional(),
  email: z.string().email('Invalid email address'),
  role: z.string().optional(),
  message: z.string().optional(),
});

// Family validations
export const createFamilySchema = z.object({
  name: z.string().min(1, 'Family name is required').max(100),
});

export const inviteFamilyMemberSchema = z.object({
  familyId: z.string().min(1),
  email: z.string().email('Invalid email address'),
});

// Live stream validations
export const createStreamSchema = z.object({
  gameId: z.string().min(1),
  title: z.string().min(1, 'Stream title is required').max(200),
});
