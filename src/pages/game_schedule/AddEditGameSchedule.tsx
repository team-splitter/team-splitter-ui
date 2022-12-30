import { useState } from "react"
import { Box, Button, Container, FormControl, Grid, MenuItem, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import { GameSchedule } from "api/GameSchedule.types"
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import "./AddEditGameSchedule.style.css"
import moment, { Moment } from "moment";
import { Controller, useForm } from 'react-hook-form';
import { createSchedule } from "services/GameScheduleService";

type Props = {
    initialSchedule: GameSchedule | null
    mode: 'add' | 'edit'
    onCancel: () => void
    onCreate: (newSchedule: GameSchedule) => void
}

const locationOptions = [
    "Patch Reef",
    "Sand Pine",
    "Hillsboro El Rio",
]


export const AddEditGameSchedule = ({ mode, initialSchedule, onCancel,onCreate }: Props) => {
    const { control, register, handleSubmit } = useForm();

    const onFormSumbit = async (data: any) => {
        console.log(data);

        const postData = {
            "date": data.date.valueOf(),
            "location": data.location
        }
        const newSchedule = await createSchedule(postData as GameSchedule)
        onCreate(newSchedule);
        onCancel();
    }
    return (
        <Container maxWidth="md">
            <Box
                sx={{

                }}
            >
                <h3>Schedule New Game Form</h3>
                <form onSubmit={handleSubmit(onFormSumbit)}>
                    <Grid container direction={'column'} spacing={1}>
                        <Grid item >
                            <Controller
                                defaultValue="Patch Reef"
                                control={control}
                                name='location'
                                render={({
                                    field: { onChange, name, value },
                                }) => (
                                    <Select value={value} onChange={onChange}>
                                        {locationOptions.map((locationOption) => {
                                            return (
                                                <MenuItem key={locationOption} value={locationOption}>{locationOption}</MenuItem>
                                            )
                                        })}
                                    </Select>

                                )}
                            />
                        </Grid>
                        <Grid item>
                            <Controller
                                defaultValue={moment()}
                                control={control}
                                name='date'
                                render={({
                                    field: { onChange, name, value },
                                }) => (
                                    <DateTimePicker
                                        label="Date"
                                        value={value}
                                        onChange={onChange}
                                        minDate={new Date()}
                                        renderInput={(props) =>
                                            <TextField
                                                size="small" {...props} />}
                                    />

                                )}
                            />
                        </Grid>
                        <Grid item>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Button onClick={onCancel} variant="outlined">Cancel</Button>
                                </Grid>
                                <Grid item>
                                    <Button type='submit' variant="outlined">{mode === 'add' ? 'Schedule' : 'Update'}</Button>
                                </Grid>

                            </Grid>
                        </Grid>

                    </Grid>

                </form>
            </Box>

        </Container>
    )

}

export default AddEditGameSchedule;