import { Card } from "@mui/material";
import { DataGrid, DataGridProps } from "@mui/x-data-grid";

/**
 * Shared DataGrid wrapper. Centralizes the grid configuration and styling
 * that used to be copy-pasted across every list page, and frames the grid in
 * a consistent bordered card. Any DataGrid prop can be overridden per page.
 */
const DataTable = (props: DataGridProps) => (
  <Card sx={{ overflow: "hidden" }}>
    <DataGrid
      autoHeight
      disableSelectionOnClick
      rowsPerPageOptions={[10, 20, 50, 100]}
      {...props}
      sx={{
        border: "none",
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "background.default",
          borderBottom: "1px solid",
          borderColor: "divider",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          fontWeight: 700,
          color: "text.primary",
        },
        "& .MuiDataGrid-columnSeparator": {
          display: "none",
        },
        "& .MuiDataGrid-cell": {
          borderColor: "divider",
        },
        "& .MuiDataGrid-row:hover": {
          backgroundColor: "rgba(11, 116, 209, 0.04)",
        },
        "& .MuiDataGrid-footerContainer": {
          borderColor: "divider",
        },
        ...props.sx,
      }}
    />
  </Card>
);

export default DataTable;
