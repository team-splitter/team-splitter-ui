
import { backendUrl } from "../globalConfig";
import { get, post, del, put } from "../commons/client/http";
import { PlayerStat } from "api/PlayerStat.types";

export const getPlayerStats = async (startDate: string, endDate: string): Promise<PlayerStat[]> => {
    console.log(`startDate=${startDate} , endDate=${endDate}`);
    const response = (await get(
        `${backendUrl()}/player-stat?startDate=${startDate}&endDate=${endDate}`
    )) as PlayerStat[]

    return response;
}

export const getPlayerStatById = async (playerId: number): Promise<PlayerStat> => {
    const response = (await get(
        `${backendUrl()}/player-stat/${playerId}`
    )) as PlayerStat

    return response;
}
