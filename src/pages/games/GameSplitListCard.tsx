import { GameSplit } from "../../api/Team.types";
import GameSplitCard from "./GameSplitCard";

type GameListProps = {
    gameSplits: GameSplit[]
}


export const GameSplitListCard = ({gameSplits}: GameListProps) => {
    return (
        <div>
            {gameSplits.map((gameSplit) => {
                return (
                    <GameSplitCard gameSplit={gameSplit} key={`${gameSplit.id}`}/>
                )
            })}
        </div>
    )
}

export default GameSplitListCard;