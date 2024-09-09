import { Player } from "./Player.types"

export type Poll = {
    id: string
    createdAt: Date
    question: string
    answers: [PollVote]
}

export type PollVote = {
    id: string,
    player: Player
}
