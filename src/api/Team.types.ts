import { Player } from "./Player.types"

export type Team = {
    name: string
    players: Player []
}

export type Game = {
    id: number,
    pollId: string,
    teams: Team[]
}