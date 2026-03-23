import { SportType } from '@prisma/client';

// Default stat templates for each sport
export function getDefaultStats(sportType: SportType): Record<string, number> {
  switch (sportType) {
    case 'SOCCER':
      return {
        goals: 0,
        assists: 0,
        shots: 0,
        shotsOnTarget: 0,
        saves: 0,
        fouls: 0,
        yellowCards: 0,
        redCards: 0,
        minutesPlayed: 0,
        cornerKicks: 0,
      };
    case 'SOFTBALL':
      return {
        atBats: 0,
        hits: 0,
        runs: 0,
        rbis: 0,
        homeRuns: 0,
        doubles: 0,
        triples: 0,
        walks: 0,
        strikeouts: 0,
        stolenBases: 0,
        errors: 0,
        inningsPitched: 0,
        earnedRuns: 0,
        pitchStrikeouts: 0,
        pitchWalks: 0,
      };
    case 'BASKETBALL':
      return {
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fouls: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        twoPointersMade: 0,
        twoPointersAttempted: 0,
        threePointersMade: 0,
        threePointersAttempted: 0,
        minutesPlayed: 0,
      };
  }
}

// Stat display labels for each sport
export function getStatLabels(sportType: SportType): Record<string, string> {
  switch (sportType) {
    case 'SOCCER':
      return {
        goals: 'Goals',
        assists: 'Assists',
        shots: 'Shots',
        shotsOnTarget: 'Shots on Target',
        saves: 'Saves',
        fouls: 'Fouls',
        yellowCards: 'Yellow Cards',
        redCards: 'Red Cards',
        minutesPlayed: 'Minutes Played',
        cornerKicks: 'Corner Kicks',
      };
    case 'SOFTBALL':
      return {
        atBats: 'At Bats',
        hits: 'Hits',
        runs: 'Runs',
        rbis: 'RBIs',
        homeRuns: 'Home Runs',
        doubles: 'Doubles',
        triples: 'Triples',
        walks: 'Walks',
        strikeouts: 'Strikeouts',
        stolenBases: 'Stolen Bases',
        errors: 'Errors',
        inningsPitched: 'Innings Pitched',
        earnedRuns: 'Earned Runs',
        pitchStrikeouts: 'K (Pitching)',
        pitchWalks: 'BB (Pitching)',
      };
    case 'BASKETBALL':
      return {
        points: 'Points',
        rebounds: 'Rebounds',
        assists: 'Assists',
        steals: 'Steals',
        blocks: 'Blocks',
        turnovers: 'Turnovers',
        fouls: 'Fouls',
        freeThrowsMade: 'FT Made',
        freeThrowsAttempted: 'FT Attempted',
        twoPointersMade: '2PT Made',
        twoPointersAttempted: '2PT Attempted',
        threePointersMade: '3PT Made',
        threePointersAttempted: '3PT Attempted',
        minutesPlayed: 'Minutes Played',
      };
  }
}

// Position options per sport
export function getPositions(sportType: SportType): string[] {
  switch (sportType) {
    case 'SOCCER':
      return ['Goalkeeper', 'Defender', 'Center Back', 'Full Back', 'Wing Back', 'Midfielder', 'Central Midfielder', 'Attacking Midfielder', 'Defensive Midfielder', 'Winger', 'Forward', 'Striker'];
    case 'SOFTBALL':
      return ['Pitcher', 'Catcher', 'First Base', 'Second Base', 'Third Base', 'Shortstop', 'Left Field', 'Center Field', 'Right Field', 'Designated Hitter'];
    case 'BASKETBALL':
      return ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'];
  }
}
