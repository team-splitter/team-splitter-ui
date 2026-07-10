import { FC, ReactNode } from "react";
import { Card, CardContent, Typography, Box, SxProps, Theme } from "@mui/material";

type SectionCardProps = {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
  /** Remove inner padding, e.g. when embedding a full-bleed data grid. */
  disableContentPadding?: boolean;
  sx?: SxProps<Theme>;
};

/**
 * A bordered surface used to group content into consistent cards.
 */
const SectionCard: FC<SectionCardProps> = ({
  children,
  title,
  action,
  disableContentPadding = false,
  sx,
}) => (
  <Card sx={sx}>
    {(title || action) && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: 3,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {title && <Typography variant="h6">{title}</Typography>}
        {action}
      </Box>
    )}
    <CardContent sx={disableContentPadding ? { p: 0, "&:last-child": { pb: 0 } } : { p: 3 }}>
      {children}
    </CardContent>
  </Card>
);

export default SectionCard;
