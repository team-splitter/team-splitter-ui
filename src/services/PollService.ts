
import {backendUrl} from "../globalConfig";
import {get, post, del} from "../commons/client/http";
import { Poll, PollVote } from "../api/Poll.types";
import { Page } from "../api/Pagination.types";




export const getPolls = async (page: number = 0, size: number = 10): Promise<Page<Poll>> => {
    const response = (await get(
        `${backendUrl}/poll?page=${page}&size=${size}`
    )) as Page<Poll>

    return response;
}

export const getPollById = async (pollId: string): Promise<Poll> => {
    const response = (await get(
        `${backendUrl}/poll/${pollId}`
    )) as Poll 

    return response;
}

export const getVotesForPoll = async (pollId: string): Promise<PollVote[]> => {
    const response = (await get(
        `${backendUrl}/poll/${pollId}/vote`
    )) as PollVote[] 

    return response;   
}

export const deletePollVote = async (pollId: string, voteId: number): Promise<boolean> => {
    const response = (await del(
        `${backendUrl}/poll/${pollId}/vote/${voteId}`
    )) as boolean 

    return response;   
}

export const addPollVote = async (pollId: string, playerId: number): Promise<PollVote> => {
    const response = (await post(
        `${backendUrl}/poll/${pollId}/vote`,
        {
            "player": {
                "id": playerId
            }
        }
    )) as PollVote 

    return response;     
}