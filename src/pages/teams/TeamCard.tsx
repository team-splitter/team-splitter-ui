import { useState } from "react";
import { Team, GameSplit } from "../../api/Team.types";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Player } from "api/Player.types";
import ConfirmDialog from 'components/ConfirmDialog';
import { deleteGameSplitPlayerEntry } from "services/GameSplitService";

type TeamCardProps = {
    team: Team
    gameSplit?: GameSplit
    onDragStart?: (player: Player, fromTeamName: string) => void
    onDrop?: (toTeamName: string) => void
    onTouchMove?: (x: number, y: number) => void
    onTouchDrop?: (x: number, y: number) => void
    isTouchDragTarget?: boolean
    draggingPlayer?: Player | null
}

const TeamCard = ({team, gameSplit, onDragStart, onDrop, onTouchMove, onTouchDrop, isTouchDragTarget, draggingPlayer}: TeamCardProps) => {
    const [open, setOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player>({} as Player);
    const [isMouseDragOver, setIsMouseDragOver] = useState(false);

    const onDeletePlayerEntry = async (gameId: string, player: Player) => {
        await deleteGameSplitPlayerEntry(gameId, player.id);
    };

    const totalTeamScore = team.players.map(p => p.score).reduce((acc, score) => acc + score, 0);

    const canDrag = !!onDragStart;
    const isDragTarget = isMouseDragOver || isTouchDragTarget;

    return (
        <div
            data-team-name={team.name}
            style={{
                width: "400px",
                display: "block",
                float: "left",
                outline: isDragTarget ? "2px dashed #1976d2" : "none",
                borderRadius: "4px",
                backgroundColor: isDragTarget ? "rgba(25, 118, 210, 0.08)" : "transparent",
                transition: "background-color 0.15s, outline 0.15s"
            }}
            onDragOver={(e) => {
                if (onDrop) {
                    e.preventDefault();
                    setIsMouseDragOver(true);
                }
            }}
            onDragLeave={() => setIsMouseDragOver(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsMouseDragOver(false);
                onDrop?.(team.name);
            }}
        >
            <h1>{team.name}</h1>
            <ol>
                {team.players.map((player) => {
                    const isBeingDragged = draggingPlayer?.id === player.id;
                    return (
                        <li
                            key={player.id}
                            style={{
                                height: "24px",
                                cursor: canDrag ? "grab" : "default",
                                userSelect: "none",
                                touchAction: canDrag ? "none" : "auto",
                                opacity: isBeingDragged ? 0.35 : 1,
                                fontStyle: isBeingDragged ? "italic" : "normal",
                                transition: "opacity 0.15s"
                            }}
                            draggable={canDrag}
                            onDragStart={() => onDragStart?.(player, team.name)}
                            onTouchStart={() => onDragStart?.(player, team.name)}
                            onTouchMove={(e) => {
                                const touch = e.touches[0];
                                onTouchMove?.(touch.clientX, touch.clientY);
                            }}
                            onTouchEnd={(e) => {
                                const touch = e.changedTouches[0];
                                onTouchDrop?.(touch.clientX, touch.clientY);
                            }}
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
                    );
                })}
            </ol>
            <div>Team Score:<b>{totalTeamScore}</b></div>

            {gameSplit &&
                <ConfirmDialog
                    title="Delete Player from Game?"
                    open={open}
                    setOpen={setOpen}
                    onConfirm={() => onDeletePlayerEntry(gameSplit.id, selectedPlayer)}
                >
                    Are you sure you want to delete this player?
                </ConfirmDialog>
            }
        </div>
    );
}

export default TeamCard;
