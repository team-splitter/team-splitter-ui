import { GameSplit } from "../../api/Team.types";
import GameSplitCard from "./GameSplitCard";

type GameListProps = {
    gameSplits: GameSplit[]
    onDelete?: (id: string) => void
}


export const GameSplitListCard = ({gameSplits, onDelete}: GameListProps) => {
    return (
        <div>
            {gameSplits.map((gameSplit) => {
                return (
                    <GameSplitCard gameSplit={gameSplit} key={gameSplit.id} onDelete={onDelete}/>
                )
            })}
        </div>
    )
}

export default GameSplitListCard;