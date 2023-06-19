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
    creationTime: Date
}