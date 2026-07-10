import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { GameSchedule } from "api/GameSchedule.types"
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from "moment";
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

export const AddEditGameSchedule = ({ mode, onCancel, onCreate }: Props) => {
    const { control, handleSubmit } = useForm();

    const onFormSumbit = async (data: any) => {
        const postData = {
            "date": data.date.valueOf(),
            "location": data.location
        }
        const newSchedule = await createSchedule(postData as GameSchedule)
        onCreate(newSchedule);
        onCancel();
    }

    return (
        <Box component="form" onSubmit={handleSubmit(onFormSumbit)} sx={{ maxWidth: 420 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                {mode === 'add' ? 'Schedule a Game' : 'Update Game'}
            </Typography>
            <Stack spacing={2}>
                <Controller
                    defaultValue="Patch Reef"
                    control={control}
                    name='location'
                    render={({ field: { onChange, value } }) => (
                        <FormControl fullWidth size="small">
                            <InputLabel id="location-label">Location</InputLabel>
                            <Select labelId="location-label" label="Location" value={value} onChange={onChange}>
                                {locationOptions.map((locationOption) => (
                                    <MenuItem key={locationOption} value={locationOption}>{locationOption}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                />
                <Controller
                    defaultValue={moment()}
                    control={control}
                    name='date'
                    render={({ field: { onChange, value } }) => (
                        <DateTimePicker
                            label="Date"
                            value={value}
                            onChange={onChange}
                            minDate={new Date()}
                            renderInput={(props) => <TextField fullWidth {...props} />}
                        />
                    )}
                />
                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                    <Button onClick={onCancel} color="inherit">Cancel</Button>
                    <Button type='submit' variant="contained">{mode === 'add' ? 'Schedule' : 'Update'}</Button>
                </Stack>
            </Stack>
        </Box>
    )
}

export default AddEditGameSchedule;
