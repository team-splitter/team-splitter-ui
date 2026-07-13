import { useState } from "react";
import { Alert, Box, IconButton, Snackbar, Stack, Tooltip, Typography } from "@mui/material";
import { GameSplit } from "../../api/Team.types";
import TeamCardList from "../teams/TeamCardList";
import moment from "moment";
import DeleteIcon from '@mui/icons-material/Delete';
import TelegramIcon from '@mui/icons-material/Telegram';
import { resendGameSplitTelegram } from "services/GameSplitService";

function formatDateTime(date: Date): string {
    let formattedDate = (moment(date)).format('YYYY-MM-DD dddd hh:mm A');
    return formattedDate;
}
type GameCardProps = {
    gameSplit: GameSplit
    onDelete?: (id: string) => void
}

export const GameSplitCard = ({gameSplit, onDelete}: GameCardProps) => {
    const [resending, setResending] = useState(false);
    const [toast, setToast] = useState<{ severity: 'success' | 'error', message: string } | null>(null);

    const onResendTelegram = async () => {
        setResending(true);
        try {
            await resendGameSplitTelegram(gameSplit.id);
            setToast({ severity: 'success', message: 'Telegram message sent' });
        } catch (err: any) {
            setToast({ severity: 'error', message: `Could not send Telegram message - ${err.message}` });
        } finally {
            setResending(false);
        }
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                        {formatDateTime(gameSplit.createdAt)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Game {gameSplit.id}
                    </Typography>
                </Box>
                <Stack direction="row" alignItems="center">
                    <Tooltip title={gameSplit.telegramMessageId ? "Re-send Telegram message" : "Send Telegram message"}>
                        <IconButton color="primary" onClick={onResendTelegram} disabled={resending}>
                            <TelegramIcon />
                        </IconButton>
                    </Tooltip>
                    {onDelete && (
                        <Tooltip title="Delete">
                            <IconButton color="error" onClick={() => onDelete(gameSplit.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>
            </Stack>
            <TeamCardList teams={gameSplit.teams} gameSplit={gameSplit}/>

            <Snackbar
                open={!!toast}
                autoHideDuration={4000}
                onClose={() => setToast(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                {toast ? (
                    <Alert severity={toast.severity} onClose={() => setToast(null)} variant="filled">
                        {toast.message}
                    </Alert>
                ) : undefined}
            </Snackbar>
        </Box>

    )
}


export default GameSplitCard;
