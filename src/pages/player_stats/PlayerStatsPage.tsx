import { PlayerStat } from "api/PlayerStat.types";
import { FC, ReactElement, useEffect, useState } from "react";
import { getPlayerStats } from "services/PlayerStatsService";
import { DataGrid, GridColDef, GridRowId,GridCellEditCommitParams, GridRenderCellParams, GridValueGetterParams, renderActionsCell } from '@mui/x-data-grid';
import { Box } from "@mui/material";

const PlayerStatPage: FC<any> = (): ReactElement => {
    const [playerStats, setPlayerStats] = useState([] as PlayerStat[]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rowId, setRowId] = useState<GridRowId>({} as GridRowId);
    const [pageSize, setPageSize] = useState<number>(100);

    useEffect(() => {
        getPlayerStats()
            .then((data) => {
                setPlayerStats(data);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setPlayerStats([]);
            })
            .finally(() => {
                setLoading(false)
            });
    }, []);

    const columns: GridColDef[] = [
        {
            field: 'playerId',
            headerName: 'Player ID',
            width: 120,
            editable: false,
        },
        {
            field: 'firstName',
            headerName: 'First Name',
            width: 100,
            editable: false,
        },
        {
            field: 'lastName',
            headerName: 'Last Name',
            width: 100,
            editable: false,
        },
        {
            field: 'totalWin',
            headerName: 'Win',
            width: 100,
            editable: false,
            
        },
        {
            field: 'totalLoss',
            headerName: 'Loss',
            width: 100,
            editable: false,
            
        },
        {
            field: 'totalDraw',
            headerName: 'Draw',
            width: 100,
            editable: false,
            
        },
        {
            field: 'totalGames',
            headerName: 'Games',
            width: 100,
            editable: false,
            
        },
        {
            field: 'diff',
            headerName: 'Diff',
            width: 100,
            editable: false,
            valueGetter: (params) => params.row.totalWin - params.row.totalLoss
        },
    ];

    return (
        <div style={{padding:"10px"}}>
            <h1>Player Stats</h1>
            {loading && <div> A moment please...</div>}
            {error && (
                <div>{`There is a problem fetching the player stats - ${error}`}</div>
            )}

            {playerStats &&
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    
                    <DataGrid
                    autoHeight
                        rows={playerStats}
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
                                sortModel: [{field: 'totalGames', sort: 'desc'}]
                            }
                        }}
                        getRowId={(row) => row.playerId}
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

export default PlayerStatPage;