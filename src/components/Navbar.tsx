import React, { FC, ReactElement } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GroupsIcon from "@mui/icons-material/Groups";
import { routes } from "../routes";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const Navbar: FC = (): ReactElement => {
  const { isAuthenticated } = useAuth0();
  const location = useLocation();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const visibleRoutes = routes.filter(
    (page) => page.navDisplay && (!page.authRequired || isAuthenticated)
  );

  const isActive = (path: string) => location.pathname === path;

  const Brand = (
    <Box
      component={NavLink}
      to="/"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        textDecoration: "none",
        color: "text.primary",
      }}
    >
      <GroupsIcon sx={{ color: "primary.main" }} />
      <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
        Team Splitter
      </Typography>
    </Box>
  );

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          {/* Desktop brand */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>{Brand}</Box>

          {/* Mobile menu */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              edge="start"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {visibleRoutes.map((page) => (
                <MenuItem
                  key={page.key}
                  component={NavLink}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                  selected={isActive(page.path)}
                >
                  <Typography>{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile brand (centered-ish) */}
          <Box sx={{ display: { xs: "flex", md: "none" }, flexGrow: 1 }}>
            {Brand}
          </Box>

          {/* Desktop nav links */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              gap: 0.5,
              ml: 2,
            }}
          >
            {visibleRoutes.map((page) => (
              <Button
                key={page.key}
                component={NavLink}
                to={page.path}
                disableRipple
                sx={{
                  color: isActive(page.path) ? "primary.main" : "text.secondary",
                  backgroundColor: isActive(page.path)
                    ? "rgba(11, 116, 209, 0.08)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(11, 116, 209, 0.08)",
                    color: "primary.main",
                  },
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* Auth control */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
