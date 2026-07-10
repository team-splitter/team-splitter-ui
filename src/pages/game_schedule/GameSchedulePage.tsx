import { Button, IconButton, Tooltip } from "@mui/material";
import { GameSchedule } from "api/GameSchedule.types";
import { useEffect, useState } from "react";
import { deleteScheduleById, getAllSchedules } from "services/GameScheduleService";
import AddEditGameSchedule from "./AddEditGameSchedule";
import moment from "moment";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Link } from "react-router-dom";
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from "@mui/x-data-grid";
import ConfirmDialog from 'components/ConfirmDialog';
import PageLayout from "components/layout/PageLayout";
import PageHeader from "components/layout/PageHeader";
import SectionCard from "components/layout/SectionCard";
import DataTable from "components/layout/DataTable";

function formatDateTime(date: Date): string {
    let formattedDate = (moment(date)).format('YYYY-MM-DD dddd hh:mm A');
    return formattedDate;
}

export const GameSchedulePage = () => {
    const [schedules, setSchedules] = useState<GameSchedule[]>([]);
    const [schedule] = useState<GameSchedule>({} as GameSchedule);
    const [addEditFormVisible, setAddEditFormVisible] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<GameSchedule>({} as GameSchedule);

    const onDeleteGameSchedule = async (schedule: GameSchedule) => {
        await deleteScheduleById(schedule.id);
        setSchedules(schedules.filter(i => i.id !== schedule.id));
    }

    useEffect(() => {
        getAllSchedules()
            .then((data) => {
                const now = new Date();
                const future = data
                    .filter((i) => i.date >= now)
                    .sort((a, b) => {
                        if (a.date == b.date) return 0;
                        else if (a.date > b.date) return 1;
                        else return -1;
                    })
                setSchedules(future)
            })
    }, [])

    const columns: GridColDef[] = [
        {
            field: 'date',
            headerName: 'Date',
            width: 320,
            sortable: false,
            valueGetter: (params: GridValueGetterParams) => formatDateTime(params.row.date),
        },
        {
            field: 'location',
            headerName: 'Location',
            width: 180,
            sortable: false,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 140,
            sortable: false,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 160,
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams<any, GameSchedule>) => (
                <div>
                    {params.row.pollId &&
                        <Button size="small" component={Link} to={`/poll/${params.row.pollId}`}>Poll</Button>
                    }
                    <Tooltip title="Delete">
                        <IconButton onClick={() => { setOpen(true); setSelectedSchedule(params.row); }}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <PageLayout>
            <PageHeader
                title="Game Schedule"
                subtitle="Upcoming scheduled games"
                action={
                    !addEditFormVisible && (
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddEditFormVisible(true)}>
                            Schedule a Game
                        </Button>
                    )
                }
            />

            {addEditFormVisible &&
                <SectionCard sx={{ mb: 3 }}>
                    <AddEditGameSchedule mode='add' initialSchedule={schedule}
                        onCancel={() => setAddEditFormVisible(false)}
                        onCreate={(newSchedule: GameSchedule) => setSchedules([...schedules, newSchedule])}
                    />
                </SectionCard>
            }

            <DataTable
                rows={schedules}
                columns={columns}
                getRowId={(row) => row.id}
                pageSize={20}
                autoHeight
            />

            <ConfirmDialog
                title="Delete Game Schedule?"
                open={open}
                setOpen={setOpen}
                onConfirm={() => onDeleteGameSchedule(selectedSchedule)}
            >
                Are you sure you want to delete this game schedule?
            </ConfirmDialog>
        </PageLayout>
    )
}

export default GameSchedulePage;
