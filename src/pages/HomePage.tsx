import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "components/LoginButton";
import PollsPage from "./poll/PollsPage";


export const HomePage = () => {
    return (
        <div>
            <PollsPage/>
        </div>
    )
}

export default HomePage;