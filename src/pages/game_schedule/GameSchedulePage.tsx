import { Button, IconButton, Tooltip } from "@mui/material";
import { GameSchedule } from "api/GameSchedule.types";
import { useEffect } from "react";
import { useState } from "react";
import { deleteScheduleById, getAllSchedules } from "services/GameScheduleService";
import AddEditGameSchedule from "./AddEditGameSchedule";
import moment from "moment";
import DeleteIcon from '@mui/icons-material/Delete';
import Collapse from '@mui/material/Collapse';
import { Link } from "react-router-dom";
import ConfirmDialog from 'components/ConfirmDialog';

function formatDateTime(date: Date): string {
    let formattedDate = (moment(date)).format('YYYY-MM-DD dddd hh:mm A');
    return formattedDate;
}

export const GameSchedulePage = () => {
    const [schedules, setSchedules] = useState<GameSchedule[]>([]);
    const [pastSchedules, setPastSchedules] = useState<GameSchedule[]>([]);
    const [schedule, setSchedule] = useState<GameSchedule>({} as GameSchedule);
    const [shownPage, setShownPage] = useState('table');
    const [addEditFormVisible, setAddEditFormVisible] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<GameSchedule>({} as GameSchedule);

    const onDeleteGameSchedule = async (schedule: GameSchedule) => {
        await deleteScheduleById(schedule.id);
        setSchedules(schedules.filter(i => i.id !== schedule.id));
        setPastSchedules(pastSchedules.filter(i => i.id !== schedule.id));

    }

    useEffect(() => {
        getAllSchedules()
            .then((data) => {
                data = data.sort((a, b) => {
                    if (a == b) return 0;
                    else if(a > b) return 1;
                    else return -1;
                })
                const now  = new Date();
                const past = data.filter((i) => i.date < now)
                const future =  data.filter((i) => i.date >= now)
                setSchedules(future)
                setPastSchedules(past)
            })
    }, [])

    return (
        <div>
            <h3>Game Schedule</h3>
            {!addEditFormVisible &&
                <Button variant="outlined" style={{ margin: "5px" }} onClick={() => { setShownPage('add'); setAddEditFormVisible(true); }}>Schedule a Game</Button>
            }

            {addEditFormVisible &&
                <AddEditGameSchedule mode='add' initialSchedule={schedule}
                    onCancel={() => setAddEditFormVisible(false)}
                    onCreate={(newSchedule: GameSchedule) => setSchedules([...schedules, newSchedule])}
                />
            }
            <h1>Future Schedules</h1>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>

                </thead>
                <tbody>
                    {schedules.map((schedule) => {
                        return (
                            <tr key={schedule.id}>
                                <td>{formatDateTime(schedule.date)}</td>
                                <td>{schedule.location}</td>
                                <td>{schedule.status}</td>
                                <td>
                                    {schedule.pollId &&
                                        <Link to={`/poll/${schedule.pollId}`}>Poll</Link>
                                    }
                                    <Tooltip title="Delete">
                                        <IconButton onClick={async (e) => {
                                            setOpen(true); 
                                            setSelectedSchedule(schedule);
                                         }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </td>
                            </tr>
                        )
                    })
                    }
                </tbody>
            </table>
            <h1>Past Schedules</h1>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>

                </thead>
                <tbody>
                    {pastSchedules.map((schedule) => {
                        return (
                            <tr key={schedule.id}>
                                <td>{formatDateTime(schedule.date)}</td>
                                <td>{schedule.location}</td>
                                <td>{schedule.status}</td>
                                <td>
                                    {schedule.pollId &&
                                        <Link to={`/poll/${schedule.pollId}`}>Poll</Link>
                                    }
                                    <Tooltip title="Delete">
                                        <IconButton onClick={async (e) => {
                                            setOpen(true); 
                                            setSelectedSchedule(schedule);
                                         }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </td>
                            </tr>
                        )
                    })
                    }
                </tbody>
            </table>

            <ConfirmDialog
                        title="Delete Game Schedule?"
                        open={open}
                        setOpen={setOpen}
                        onConfirm={()=> onDeleteGameSchedule(selectedSchedule)}
                    >
                        Are you sure you want to delete this game schedule?
                    </ConfirmDialog>

        </div>
    )
}

export default GameSchedulePage;