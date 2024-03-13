import { Box } from "@mui/material";
import { GameSplit } from "../../api/Team.types";
import TeamCardList from "../teams/TeamCardList";
import TeamSplitPage from "../teams/TeamSplitPage";
import moment from "moment";

function formatDateTime(date: Date): string {
    let formattedDate = (moment(date)).format('YYYY-MM-DD dddd hh:mm A');
    return formattedDate;
}
type GameCardProps = {
    gameSplit: GameSplit
}

export const GameSplitCard = ({gameSplit}: GameCardProps) => {
    return (
        <div>
            <h1>Game ({gameSplit.id}) {formatDateTime(gameSplit.creationTime)}</h1>
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