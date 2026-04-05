import { Box, IconButton, Tooltip } from "@mui/material";
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
        <div>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <h1>Game ({gameSplit.id}) {formatDateTime(gameSplit.createdAt)}</h1>
                {onDelete && (
                    <Tooltip title="Delete">
                        <IconButton onClick={() => onDelete(gameSplit.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
            <Box sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <TeamCardList teams={gameSplit.teams} gameSplit={gameSplit}/>
                </Box>
        </div>

    )
}


export default GameSplitCard;