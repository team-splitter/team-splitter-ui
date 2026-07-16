import { useState } from "react";
import { Team, GameSplit } from "../../api/Team.types";
import { Box, Card, Chip, Dialog, IconButton, Link as MuiLink, Stack, Tooltip, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Player } from "api/Player.types";
import ConfirmDialog from 'components/ConfirmDialog';
import { deleteGameSplitPlayerEntry } from "services/GameSplitService";
import AddPlayer from "pages/players/AddPlayer";
import { TEAM_COLOR_HEX } from "./teamColors";

type TeamCardProps = {
    team: Team
    gameSplit?: GameSplit
    onDragStart?: (player: Player, fromTeamName: string) => void
    onDrop?: (toTeamName: string) => void
    onTouchMove?: (x: number, y: number) => void
    onTouchDrop?: (x: number, y: number) => void
    isTouchDragTarget?: boolean
    draggingPlayer?: Player | null
    onPlayerUpdated?: () => void
}

const TeamCard = ({team, gameSplit, onDragStart, onDrop, onTouchMove, onTouchDrop, isTouchDragTarget, draggingPlayer, onPlayerUpdated}: TeamCardProps) => {
    const [open, setOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player>({} as Player);
    const [isMouseDragOver, setIsMouseDragOver] = useState(false);
    const [editPlayer, setEditPlayer] = useState<Player | null>(null);

    const onDeletePlayerEntry = async (gameId: string, player: Player) => {
        await deleteGameSplitPlayerEntry(gameId, player.id);
    };

    const totalTeamScore = team.players.map(p => p.score).reduce((acc, score) => acc + score, 0);
    const sortedPlayers = [...team.players].sort((a, b) => b.score - a.score);

    const canDrag = !!onDragStart;
    const isDragTarget = isMouseDragOver || isTouchDragTarget;

    return (
        <Card
            data-team-name={team.name}
            sx={{
                width: 320,
                p: 2,
                outline: isDragTarget ? "2px dashed" : "none",
                outlineColor: "primary.main",
                backgroundColor: isDragTarget ? "rgba(11, 116, 209, 0.06)" : "background.paper",
                transition: "background-color 0.15s, outline 0.15s",
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
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    {TEAM_COLOR_HEX[team.name] &&
                        <Box sx={{
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            flexShrink: 0,
                            backgroundColor: TEAM_COLOR_HEX[team.name],
                            border: "1px solid",
                            borderColor: "divider",
                        }} />
                    }
                    <Typography variant="h6">{team.name}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Chip size="small" color="primary" variant="outlined" label={`Players ${team.players.length}`} />
                    <Chip size="small" color="primary" variant="outlined" label={`Score ${totalTeamScore}`} />
                </Stack>
            </Stack>

            <Stack component="ol" sx={{ listStyle: "none", m: 0, p: 0 }} spacing={0}>
                {sortedPlayers.map((player, index) => {
                    const isBeingDragged = draggingPlayer?.id === player.id;
                    return (
                        <Box
                            component="li"
                            key={player.id}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                py: 0.5,
                                borderBottom: "1px solid",
                                borderColor: "divider",
                                cursor: canDrag ? "grab" : "default",
                                userSelect: "none",
                                touchAction: canDrag ? "none" : "auto",
                                opacity: isBeingDragged ? 0.35 : 1,
                                fontStyle: isBeingDragged ? "italic" : "normal",
                                transition: "opacity 0.15s",
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
                            <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                                <Typography component="span" color="text.secondary" sx={{ minWidth: 24, flexShrink: 0 }}>
                                    {index + 1}.
                                </Typography>
                                <MuiLink
                                    component="button"
                                    underline="hover"
                                    color="text.primary"
                                    sx={{ textAlign: "left", userSelect: "text" }}
                                    onClick={() => setEditPlayer(player)}
                                >
                                    {player.firstName} {player.lastName}
                                    <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                                        {player.score}
                                    </Typography>
                                </MuiLink>
                            </Box>
                            {gameSplit &&
                                <Tooltip title="Delete">
                                    <IconButton size="small" color="error" onClick={() => {
                                        setOpen(true);
                                        setSelectedPlayer(player);
                                    }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            }
                        </Box>
                    );
                })}
            </Stack>

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
            <Dialog open={!!editPlayer} onClose={() => setEditPlayer(null)}>
                {editPlayer && (
                    <AddPlayer
                        mode="edit"
                        player={editPlayer}
                        cancelButtonHandler={() => {
                            setEditPlayer(null);
                            onPlayerUpdated?.();
                        }}
                    />
                )}
            </Dialog>
        </Card>
    );
}

export default TeamCard;
