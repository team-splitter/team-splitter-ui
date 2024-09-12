import { PlayerStat } from "api/PlayerStat.types";
import { FC, ReactElement, useEffect, useState } from "react";
import { getPlayerStats } from "services/PlayerStatsService";
import { DataGrid, GridColDef, GridRowId,GridCellEditCommitParams, GridRenderCellParams, GridValueGetterParams, renderActionsCell } from '@mui/x-data-grid';
import { Box, Button, Grid, TextField } from "@mui/material";
import { Controller, useForm } from 'react-hook-form';
import moment from "moment";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


function formatDate(date?: Date): string {
    date = date || new Date();
    // let formattedDate = (moment(date)).format('YYYY-MM-DD');
    let formattedDate = (moment(date)).unix();
    return `${formattedDate * 1000}`;
}

const PlayerStatPage: FC<any> = (): ReactElement => {
    const now = new Date();
    const defaultStartDate = new Date();
    defaultStartDate.setMonth(now.getMonth() - 1)
    const minDate = new Date();
    minDate.setFullYear(now.getFullYear() - 2)


    const [playerStats, setPlayerStats] = useState([] as PlayerStat[]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rowId, setRowId] = useState<GridRowId>({} as GridRowId);
    const [pageSize, setPageSize] = useState<number>(100);

    const { control, register, handleSubmit } = useForm();

    const [startDate, setStartDate] = useState<Date>(defaultStartDate);
    const [endDate, setEndDate] = useState<Date>(now);


    const onFormSumbit = async (data: any) => {
        console.log(data);
    
    }

    useEffect(() => {
        getPlayerStats(formatDate(startDate), formatDate(endDate))
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
    }, [startDate, endDate]);

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
            field: 'totalDays',
            headerName: 'Days',
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
                    <Grid container direction={'column'} spacing={1}>
                        <Grid container spacing={2} padding={3}>
                            <Grid item>
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <DatePicker
                                            label="Start Date"
                                            value={startDate}
                                            onChange={(date: Date | null) => {
                                                setStartDate(date || new Date());
                                            }}
                                            maxDate={endDate}
                                            renderInput={(props) =>
                                                <TextField
                                                    size="small" {...props} />}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <DatePicker
                                            label="End Date"
                                            value={endDate}
                                            onChange={(date: Date | null) => {
                                                setEndDate(date || new Date());
                                            }}
                                            minDate={startDate}
                                            maxDate={now}
                                            renderInput={(props) =>
                                                <TextField
                                                    size="small" {...props} />}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    
                        <Grid item>
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
                        </Grid>
                    </Grid>
                </Box>
            }
        </div>
    )
}

export default PlayerStatPage;