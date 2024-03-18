import { Player } from "./Player.types"

export type Poll = {
    id: string
    creationTime: Date
    question: string

}

export type PollVote = {
    id: number,
    player: Player
}
