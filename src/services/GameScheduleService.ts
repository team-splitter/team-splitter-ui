
import { backendUrl } from "../globalConfig";
import { get, post, del } from "../commons/client/http";
import { GameSchedule } from "api/GameSchedule.types";

export const getAllSchedules = async (): Promise<GameSchedule[]> => {
    const response = (await get(
        `${backendUrl()}/game-schedule`
    )) as GameSchedule[]

    return response;
}

export const getScheduleById = async (id: string): Promise<GameSchedule> => {
    const response = (await get(
        `${backendUrl()}/game-schedule/${id}`
    )) as GameSchedule

    return response;
}

export const createSchedule = async (schedule: GameSchedule): Promise<GameSchedule> => {
    const response = (await post(
        `${backendUrl()}/game-schedule`,
        schedule
    )) as GameSchedule

    return response;
}

export const deleteScheduleById = async (id: string): Promise<boolean> => {
    const response = (await del(
        `${backendUrl()}/game-schedule/${id}`
    )) as boolean

    return response;
}