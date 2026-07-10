import { FC } from "react";
import { Box, CircularProgress } from "@mui/material";

type InlineLoadingProps = {
  /** Vertical padding, in theme spacing units. */
  py?: number;
};

/**
 * In-page loading indicator. Unlike the full-screen `Loading` spinner (used
 * for app/auth boot), this sits inside the content area so the page chrome
 * stays visible while data loads.
 */
const InlineLoading: FC<InlineLoadingProps> = ({ py = 6 }) => (
  <Box sx={{ display: "flex", justifyContent: "center", py }}>
    <CircularProgress />
  </Box>
);

export default InlineLoading;
