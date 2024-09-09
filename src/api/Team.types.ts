import { Player } from "./Player.types"

export type Team = {
    name: string
    players: Player []
}

export type Game = {
    id: number,
    teamSize: number,
    teams: Team[],
    createdAt: Date,
    teamOneName: string,
    teamTwoName: string,
    teamOneScored: number,
    teamTwoScored: number,
}


export type GameSplit = {
    id: string,
    pollId: string,
    teamSize: number,
    teams: Team[],
    games: Game [],
    createdAt: Date
}

export type GameScore = {
    teamOneName: string
    teamTwoName: string
    teamOneScored: number
    teamTwoScored: number
}
