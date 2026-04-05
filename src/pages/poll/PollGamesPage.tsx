import { useEffect, useState } from "react";
import { GameSplit } from "../../api/Team.types";
import { getGameSplitsByPollId, deleteGameSplitById } from "../../services/GameSplitService";
import GameSplitListCard from "../games/GameSplitListCard";
import ConfirmDialog from "components/ConfirmDialog";

type GamesPageProps = {
    pollId: string
    refreshKey?: number
}

export const PollGamesPage = ({ pollId, refreshKey }: GamesPageProps) => {

    const [gameSplits, setGameSplits] = useState<GameSplit[] | null>(null);
    const [, setLoading] = useState(true);
    const [, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedGameId, setSelectedGameId] = useState<string>('');

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
    }, [refreshKey]);

    const onDeleteGame = async (gameId: string) => {
        await deleteGameSplitById(gameId);
        setGameSplits(gameSplits ? gameSplits.filter(i => i.id !== gameId) : null);
    };

    const handleDeleteClick = (id: string) => {
        setSelectedGameId(id);
        setOpen(true);
    };

    return (
        <div>
            <h1>Games Splits</h1>
            {gameSplits &&
                <GameSplitListCard gameSplits={gameSplits} onDelete={handleDeleteClick} />
            }
            <ConfirmDialog
                title="Delete Game?"
                open={open}
                setOpen={setOpen}
                onConfirm={() => onDeleteGame(selectedGameId)}
            >
                Are you sure you want to delete game?
            </ConfirmDialog>
        </div>

    )
}

export default PollGamesPage;
