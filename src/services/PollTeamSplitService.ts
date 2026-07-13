
import {backendUrl} from "../globalConfig";
import {get, post} from "../commons/client/http";
import { Team } from "../api/Team.types";

export const getPollTeamSplit = async (pollId: string, teamsNum?: number, splitStrategy?: string, teamNames?: string[]): Promise<Team[]> => {
    if (typeof teamsNum === 'undefined') {
        teamsNum = 2;
    }
    const namesParam = teamNames && teamNames.length > 0 ? `&teamNames=${encodeURIComponent(teamNames.join(','))}` : '';
    const response = (await get(
        `${backendUrl()}/team/split/${pollId}?teamsNum=${teamsNum}&splitType=${splitStrategy}${namesParam}`
    )) as Team[]

    return response;
}

export const splitPollTeams = async (pollId: string, teamsNum: number = 2, teamNames?: string[], sendTelegram: boolean = true): Promise<Team[]> => {
    const response = (await post(
        `${backendUrl()}/poll/${pollId}/split?teamsNum=${teamsNum}`,
        { teamNames, sendTelegram }
    )) as Team[];
    return response;
}