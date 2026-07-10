import { FC, ReactNode } from "react";
import { Box, Container } from "@mui/material";
import { Breakpoint } from "@mui/material/styles";

type PageLayoutProps = {
  children: ReactNode;
  maxWidth?: Breakpoint | false;
};

/**
 * Consistent page shell: centered container with uniform horizontal and
 * vertical padding. Every top-level page renders its content inside this so
 * spacing and width stay identical across the app.
 */
const PageLayout: FC<PageLayoutProps> = ({ children, maxWidth = "lg" }) => (
  <Box sx={{ py: { xs: 3, md: 4 } }}>
    <Container maxWidth={maxWidth}>{children}</Container>
  </Box>
);

export default PageLayout;
