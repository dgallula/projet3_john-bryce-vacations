import { Alert, AlertTitle } from "@mui/material";

const successAlert = (message) => {
  return (
    <Alert severity='success'>
      <AlertTitle>Success</AlertTitle>
      {message}
    </Alert>
  );
};

const errorAlert = (message) => {
  return (
    <Alert severity='error'>
      <AlertTitle>Error</AlertTitle>
      {message}
    </Alert>
  );
};

const infoAlert = (message) => {
  return (
    <Alert severity='info'>
      <AlertTitle>Info</AlertTitle>
      {message}
    </Alert>
  );
};

const warningAlert = (message) => {
  return (
    <Alert severity='warning'>
      <AlertTitle>Warning</AlertTitle>
      {message}
    </Alert>
  );
};

export default {
  successAlert,
  errorAlert,
  infoAlert,
  warningAlert,
};
