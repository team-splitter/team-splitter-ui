import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "components/LoginButton";
import PollsPage from "./poll/PollsPage";


export const HomePage = () => {

    const {
        user,
        isAuthenticated,
        loginWithRedirect,
        logout,
      } = useAuth0();
      
    return (
        <div>
            {isAuthenticated && (
                <PollsPage/>
            )}

            {!isAuthenticated && (
                <h1>Your are not logged in</h1>
            )}
        </div>
    )
}

export default HomePage;