import React, { ReactElement, FC, useState } from "react";
import { Card } from "@mui/material"
import PlayersTable from "./PlayersTable";
import AddPlayer from "./AddPlayer";
import { Player } from "../../api/Player.types";
import PageLayout from "components/layout/PageLayout";


const PlayersPage: FC<any> = (): ReactElement => {
    const defaultPlayer = {
        'id': Math.floor(Math.random() * 1000000000),
        'firstName': "",
        'lastName': "",
        'score': 50
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
                <PageLayout maxWidth="sm">
                    <Card sx={{ display: 'inline-block' }}>
                        <AddPlayer mode={shownPage} cancelButtonHandler={cancelClickHandler} player={player}/>
                    </Card>
                </PageLayout>
            )}

        </div>
    )
}

export default PlayersPage;