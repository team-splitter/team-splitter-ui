
import { backendUrl } from "../globalConfig";
import { get, del, put, post } from "../commons/client/http";
import { GameScore, GameSplit, Game } from "../api/Team.types";
import { Page } from "api/Pagination.types";

export const getGameSplitsByPollId = async (pollId: string): Promise<Page<GameSplit>> => {
    const response = (await get(
        `${backendUrl()}/game-split?pollId=${pollId}`
    )) as Page<GameSplit>

    return response;
}

export const getGameSplits = async (): Promise<Page<GameSplit>> => {
    const response = (await get(
        `${backendUrl()}/game-split`
    )) as Page<GameSplit>

    return response;
}

export const deleteGameSplitPlayerEntry = async (gameSplitId: string, playerId: number): Promise<boolean> => {

    const response = (await del(
        `${backendUrl()}/game-split/${gameSplitId}/team_entry/${playerId}`
    )) as boolean

    return response;
}

export const deleteGameSplitById = async (gameSplitId: string): Promise<boolean> => {

    const response = (await del(
        `${backendUrl()}/game-split/${gameSplitId}`
    )) as boolean

    return response;
}

export const setGameSplitScores = async (gameSplitId: string, gameScores: GameScore[]): Promise<Game []> => {

    const response = (await post(
        `${backendUrl()}/game-split/${gameSplitId}/score`, gameScores
    )) as Game[];

    return response;
}

