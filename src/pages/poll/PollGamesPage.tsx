import { useEffect, useState } from "react";
import { Game } from "../../api/Team.types";
import { getGamesByPollId } from "../../services/GameService";
import GameListCard from "../games/GameListCard";

type GamesPageProps = {
    pollId: string
}

export const PollGamesPage = ({ pollId }: GamesPageProps) => {

    const [games, setGames] = useState<Game[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getGamesByPollId(pollId)
            .then((data) => {
                setGames(data);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setGames(null);
            })
            .finally(() => {
                setLoading(false)
            });
    }, []);

    return (
        <div>
            <h1>Games</h1>
            {games &&
                <GameListCard games={games} />
            }
        </div>

    )
}

export default PollGamesPage;