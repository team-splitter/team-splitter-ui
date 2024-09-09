import { Button } from "@mui/material";
import { useState } from "react";
import { Player } from "../../api/Player.types";
import { createPlayer, updatePlayer } from "../../services/PlayerService";
import "./AddPlayer.style.css"

type AddPlayerProps = {
    player: Player | null
    mode: 'add' | 'edit'
    cancelButtonHandler: (e: any) => void
}

export const AddPlayer = ({ cancelButtonHandler, player, mode }: AddPlayerProps) => {
    const [id, setId] = useState<string>(`${player?.id}`);
    const [firstName, setFirstName] = useState(`${player?.firstName}`);
    const [lastName, setLastName] = useState(`${player?.lastName}`);
    const [score, setScore] = useState(`${player?.score}`);

    const onSubmitButtonHandler = async (e: any) => {
        e.preventDefault();
        const playerId = Number(id);
        const data: Player = {
            id: playerId,
            firstName: firstName,
            lastName: lastName,
            score: Number(score)
        }
        if (mode === 'add') {
            await createPlayer(data);
        } else {
            await updatePlayer(id, data);
        }

        cancelButtonHandler(e);
    }

    
    return (
        <div className="form-container">
            <h3>Add Player Form</h3>
            <form onSubmit={onSubmitButtonHandler}>
                <table className="center">
                    <tbody>
                        <tr>
                            <td>
                                <label>ID</label>
                            </td>
                            <td>
                                <input disabled={true} type="text" value={id} onChange={(e) => setId(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>First Name</label>
                            </td>
                            <td>
                                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Last Name</label>
                            </td>
                            <td>
                                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />

                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Score</label>
                            </td>
                            <td>
                                <input type="text" value={score} onChange={(e) => setScore(e.target.value)} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="center">
                    <Button onClick={cancelButtonHandler} >Cancel</Button>
                    <Button type='submit'>{mode === 'add' ? 'Add' : 'Update'}</Button>
                </div>

            </form>
        </div>

    )
}

export default AddPlayer;