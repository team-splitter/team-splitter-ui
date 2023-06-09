
import { backendUrl } from "../globalConfig";
import { get, post, del, put } from "../commons/client/http";
import { PlayerStat } from "api/PlayerStat.types";

export const getPlayerStats = async (): Promise<PlayerStat[]> => {
    const response = (await get(
        `${backendUrl}/player_stat`
    )) as PlayerStat[]

    return response;
}

export const getPlayerStatById = async (playerId: number): Promise<PlayerStat> => {
    const response = (await get(
        `${backendUrl}/player_stat/${playerId}`
    )) as PlayerStat

    return response;
}
