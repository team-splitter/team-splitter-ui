import { useAuth0,  } from "@auth0/auth0-react";
import LoginButton from "components/LoginButton";
import PollsPage from "./poll/PollsPage";
import PlayerStatPage from "./player_stats/PlayerStatsPage";


export const HomePage = () => {
    const {
        isAuthenticated
      } = useAuth0();

    return (
        <div>
            {
                isAuthenticated ? <PollsPage/> : <PlayerStatPage/>
            }
            
        </div>
    )
}

export default HomePage;