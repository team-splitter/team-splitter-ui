import React from 'react';
import { CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from "@mui/material/styles";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { routes as appRoutes } from './routes';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from 'components/Loading';
import theme from './theme';

// styles
import "./App.css";
import PrivateRoute from 'auth/PrivateRoute';

function App() {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading/>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box
            sx={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "background.default",
            }}
          >
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                {appRoutes.map((route) => (
                  route.authRequired ?
                  <Route
                    key={route.key}
                    path={route.path}
                    element={<PrivateRoute><route.component /></PrivateRoute>}
                  />
                  :
                  <Route
                    key={route.key}
                    path={route.path}
                    element={<route.component />}
                  />
                ))}
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
