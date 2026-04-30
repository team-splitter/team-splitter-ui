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
    const [splitKey, setSplitKey] = useState(0);
    const [voteKey, setVoteKey] = useState(0);

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
                <div>
                    <h1>{poll.question}</h1>
                    <PollVotesPage pollId={pollId} poll={poll} onVoteChange={() => setVoteKey(k => k + 1)}/>
                </div>
            }
            
            <TeamSplitPage pollId={pollId} refreshKey={voteKey} onSplitSuccess={() => setSplitKey(k => k + 1)}/>
            <PollGamesPage pollId={pollId} refreshKey={splitKey}/>
        </>
        
    )
}

export default PollPage;