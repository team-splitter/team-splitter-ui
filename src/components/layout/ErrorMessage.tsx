import { FC } from "react";
import { Alert } from "@mui/material";

type ErrorMessageProps = {
  message?: string | null;
};

/**
 * Consistent error surface. Renders nothing when there is no message, so
 * callers can drop it in unconditionally.
 */
const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <Alert severity="error" variant="outlined" sx={{ mb: 3 }}>
      {message}
    </Alert>
  );
};

export default ErrorMessage;
