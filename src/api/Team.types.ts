import { Player } from "./Player.types"

export type Team = {
    gameId: number
    name: string
    players: Player []
}

export type Game = {
    id: number,
    pollId: string,
    teams: Team[],
    creationTime: Date
}