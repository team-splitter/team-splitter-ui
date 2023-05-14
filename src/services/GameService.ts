
import { backendUrl } from "../globalConfig";
import { get, del } from "../commons/client/http";
import { Game } from "../api/Team.types";

export const getGames = async (pollId: string): Promise<Game[]> => {
    const response = (await get(
        `${backendUrl}/game/poll/${pollId}`
    )) as Game[]

    return response;
}

export const deleteGamePlayerEntry = async (gameId: number, playerId: number): Promise<boolean> => {

    const response = (await del(
        `${backendUrl}/game/${gameId}/team_entry/${playerId}`
    )) as boolean

    return response;
}
