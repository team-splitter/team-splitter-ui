import React, { ReactElement, FC, useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Poll } from "api/Poll.types";
import moment from "moment";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Link, useParams } from "react-router-dom";
import { getPolls } from "services/PollService";


function format(date: Date): string {
    let formattedDate = (moment(date)).format('YYYY-MM-DD HH:mm:ss');
    return formattedDate;
}

const PollsPage  = () => {
    const [data, setData] = useState<Poll[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        getPolls()
            .then((actualData) => {
                setData(actualData);
                setError(null);
            })
            .catch((err) => {
                setError(err.message);
                setData(null);
            })
            .finally(() => {
                setLoading(false)
            });
    }, []);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 200 },
        {
            field: 'question',
            headerName: 'Question',
            width: 600,
            editable: true,
        },
        {
            field: 'creationTime',
            headerName: 'Creation Time',
            width: 200,
            editable: false,
            valueGetter: (params: GridValueGetterParams) =>
                `${format(params.row.creationTime)}`,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            renderCell: (params) => (
                <Link to={`/poll/${params.row.id}`}>View</Link>
            ),
        }
    ];

    return (
        <div>
            <h1>Polls</h1>
            {loading && <div> A moment please...</div>}
            {error && (
                <div>{`There is a problem fetching the poll data - ${error}`}</div>
            )}

            {data &&
                <Box sx={{ height: 400, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                        showCellRightBorder
                        showColumnRightBorder
                        experimentalFeatures={{ newEditingApi: true }}
                        initialState={{
                            sorting: {
                                sortModel: [{field: 'creationTime', sort: 'desc'}]
                            }
                        }}
                    />
                </Box>
            }
        </div>
    )
}

export default PollsPage;