import React, { ReactElement, FC, useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Player } from "../../api/Player.types";
import moment from "moment";
import { DataGrid, GridColDef, GridRowId,GridCellEditCommitParams, GridRenderCellParams, GridValueGetterParams, renderActionsCell } from '@mui/x-data-grid';
import PlayerActions from "./PlayerActions";
import { getPlayers } from "../../services/PlayerService";
import Loading from "components/Loading";


function format(date: Date): string {
    let formattedDate = (moment(date)).format('YYYY-MM-DD HH:mm:ss');
    return formattedDate;
}
type Props = {
    showEditPage: (player: Player)=> void;
    showAddPlayerPage: (e: any) => void;
}
const PlayersTable: FC<any> = ({showEditPage, showAddPlayerPage}: Props): ReactElement => {
    const [players, setPlayers] = useState([] as Player[]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rowId, setRowId] = useState<GridRowId>({} as GridRowId);
    const [pageSize, setPageSize] = useState<number>(100);

    const onRemovePlayer = (playerId: number) => {
        setPlayers(players.filter((item) => item.id !== playerId));
    }

    useEffect(() => {
        getPlayers()
            .then((data) => {
                setPlayers(data);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setPlayers([]);
            })
            .finally(() => {
                setLoading(false)
            });
    }, []);

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 200,
            editable: false,
        },
        {
            field: 'firstName',
            headerName: 'First Name',
            width: 100,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last Name',
            width: 100,
            editable: true,
        },
        {
            field: 'score',
            headerName: 'Score',
            width: 100,
            editable: true,
            
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            align: 'left',
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <PlayerActions {...{params, rowId, setRowId, showEditPage, onRemovePlayer}} />
            ),
        }
    ];

    return (
        <div style={{padding:"10px"}}>
            <h1>Players</h1>
            <Button variant="outlined" style={{margin: "5px"}} onClick={showAddPlayerPage}>Add Player</Button>
            {loading && <Loading/>}
            {error && (
                <div>{`There is a problem fetching the poll data - ${error}`}</div>
            )}

            {players &&
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    
                    <DataGrid
                    autoHeight
                        rows={players}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={[10, 20, 50, 100]}
                        disableSelectionOnClick
                        showCellRightBorder
                        showColumnRightBorder
                        experimentalFeatures={{ newEditingApi: true }}
                        initialState={{
                            sorting: {
                                sortModel: [{field: 'score', sort: 'desc'}]
                            }
                        }}
                        getRowId={(row) => row.id}
                        onCellEditCommit={(params: GridCellEditCommitParams) => {
                            setRowId(params.id);
                            }
                        }
                    />
                </Box>
            }
        </div>
    )
}

export default PlayersTable;