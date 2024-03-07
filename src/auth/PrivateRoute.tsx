import { Outlet, Navigate} from "react-router-dom";
import React, { ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";

type Props = {
    children:  React.ReactElement | null
  }
  
const PrivateRoute = ({children}: Props):  React.ReactElement | null => {
    const {
        user,
        isAuthenticated,
        loginWithRedirect,
        logout,
      } = useAuth0();

    if (isAuthenticated) {
        return children;
    } else {
        return (
            <div>
                <h1>Your are not logged in</h1>
            </div>
        )   
    }
};

export default PrivateRoute;