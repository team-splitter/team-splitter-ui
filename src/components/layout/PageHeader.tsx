import { FC, ReactNode } from "react";
import { Box, Stack, Typography } from "@mui/material";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  /** Optional actions rendered on the right (buttons, inputs, etc.). */
  action?: ReactNode;
};

/**
 * Standard page title block. Keeps heading typography, spacing and the
 * title/action layout identical on every page.
 */
const PageHeader: FC<PageHeaderProps> = ({ title, subtitle, action }) => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    justifyContent="space-between"
    alignItems={{ xs: "flex-start", sm: "center" }}
    spacing={2}
    sx={{ mb: 3 }}
  >
    <Box>
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
  </Stack>
);

export default PageHeader;
