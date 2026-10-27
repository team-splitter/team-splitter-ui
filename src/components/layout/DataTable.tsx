import { Card } from "@mui/material";
import { Theme, ThemeProvider } from "@mui/material/styles";
import { DataGrid, DataGridProps } from "@mui/x-data-grid";
// adds MuiDataGrid to the theme types
import type {} from "@mui/x-data-grid/themeAugmentation";
import { useCallback } from "react";

// The free DataGrid throws when its pageSize prop is over 100, but only checks the prop itself:
// a size given as the theme's default for MuiDataGrid is used as is. Relies on MUI internals,
// so recheck the 500 option after upgrading @mui/x-data-grid.
const FREE_GRID_MAX_PAGE_SIZE = 100;

/**
 * Shared DataGrid wrapper. Centralizes the grid configuration and styling
 * that used to be copy-pasted across every list page, and frames the grid in
 * a consistent bordered card. Any DataGrid prop can be overridden per page.
 */
const DataTable = ({ pageSize, ...props }: DataGridProps) => {
  const largePageSize = pageSize !== undefined && pageSize > FREE_GRID_MAX_PAGE_SIZE ? pageSize : undefined;
  const withLargePageSize = useCallback((outer: Theme): Theme => ({
    ...outer,
    components: {
      ...outer.components,
      MuiDataGrid: {
        ...outer.components?.MuiDataGrid,
        defaultProps: { ...outer.components?.MuiDataGrid?.defaultProps, pageSize: largePageSize },
      },
    },
  }), [largePageSize]);

  const grid = (
    <DataGrid
      autoHeight
      disableSelectionOnClick
      rowsPerPageOptions={[10, 20, 50, 100, 500]}
      {...props}
      pageSize={largePageSize === undefined ? pageSize : undefined}
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
  );

  return (
    <Card sx={{ overflow: "hidden" }}>
      {/* always wrapped, so switching to or from a large size doesn't remount the grid and lose its sort */}
      <ThemeProvider theme={withLargePageSize}>{grid}</ThemeProvider>
    </Card>
  );
};

export default DataTable;
