export const demoTeams = [
  {
    id: 'team-1',
    name: 'Greenhill Hornets',
    sportType: 'SOCCER',
    primaryColor: '#1a5e1a',
    secondaryColor: '#C5972C',
    location: 'Greenhill School, Addison TX',
    league: { id: 'league-1', name: 'SPC Soccer Conference' },
    _count: { members: 18, rosters: 2 },
    members: [
      { id: 'm1', role: 'COACH', user: { id: 'u1', firstName: 'Mike', lastName: 'Rodriguez', email: 'mrodriguez@greenhill.org' } },
      { id: 'm2', role: 'ASSISTANT_COACH', user: { id: 'u2', firstName: 'Sarah', lastName: 'Chen', email: 'schen@greenhill.org' } },
      { id: 'm3', role: 'PLAYER', user: { id: 'u3', firstName: 'Alex', lastName: 'Jennings', email: 'ajennings@greenhill.org' } },
    ],
    rosters: [
      {
        id: 'roster-1',
        name: 'Varsity 2025-26',
        season: { id: 'season-1', name: 'Spring 2026' },
        players: [
          { id: 'p1', firstName: 'Alex', lastName: 'Jennings', jerseyNumber: '10', position: 'Forward' },
          { id: 'p2', firstName: 'Marcus', lastName: 'Williams', jerseyNumber: '7', position: 'Midfielder' },
          { id: 'p3', firstName: 'Sofia', lastName: 'Patel', jerseyNumber: '1', position: 'Goalkeeper' },
          { id: 'p4', firstName: 'Jordan', lastName: 'Lee', jerseyNumber: '4', position: 'Defender' },
          { id: 'p5', firstName: 'Emma', lastName: 'Thompson', jerseyNumber: '11', position: 'Winger' },
          { id: 'p6', firstName: 'Liam', lastName: 'Garcia', jerseyNumber: '6', position: 'Center Back' },
          { id: 'p7', firstName: 'Ava', lastName: 'Kim', jerseyNumber: '8', position: 'Midfielder' },
          { id: 'p8', firstName: 'Noah', lastName: 'Davis', jerseyNumber: '9', position: 'Striker' },
          { id: 'p9', firstName: 'Mia', lastName: 'Johnson', jerseyNumber: '3', position: 'Full Back' },
          { id: 'p10', firstName: 'Ethan', lastName: 'Brown', jerseyNumber: '5', position: 'Defensive Midfielder' },
          { id: 'p11', firstName: 'Chloe', lastName: 'Martinez', jerseyNumber: '2', position: 'Right Back' },
        ],
      },
      {
        id: 'roster-2',
        name: 'JV 2025-26',
        season: { id: 'season-1', name: 'Spring 2026' },
        players: [
          { id: 'p20', firstName: 'Tyler', lastName: 'Scott', jerseyNumber: '14', position: 'Midfielder' },
          { id: 'p21', firstName: 'Grace', lastName: 'Anderson', jerseyNumber: '12', position: 'Forward' },
          { id: 'p22', firstName: 'Ryan', lastName: 'Taylor', jerseyNumber: '15', position: 'Defender' },
        ],
      },
    ],
  },
  {
    id: 'team-2',
    name: 'Greenhill Hornets',
    sportType: 'BASKETBALL',
    primaryColor: '#1a5e1a',
    secondaryColor: '#C5972C',
    location: 'Greenhill Gymnasium',
    league: { id: 'league-2', name: 'SPC Basketball' },
    _count: { members: 14, rosters: 1 },
    members: [],
    rosters: [
      {
        id: 'roster-3',
        name: 'Varsity 2025-26',
        season: null,
        players: [
          { id: 'p30', firstName: 'Jaylen', lastName: 'Mitchell', jerseyNumber: '23', position: 'Point Guard' },
          { id: 'p31', firstName: 'Kayla', lastName: 'Ross', jerseyNumber: '15', position: 'Shooting Guard' },
          { id: 'p32', firstName: 'Devon', lastName: 'Clark', jerseyNumber: '34', position: 'Center' },
          { id: 'p33', firstName: 'Zoe', lastName: 'Wright', jerseyNumber: '11', position: 'Small Forward' },
          { id: 'p34', firstName: 'Isaiah', lastName: 'Moore', jerseyNumber: '5', position: 'Power Forward' },
        ],
      },
    ],
  },
  {
    id: 'team-3',
    name: 'Greenhill Hornets',
    sportType: 'SOFTBALL',
    primaryColor: '#1a5e1a',
    secondaryColor: '#C5972C',
    location: 'Greenhill Softball Field',
    league: { id: 'league-3', name: 'SPC Softball' },
    _count: { members: 16, rosters: 1 },
    members: [],
    rosters: [
      {
        id: 'roster-4',
        name: 'Varsity 2025-26',
        season: null,
        players: [
          { id: 'p40', firstName: 'Riley', lastName: 'Harper', jerseyNumber: '2', position: 'Pitcher' },
          { id: 'p41', firstName: 'Brooklyn', lastName: 'Foster', jerseyNumber: '7', position: 'Shortstop' },
          { id: 'p42', firstName: 'Peyton', lastName: 'Reed', jerseyNumber: '12', position: 'Catcher' },
          { id: 'p43', firstName: 'Quinn', lastName: 'Evans', jerseyNumber: '22', position: 'First Base' },
        ],
      },
    ],
  },
];

export const demoGames = [
  {
    id: 'game-1',
    sportType: 'SOCCER',
    status: 'COMPLETED',
    scheduledAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    location: 'Greenhill School Stadium',
    homeTeam: { id: 'team-1', name: 'Greenhill Hornets', primaryColor: '#1a5e1a' },
    awayTeam: { id: 'team-away-1', name: 'St. Mark\'s Lions', primaryColor: '#1e3a5f' },
    homeScore: 3,
    awayScore: 1,
    season: { id: 'season-1', name: 'Spring 2026' },
  },
  {
    id: 'game-2',
    sportType: 'SOCCER',
    status: 'SCHEDULED',
    scheduledAt: new Date(Date.now() + 2 * 86400000).toISOString(),
    location: 'Greenhill School Stadium',
    homeTeam: { id: 'team-1', name: 'Greenhill Hornets', primaryColor: '#1a5e1a' },
    awayTeam: { id: 'team-away-2', name: 'ESD Eagles', primaryColor: '#8B0000' },
    homeScore: null,
    awayScore: null,
    season: { id: 'season-1', name: 'Spring 2026' },
  },
  {
    id: 'game-3',
    sportType: 'BASKETBALL',
    status: 'SCHEDULED',
    scheduledAt: new Date(Date.now() + 4 * 86400000).toISOString(),
    location: 'Greenhill Gymnasium',
    homeTeam: { id: 'team-2', name: 'Greenhill Hornets', primaryColor: '#1a5e1a' },
    awayTeam: { id: 'team-away-3', name: 'Hockaday Daisies', primaryColor: '#4B0082' },
    homeScore: null,
    awayScore: null,
    season: { id: 'season-2', name: 'Winter 2025-26' },
  },
  {
    id: 'game-4',
    sportType: 'BASKETBALL',
    status: 'COMPLETED',
    scheduledAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    location: 'Greenhill Gymnasium',
    homeTeam: { id: 'team-2', name: 'Greenhill Hornets', primaryColor: '#1a5e1a' },
    awayTeam: { id: 'team-away-4', name: 'Parish Bears', primaryColor: '#333' },
    homeScore: 68,
    awayScore: 55,
    season: { id: 'season-2', name: 'Winter 2025-26' },
  },
  {
    id: 'game-5',
    sportType: 'SOFTBALL',
    status: 'SCHEDULED',
    scheduledAt: new Date(Date.now() + 6 * 86400000).toISOString(),
    location: 'Greenhill Softball Field',
    homeTeam: { id: 'team-3', name: 'Greenhill Hornets', primaryColor: '#1a5e1a' },
    awayTeam: { id: 'team-away-5', name: 'Oakridge Owls', primaryColor: '#B8860B' },
    homeScore: null,
    awayScore: null,
    season: { id: 'season-3', name: 'Spring 2026' },
  },
  {
    id: 'game-6',
    sportType: 'SOFTBALL',
    status: 'IN_PROGRESS',
    scheduledAt: new Date(Date.now() - 3600000).toISOString(),
    location: 'Greenhill Softball Field',
    homeTeam: { id: 'team-3', name: 'Greenhill Hornets', primaryColor: '#1a5e1a' },
    awayTeam: { id: 'team-away-6', name: 'Lamplighter Falcons', primaryColor: '#2F4F4F' },
    homeScore: 5,
    awayScore: 3,
    season: { id: 'season-3', name: 'Spring 2026' },
  },
];

export const demoLeagues = [
  { id: 'league-1', name: 'SPC Soccer Conference', sportType: 'SOCCER', description: 'Southwest Preparatory Conference Soccer Division', location: 'Dallas-Fort Worth', _count: { teams: 8, members: 12, seasons: 3 } },
  { id: 'league-2', name: 'SPC Basketball', sportType: 'BASKETBALL', description: 'Southwest Preparatory Conference Basketball Division', location: 'Dallas-Fort Worth', _count: { teams: 10, members: 15, seasons: 4 } },
  { id: 'league-3', name: 'SPC Softball', sportType: 'SOFTBALL', description: 'Southwest Preparatory Conference Softball Division', location: 'Dallas-Fort Worth', _count: { teams: 6, members: 9, seasons: 2 } },
];

export const demoFamilies = [
  {
    id: 'family-1',
    name: 'The Jennings Family',
    members: [
      { id: 'fm1', role: 'OWNER', user: { id: 'u1', firstName: 'Alex', lastName: 'Jennings', email: 'majenn@gmail.com', avatarUrl: null } },
      { id: 'fm2', role: 'MEMBER', user: { id: 'u2', firstName: 'Lisa', lastName: 'Jennings', email: 'lisa.j@gmail.com', avatarUrl: null } },
      { id: 'fm3', role: 'MEMBER', user: { id: 'u3', firstName: 'Tom', lastName: 'Jennings', email: 'tom.j@gmail.com', avatarUrl: null } },
    ],
  },
];

export const demoMedia = [
  { id: 'media-1', type: 'PHOTO', fileName: 'soccer-goal-celebration.jpg', createdAt: new Date(Date.now() - 86400000).toISOString(), uploader: { firstName: 'Mike', lastName: 'Rodriguez' }, caption: 'Alex scores the winning goal!' },
  { id: 'media-2', type: 'VIDEO', fileName: 'basketball-highlights.mp4', createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), uploader: { firstName: 'Sarah', lastName: 'Chen' }, caption: 'Game highlights vs Parish' },
  { id: 'media-3', type: 'PHOTO', fileName: 'team-photo-2026.jpg', createdAt: new Date(Date.now() - 5 * 86400000).toISOString(), uploader: { firstName: 'Alex', lastName: 'Jennings' }, caption: 'Varsity team photo' },
  { id: 'media-4', type: 'PHOTO', fileName: 'softball-pitch.jpg', createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), uploader: { firstName: 'Riley', lastName: 'Harper' }, caption: 'Pre-game warmup' },
  { id: 'media-5', type: 'VIDEO', fileName: 'soccer-practice-drills.mp4', createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), uploader: { firstName: 'Mike', lastName: 'Rodriguez' }, caption: 'New drill formations' },
  { id: 'media-6', type: 'PHOTO', fileName: 'basketball-dunk.jpg', createdAt: new Date(Date.now() - 86400000).toISOString(), uploader: { firstName: 'Jaylen', lastName: 'Mitchell' }, caption: 'Game day!' },
];

export const demoStreams = [
  {
    id: 'stream-1',
    title: 'Hornets vs Falcons - LIVE',
    status: 'LIVE',
    hlsUrl: '/streams/demo/index.m3u8',
    viewerCount: 47,
    game: {
      id: 'game-6',
      scheduledAt: new Date(Date.now() - 3600000).toISOString(),
      homeTeam: { id: 'team-3', name: 'Greenhill Hornets' },
      awayTeam: { id: 'team-away-6', name: 'Lamplighter Falcons' },
    },
    starter: { id: 'u1', firstName: 'Mike', lastName: 'Rodriguez' },
  },
  {
    id: 'stream-2',
    title: 'Hornets vs Lions - Soccer',
    status: 'ENDED',
    hlsUrl: null,
    viewerCount: 112,
    game: {
      id: 'game-1',
      scheduledAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      homeTeam: { id: 'team-1', name: 'Greenhill Hornets' },
      awayTeam: { id: 'team-away-1', name: "St. Mark's Lions" },
    },
    starter: { id: 'u2', firstName: 'Sarah', lastName: 'Chen' },
  },
];

export const demoNotifications = [
  { id: 'n1', type: 'GAME_REMINDER', title: 'Game Tomorrow', message: 'Hornets vs ESD Eagles - Soccer at 4:00 PM', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'n2', type: 'STREAM_STARTED', title: 'Live Now!', message: 'Softball game vs Lamplighter is streaming live', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'n3', type: 'SCORE_UPDATE', title: 'Final Score', message: 'Hornets 3 - Lions 1 (Soccer)', read: true, createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
];
