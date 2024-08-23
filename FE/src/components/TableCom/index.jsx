"use client";
import {
  AddCircle,
  Delete,
  Download,
  Edit,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Grid,
  IconButton,
  Stack,
  TextField,
  styled,
  Button,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";

const TableCom = ({
  title,
  rows,
  columns,
  pageSize,
  pageNo,
  total,
  onChangePage,
  onChangePageSize,
  disableColumnMenu = true,
  disableColumnFilter = true,
  disableColumnSelector = true,
  disableColumnSorting = true,
  hideFooter = false,
  loading = false,
  actions,
  handleView,
  handleEdit,
  handleAdd,
  handleDownload,
  handleDelete,
  handleSearch,
  maxHeight = "fit-content",
  autoHeight = false,
}) => {
  const [searchData, setSearchData] = useState(null);
  const handleDataRow = (page, size, data) => {
    const arr = [];
    let startIndex;
    let endIndex;
    if (size === 1) {
      startIndex = page - 1;
      endIndex = page;
    } else {
      startIndex = page === 1 ? 0 : (page - 1) * size;
      endIndex = page === 1 ? size : page * size;
    }
    for (let i = startIndex; i < endIndex; i++) {
      if (data[i]) {
        arr.push(data[i]);
      }
    }
    return arr;
  };

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 0,
    minHeight: !!rows.length ? "default" : "450px",
    "& .MuiDataGrid-main": {
      boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
      marginLeft: "5px",
      marginRight: "5px",
      marginBottom: "5px",
      borderRadius: "10px",
    },
    "& .MuiDataGrid-columnHeaders": {
      minHeight: 34,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
    },
    "& .MuiDataGrid-container--top [role=row], & .MuiDataGrid-container--bottom [role=row]":
      {
        background: "#AFD3FF",
      },
    "& .MuiDataGrid-columnHeader": {
      borderLeft: "1px solid #C1C1C1",
      "&:nth-of-type(1)": {
        borderLeft: "none",
      },
    },
    "& .MuiDataGrid-columnSeparator": {
      display: "none",
    },
    "& .MuiDataGrid-footerContainer": {
      border: "none",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      fontWeight: 600,
      fontSize: "20px",
      minHeight: "34px",
    },
    "& .MuiDataGrid-row:nth-of-type(even)": {
      backgroundColor: "aliceblue",
    },
    "& .MuiDataGrid-cell": {
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "17px",
      borderBottom: "none",
    },
    "& .MuiDataGrid-row:last-child": {
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
  }));

  const determineWidth = (actions) => {
    const actionCount =
      (actions.view ? 1 : 0) +
      (actions.edit ? 1 : 0) +
      (actions.delete ? 1 : 0) +
      (actions.download ? 1 : 0);
    switch (actionCount) {
      case 1:
        return 100;
      case 2:
        return 140;
      case 3:
        return 180;
      case 4:
        return 220;
      default:
        return 100;
    }
  };

  const ActionMenu = {
    field: "action",
    headerName: "Aksi",
    get maxWidth() {
      return determineWidth(actions);
    },
    get minWidth() {
      return determineWidth(actions);
    },
    flex: 1,
    sortable: false,
    align: "center",
    headerAlign: "center",
    renderCell: ({ row }) =>
      loading ? (
        "Loading"
      ) : (
        <Stack spacing={1} direction="row">
          {actions?.view && (
            <IconButton>
              <Visibility onClick={() => handleView(row)} />
            </IconButton>
          )}
          {actions?.edit && (
            <IconButton>
              <Edit onClick={() => handleEdit(row)} sx={{ color: "#32BEA6" }} />
            </IconButton>
          )}

          {actions?.delete && (
            <IconButton onClick={() => handleDelete(row)}>
              <Delete color="error" />
            </IconButton>
          )}
        </Stack>
      ),
  };

  const NoRowsOverlay = () => (
    <Stack height="325px" alignItems="center" justifyContent="center">
      No Data
    </Stack>
  );

  return (
    <Grid container spacing={2}>
      {(title || actions?.search || actions?.add) && (
        <Grid item xs={12}>
          <Grid
            container
            spacing={1}
            justifyContent={{
              xs: "left",
              sm: "space-between",
            }}
            alignItems="center"
          >
            <Grid item>
              <Typography fontSize={25} fontWeight={700}>
                {title}
              </Typography>
            </Grid>
            <Grid width={{ xs: "100%", sm: "100%", md: "auto" }} item>
              <Stack
                width={{ xs: "100%", sm: "100%", md: "auto" }}
                direction={{ xs: "column", sm: "column", md: "row" }}
                spacing="20px"
              >
                {actions?.search && (
                  <TextField
                    fullWidth
                    sx={{
                      minWidth: { xs: "auto", sm: "auto", md: "300px" },
                    }}
                    InputProps={{
                      style: {
                        borderRadius: "8px",
                      },
                    }}
                    value={searchData}
                    onChange={(e) => setSearchData(e.target.value)}
                    size="small"
                    placeholder="Search..."
                  />
                )}
                {actions?.download && (
                  <Button
                    sx={{
                      minWidth: "137px",
                      height: { xs: "40px", sm: "40px", md: "unset" },
                      borderRadius: "5px",
                    }}
                    loading={loading}
                    onClick={handleDownload}
                    variant="contained"
                    color="success"
                    fontcolor="#ffffff"
                    endIcon={<Download />}
                  >
                    Download
                  </Button>
                )}
                {actions?.add && (
                  <Button
                    sx={{
                      minWidth: "137px",
                      height: { xs: "40px", sm: "40px", md: "unset" },
                      borderRadius: "5px",
                    }}
                    loading={loading}
                    onClick={handleAdd}
                    variant="contained"
                    fontcolor="#ffffff"
                    endIcon={<AddCircle />}
                  >
                    Add Job
                  </Button>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Grid item xs={12}>
        <Box
          sx={{
            // minHeight: 500,
            width: "100%",
            maxHeight: maxHeight,
            overflowY: "auto",
          }}
        >
          <StyledDataGrid
            autoHeight={!!rows?.length}
            getRowHeight={autoHeight ? () => "auto" : undefined}
            textAlign="center"
            rows={rows}
            columns={actions?.show ? [...columns, ActionMenu] : columns}
            pageSize={pageSize}
            checkboxSelection={false}
            disableSelectionOnClick
            // hideFooter={hideFooter}
            hideFooter
            disableColumnMenu={disableColumnMenu}
            disableColumnFilter={disableColumnFilter}
            disableColumnSelector={disableColumnSelector}
            disableColumnSorting={disableColumnSorting}
            loading={loading}
            components={{
              NoRowsOverlay: NoRowsOverlay,
              // Pagination: (paginationProps) => (
              //   <JdPagination
              //     {...paginationProps}
              //     pageSize={pageSize}
              //     pageNo={pageNo}
              //     total={total}
              //     onChangePage={onChangePage}
              //     onChangePageSize={onChangePageSize}
              //     row={rows}
              //     setDataRow={setDataRow}
              //   />
              // ),
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default TableCom;
