
import { backendUrl } from "../globalConfig";
import { get, del, put, post } from "../commons/client/http";
import { GameScore, GameSplit } from "../api/Team.types";

export const getGameSplitsByPollId = async (pollId: string): Promise<GameSplit[]> => {
    const response = (await get(
        `${backendUrl}/game_split/poll/${pollId}`
    )) as GameSplit[]

    return response;
}

export const getGameSplits = async (): Promise<GameSplit[]> => {
    const response = (await get(
        `${backendUrl}/game_split`
    )) as GameSplit[]

    return response;
}

export const deleteGameSplitPlayerEntry = async (gameSplitId: number, playerId: number): Promise<boolean> => {

    const response = (await del(
        `${backendUrl}/game_split/${gameSplitId}/team_entry/${playerId}`
    )) as boolean

    return response;
}

export const deleteGameSplitById = async (gameSplitId: number): Promise<boolean> => {

    const response = (await del(
        `${backendUrl}/game_split/${gameSplitId}`
    )) as boolean

    return response;
}

export const setGameSplitScores = async (gameSplitId: number, gameScores: GameScore[]): Promise<GameSplit> => {

    const response = (await post(
        `${backendUrl}/game_split/${gameSplitId}/score`, gameScores
    )) as GameSplit

    return response;
}

