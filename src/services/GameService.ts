
import { backendUrl } from "../globalConfig";
import { get } from "../commons/client/http";
import { Game } from "../api/Team.types";

export const getGames = async (pollId: string): Promise<Game[]> => {
    const response = (await get(
        `${backendUrl}/game/poll/${pollId}`
    )) as Game[]

    return response;
}