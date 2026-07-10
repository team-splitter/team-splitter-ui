import React, { FC, ReactElement } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";

export const Footer: FC = (): ReactElement => {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        py: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Team Splitter Admin
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`${new Date().getFullYear()} · Maksym Mukhanov`}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
