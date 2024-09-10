
import { backendUrl } from "../globalConfig";
import { get, post, del, put } from "../commons/client/http";
import { Player } from "../api/Player.types";

export const getPlayers = async (): Promise<Player[]> => {
    const response = (await get(
        `${backendUrl()}/player`
    )) as Player[]

    return response;
}

export const getPlayerById = async (playerId: number): Promise<Player> => {
    const response = (await get(
        `${backendUrl()}/player/${playerId}`
    )) as Player

    return response;
}

export const createPlayer = async (player: Player): Promise<Player> => {
    const response = (await post(
        `${backendUrl()}/player`,
        player
    )) as Player

    return response;
}

export const updatePlayer = async (id: string, player: Player): Promise<Player> => {
    const response = (await put(
        `${backendUrl()}/player/${id}`,
        player
    )) as Player

    return response;
}

export const deletePlayer = async (playerId: number): Promise<boolean> => {

    const response = (await del(
        `${backendUrl()}/player/${playerId}`
    )) as boolean

    return response;
}
