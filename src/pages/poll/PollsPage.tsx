import React, { ReactElement, FC, useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Poll } from "api/Poll.types";
import { Page } from "api/Pagination.types";
import moment from "moment";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Link, useParams } from "react-router-dom";
import { getPolls } from "services/PollService";
import Loading from "components/Loading";


function format(date: Date): string {
    let formattedDate = (moment(date)).format('YYYY-MM-DD HH:mm:ss');
    return formattedDate;
}

const PollsPage  = () => {
    const [data, setData] = useState<Page<Poll> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(20);



    useEffect(() => {
        getPolls(page, pageSize)
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
    }, [page, pageSize]);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 200 },
        {
            field: 'question',
            headerName: 'Question',
            width: 600,
            editable: true,
            sortable: false,
            filterable: false,
        },
        {
            field: 'creationTime',
            headerName: 'Creation Time',
            width: 200,
            editable: false,
            sortable: false,
            filterable: false,
            valueGetter: (params: GridValueGetterParams) => {
                return `${format(params.row.creationTime)}`
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Link to={`/poll/${params.row.id}`}>View</Link>
            ),
        }
    ];

    return (
        <div>
            <h1>Polls</h1>
            {loading && <Loading/>}
            {error && (
                <div>{`There is a problem fetching the poll data - ${error}`}</div>
            )}

            {data &&
                <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <DataGrid
                        autoHeight
                        rows={data.content}
                        columns={columns}
                        paginationMode="server"
                        pageSize={pageSize}
                        onPageSizeChange={setPageSize}
                        page={page}
                        onPageChange={setPage}
                        rowCount={data.totalElements}
                        rowsPerPageOptions={[10, 20, 50, 100]}
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