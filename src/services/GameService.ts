
import { backendUrl } from "../globalConfig";
import { get, del, put } from "../commons/client/http";
import { Game } from "../api/Team.types";

export const getGamesByPollId = async (pollId: string): Promise<Game[]> => {
    const response = (await get(
        `${backendUrl()}/game/poll/${pollId}`
    )) as Game[]

    return response;
}

export const getGames = async (): Promise<Game[]> => {
    const response = (await get(
        `${backendUrl()}/game`
    )) as Game[]

    return response;
}

export const deleteGamePlayerEntry = async (gameId: number, playerId: number): Promise<boolean> => {

    const response = (await del(
        `${backendUrl()}/game/${gameId}/team_entry/${playerId}`
    )) as boolean

    return response;
}

export const deleteGameById = async (gameId: number): Promise<boolean> => {

    const response = (await del(
        `${backendUrl()}/game/${gameId}`
    )) as boolean

    return response;
}

