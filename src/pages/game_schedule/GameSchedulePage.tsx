import { Button, IconButton, Tooltip } from "@mui/material";
import { GameSchedule } from "api/GameSchedule.types";
import { useEffect } from "react";
import { useState } from "react";
import { deleteScheduleById, getAllSchedules } from "services/GameScheduleService";
import AddEditGameSchedule from "./AddEditGameSchedule";
import moment from "moment";
import DeleteIcon from '@mui/icons-material/Delete';

function formatDateTime(date: Date): string {
    let formattedDate = (moment(date)).format('YYYY-MM-DD dddd HH:mm');
    return formattedDate;
}

export const GameSchedulePage = () => {
    const [schedules, setSchedules] = useState<GameSchedule[]>([]);
    const [schedule, setSchedule] = useState<GameSchedule>({} as GameSchedule);
    const [shownPage, setShownPage] = useState('table');
    const [addEditFormVisible, setAddEditFormVisible] = useState(false);

    useEffect(() => {
        getAllSchedules()
            .then((data) => setSchedules(data))
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
                                    <Tooltip title="Delete">
                                        <IconButton onClick={async (e) => {
                                            await deleteScheduleById(schedule.id);
                                            setSchedules(schedules.filter(i => i.id !== schedule.id));
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

        </div>
    )
}

export default GameSchedulePage;