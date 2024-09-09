import { useEffect, useState } from "react";
import { GameSplit } from "../../api/Team.types";
import { getGameSplitsByPollId } from "../../services/GameSplitService";
import GameSplitListCard from "../games/GameSplitListCard";

type GamesPageProps = {
    pollId: string
}

export const PollGamesPage = ({ pollId }: GamesPageProps) => {

    const [gameSplits, setGameSplits] = useState<GameSplit[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getGameSplitsByPollId(pollId)
            .then((data) => {
                setGameSplits(data.content);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setGameSplits(null);
            })
            .finally(() => {
                setLoading(false)
            });
    }, []);

    return (
        <div>
            <h1>Games Splits</h1>
            {gameSplits &&
                <GameSplitListCard gameSplits={gameSplits} />
            }
        </div>

    )
}

export default PollGamesPage;