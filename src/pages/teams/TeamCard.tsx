import { Team, GameSplit } from "../../api/Team.types";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Player } from "api/Player.types";
import { useState } from "react";
import ConfirmDialog from 'components/ConfirmDialog';
import { deleteGameSplitPlayerEntry } from "services/GameSplitService";

type TeamCardProps = {
    team: Team
    gameSplit?: GameSplit
    onDragStart?: (player: Player, fromTeamName: string) => void
    onDrop?: (toTeamName: string) => void
}

const TeamCard = ({team, gameSplit, onDragStart, onDrop}: TeamCardProps) => {
    const [open, setOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player>({} as Player);
    const [isDragOver, setIsDragOver] = useState(false);

    const onDeletePlayerEntry = async (gameId:string , player: Player) => {
        await deleteGameSplitPlayerEntry(gameId, player.id);
    }

    const totalTeamScore = team.players.map(p => p.score).reduce((acc, score) => acc + score, 0);

    return (
        <div
            style={{
                width: "400px",
                display: "block",
                float: "left",
                outline: isDragOver ? "2px dashed #1976d2" : "none",
                borderRadius: "4px",
                backgroundColor: isDragOver ? "rgba(25, 118, 210, 0.05)" : "transparent",
                transition: "background-color 0.15s, outline 0.15s"
            }}
            onDragOver={(e) => {
                if (onDrop) {
                    e.preventDefault();
                    setIsDragOver(true);
                }
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                onDrop?.(team.name);
            }}
        >
            <h1>{team.name}</h1>
            <ol>
                {team.players.map((player) => {
                    return (
                        <li
                            style={{
                                height: "24px",
                                cursor: onDragStart ? "grab" : "default"
                            }}
                            key={player.id}
                            draggable={!!onDragStart}
                            onDragStart={() => onDragStart?.(player, team.name)}
                        >
                            {player.firstName} {player.lastName} {player.score}
                            {gameSplit &&
                                <Tooltip title="Delete">
                                    <IconButton onClick={() => {
                                        setOpen(true);
                                        setSelectedPlayer(player);
                                    }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            }
                        </li>
                    )
                })}
            </ol>
            <div>Team Score:<b>{totalTeamScore}</b></div>

            {gameSplit &&
                <ConfirmDialog
                    title="Delete Player from Game?"
                    open={open}
                    setOpen={setOpen}
                    onConfirm={()=> onDeletePlayerEntry(gameSplit.id, selectedPlayer)}
                >
                    Are you sure you want to delete this player?
                </ConfirmDialog>
            }
        </div>
    )
}

export default TeamCard;
