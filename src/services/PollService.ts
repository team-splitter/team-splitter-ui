
import {backendUrl} from "../globalConfig";
import { get, post, del} from "../commons/client/http";
import { Poll, PollVote } from "../api/Poll.types";
import { Page } from "../api/Pagination.types";


export const getPolls = async (page: number, pageSize: number): Promise<Page<Poll>> => {
    const response = (await get(
        `${backendUrl()}/poll?page=${page}&pageSize=${pageSize}`
    )) as Page<Poll>;

    return response;
}

export const getPollById = async (pollId: string): Promise<Poll> => {
    // const {body} = await get({
    //     apiName: 'teamsplitterapi',
    //     path: `/api/v1/poll/${pollId}`
    // }).response;

    // return JSON.parse(await body.text()) as Poll;

    const response = (await get(
        `${backendUrl()}/poll/${pollId}`
    )) as Poll 

    return response;
}

export const getVotesForPoll = async (pollId: string): Promise<PollVote[]> => {
    // const {body} = await get({
    //     apiName: 'teamsplitterapi',
    //     path: `/api/v1/poll/${pollId}/vote`
    // }).response;

    // return JSON.parse(await body.text()) as PollVote[];

    const response = (await get(
        `${backendUrl()}/poll/${pollId}/vote`
    )) as PollVote[] 

    return response;   
}

export const deletePollVote = async (pollId: string, voteId: string): Promise<boolean> => {
    const response = (await del(
        `${backendUrl()}/poll/${pollId}/vote/${voteId}`
    )) as boolean 

    return response;   
}

export const addPollVote = async (pollId: string, playerId: number): Promise<PollVote> => {
    const response = (await post(
        `${backendUrl()}/poll/${pollId}/vote`,
        {
            "player": {
                "id": playerId
            }
        }
    )) as PollVote

    return response;
}

export const createPoll = async (question: string): Promise<Poll> => {
    const response = (await post(
        `${backendUrl()}/poll`,
        { question }
    )) as Poll

    return response;
}