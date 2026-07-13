// Colors the backend team splitter understands (see team_splitter_service.mjs `team_colors`).
// Order here defines the defaults: 2 teams -> Red/Blue, 3 -> Red/Blue/White, 4 -> Red/Blue/White/Black.
export const TEAM_COLORS = ['Red', 'Blue', 'White', 'Black', 'Yellow', 'Green'] as const;

export type TeamColor = typeof TEAM_COLORS[number];

export const TEAM_COLOR_HEX: Record<string, string> = {
    Red: '#e53935',
    Blue: '#1e88e5',
    White: '#fafafa',
    Black: '#212121',
    Yellow: '#fdd835',
    Green: '#43a047',
};

// Default color assignment for a given number of teams.
export const defaultTeamNames = (teamsNum: number): string[] =>
    TEAM_COLORS.slice(0, teamsNum);
