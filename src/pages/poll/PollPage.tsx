import { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import { Poll } from 'api/Poll.types';
import { getPollById } from 'services/PollService';
import PollGamesPage from 'pages/poll/PollGamesPage';
import { PollVotesPage } from './PollVotesPage';
import TeamSplitPage from 'pages/teams/TeamSplitPage';

type PollPageProps = {
    
}

const PollPage = () => {
    const params = useParams();
    const pollId = `${params.id}`;

    const [poll, setPoll] = useState<Poll | null> (null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null> (null);

    useEffect(()=> {
        getPollById(pollId)
            .then((data) => {
                setPoll(data);
                setLoading(false);
            }
            ).catch((err) => {
                setError(err.message);
                setPoll(null);
            })
            .finally(() => {
                setLoading(false)
            });

    },  [])


    return (
        <>
            {loading && <div> A moment please...</div>}
            {error && (
                <div>{`There is a problem fetching the poll data - ${error}`}</div>
            )}
            {poll && 
                <h1>{poll.question}</h1>
            }
            <PollVotesPage pollId={pollId}/>
            <TeamSplitPage pollId={pollId}/> 
            <PollGamesPage pollId={pollId}/>
        </>
        
    )
}

export default PollPage;