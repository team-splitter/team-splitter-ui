import { Game } from "../../api/Team.types";
import GameCard from "./GameCard";

type GameListProps = {
    games: Game[]
}


export const GameListCard = ({games}: GameListProps) => {
    return (
        <div>
            {games.map((game) => {
                return (
                    <GameCard game={game} key={`${game.id}`}/>
                )
            })}
        </div>
    )
}

export default GameListCard;