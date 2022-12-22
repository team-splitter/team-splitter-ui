import { Box } from "@mui/material";
import { Game } from "../api/Team.types";
import TeamCardList from "./teams/TeamCardList";
import TeamSplitPage from "./teams/TeamSplitPage";

type GameCardProps = {
    game: Game
}

export const GameCard = ({game}: GameCardProps) => {
    return (
        <div>
            <h1>Game id {game.id}</h1>
            <Box sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <TeamCardList teams={game.teams} />
                </Box>
        </div>

    )
}


export default GameCard;