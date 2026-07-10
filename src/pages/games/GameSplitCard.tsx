import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { GameSplit } from "../../api/Team.types";
import TeamCardList from "../teams/TeamCardList";
import moment from "moment";
import DeleteIcon from '@mui/icons-material/Delete';

function formatDateTime(date: Date): string {
    let formattedDate = (moment(date)).format('YYYY-MM-DD dddd hh:mm A');
    return formattedDate;
}
type GameCardProps = {
    gameSplit: GameSplit
    onDelete?: (id: string) => void
}

export const GameSplitCard = ({gameSplit, onDelete}: GameCardProps) => {
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
                {onDelete && (
                    <Tooltip title="Delete">
                        <IconButton onClick={() => onDelete(gameSplit.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Stack>
            <TeamCardList teams={gameSplit.teams} gameSplit={gameSplit}/>
        </Box>

    )
}


export default GameSplitCard;