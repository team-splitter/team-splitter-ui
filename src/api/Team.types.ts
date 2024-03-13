import { Player } from "./Player.types"

export type Team = {
    gameId: number
    name: string
    players: Player []
}

export type Game = {
    id: number,
    pollId: string,
    teamSize: number,
    redScored: number,
    blueScored: number,
    teams: Team[],
    creationTime: Date,
    teamOneName: string,
    teamTwoName: string,
    teamOneScored: number,
    teamTwoScored: number,
    gameSplitId: number
}


export type GameSplit = {
    id: number,
    pollId: string,
    teamSize: number,
    teams: Team[],
    games: Game [],
    creationTime: Date
}

export type GameScore = {
    teamOneName: string
    teamTwoName: string
    teamOneScored: number
    teamTwoScored: number
}
