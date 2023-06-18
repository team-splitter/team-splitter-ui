import React, { ReactElement, FC, useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material"
import PlayersTable from "./PlayersTable";
import AddPlayer from "./AddPlayer";
import { Player } from "../../api/Player.types";


const PlayersPage: FC<any> = (): ReactElement => {
    const defaultPlayer = {
        'id': 0,
        'firstName': "",
        'lastName': "",
        'username': "",
        'score': 50,
        'gameScore': 50
    } as Player;
    const [shownPage, setShownPage] =  useState('table');
    const [player, setPlayer] = useState<Player>(defaultPlayer);
    
    const addPlayerHandler = (e: any) => {
        setPlayer(defaultPlayer);
        setShownPage('add');
    }

    const cancelClickHandler = (e: any) => {
        setShownPage('table')
    }

    const editPlayerHandler = (player: Player) => {
        setPlayer(player);
        setShownPage('edit')
    }

    return (
        <div className="players-content">
            {shownPage === 'table' && (
                <>
                    <PlayersTable showEditPage={editPlayerHandler} showAddPlayerPage={addPlayerHandler}/>
                </>
            )}

            {(shownPage === 'add' || shownPage === 'edit') && (
                <AddPlayer mode={shownPage} cancelButtonHandler={cancelClickHandler} player={player}/>
            )}
            
        </div>
    )
}

export default PlayersPage;