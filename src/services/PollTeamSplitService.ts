
import {backendUrl} from "../globalConfig";
import {get} from "../commons/client/http";
import { Team } from "../api/Team.types";

export const getPollTeamSplit = async (pollId: string, teamsNum?: number, splitStrategy?: string): Promise<Team[]> => {
    if (typeof teamsNum === 'undefined') {
        teamsNum = 2;
    }
        const response = (await get(
        `${backendUrl}/team/split/${pollId}?teamsNum=${teamsNum}&splitType=${splitStrategy}`
    )) as Team[] 

    return response;
}