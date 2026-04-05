
import {backendUrl} from "../globalConfig";
import {get, post} from "../commons/client/http";
import { Team } from "../api/Team.types";

export const getPollTeamSplit = async (pollId: string, teamsNum?: number, splitStrategy?: string): Promise<Team[]> => {
    if (typeof teamsNum === 'undefined') {
        teamsNum = 2;
    }
        const response = (await get(
        `${backendUrl()}/team/split/${pollId}?teamsNum=${teamsNum}&splitType=${splitStrategy}`
    )) as Team[]

    return response;
}

export const splitPollTeams = async (pollId: string, teamsNum: number = 2): Promise<Team[]> => {
    const response = (await post(
        `${backendUrl()}/poll/${pollId}/split?teamsNum=${teamsNum}`,
        {}
    )) as Team[];
    return response;
}