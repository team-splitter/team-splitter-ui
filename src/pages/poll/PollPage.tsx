import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Stack } from '@mui/material';
import { Poll } from 'api/Poll.types';
import { getPollById } from 'services/PollService';
import PollGamesPage from 'pages/poll/PollGamesPage';
import { PollVotesPage } from './PollVotesPage';
import TeamSplitPage from 'pages/teams/TeamSplitPage';
import PageLayout from 'components/layout/PageLayout';
import PageHeader from 'components/layout/PageHeader';
import ErrorMessage from 'components/layout/ErrorMessage';
import SectionCard from 'components/layout/SectionCard';
import InlineLoading from 'components/layout/InlineLoading';

const PollPage = () => {
    const params = useParams();
    const pollId = `${params.id}`;

    const [poll, setPoll] = useState<Poll | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [splitKey, setSplitKey] = useState(0);
    const [voteKey, setVoteKey] = useState(0);

    useEffect(() => {
        getPollById(pollId)
            .then((data) => {
                setPoll(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setPoll(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <PageLayout>
            <PageHeader
                title={poll ? poll.question : 'Poll'}
                subtitle={`Poll · ${pollId}`}
            />
            <ErrorMessage message={error && `There is a problem fetching the poll data - ${error}`} />
            {loading && <InlineLoading />}

            {!loading && (
                <Stack spacing={3}>
                    {poll && (
                        <SectionCard title="Players Going">
                            <PollVotesPage
                                pollId={pollId}
                                poll={poll}
                                onVoteChange={() => setVoteKey((k) => k + 1)}
                            />
                        </SectionCard>
                    )}
                    <SectionCard title="Team Split">
                        <TeamSplitPage
                            pollId={pollId}
                            refreshKey={voteKey}
                            onSplitSuccess={() => setSplitKey((k) => k + 1)}
                        />
                    </SectionCard>
                    <SectionCard title="Game Splits">
                        <PollGamesPage pollId={pollId} refreshKey={splitKey} />
                    </SectionCard>
                </Stack>
            )}
        </PageLayout>
    );
};

export default PollPage;
