"use client";
import React, { useEffect, useState } from "react";
import TableCom from "../../components/TableCom";
import API from "../../services/axios";
import moment from "moment";
import AlertCom from "../../components/AlertCom";
import ModalCom from "../../components/ModalCom";
import { enqueueSnackbar } from "notistack";
import { FormProvider, useForm } from "react-hook-form";
import FormJob from "./components/Form";
import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import OptionsJobTag from "../../const/Options";
export default function HomePage() {
  //Const
  const format = "DD MMMM yyyy";
  const column = [
    {
      field: "no",
      headerName: "No",
      minWidth: 75,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "job_name",
      headerName: "Job Name",
      minWidth: 250,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "company",
      headerName: "Company",
      minWidth: 250,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "salary",
      headerName: "Salary",
      minWidth: 350,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 350,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "location",
      headerName: "Location",
      minWidth: 250,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "benefit",
      headerName: "Benefit",
      minWidth: 350,
      flex: 1,
      sortable: false,
      align: "left",
      headerAlign: "center",
      renderCell: ({ row }) => {
        return (
          <ul>
            {row.benefit?.map((val, idx) => (
              <li key={`${idx}-benefit${val.id}`}>{val}</li>
            ))}
          </ul>
        );
      },
    },
    {
      field: "job_tag",
      headerName: "Job Tag",
      minWidth: 150,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "publishDate",
      headerName: "Publish Date",
      minWidth: 300,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
  ];
  const defaultValue = {
    filter: "all",
  };
  const RHF = useForm();

  //State
  const [dataRow, setDataRow] = useState([]);
  const [params, setParams] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showModalGenerateJobs, setShowModalGenerateJobs] = useState(false);
  const [formType, setFormType] = useState("");
  const [tempRow, setTempRow] = useState(null);
  const [jobTagValue, setjobTagValue] = useState(null);

  //Function
  const getData = async () => {
    try {
      setLoading(true);
      const url = "/job";
      const res = await API.get(url, {
        params,
      });
      setTotal(res?.data?.total);
      setDataRow(
        (res?.data?.data || []).map((val, idx) => ({
          ...val,
          publishDate: val.publish_date
            ? moment(val.publish_date).format(format)
            : moment().format(format),
          no: idx + 1,
        }))
      );
    } catch (error) {
      enqueueSnackbar("Get data failed", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (data) => {
    try {
      console.log(data);
      setLoading(true);
      const url = `/job/${data?.id}`;
      const newData = {
        ...data,
        benefit: data?.benefit ? data?.benefit.split(",") : [],
      };
      console.log(newData, url);
      await API.put(url, newData);
      enqueueSnackbar("Edit data success", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Edit data failed", { variant: "error" });
    } finally {
      setLoading(false);
      getData();
      handleCloseModalForm();
    }
  };

  const handleAdd = async (data) => {
    try {
      setLoading(true);
      const url = `/job`;
      const newData = {
        ...data,
        benefit: data?.benefit ? data?.benefit.split(",") : [],
      };
      await API.post(url, newData);
      enqueueSnackbar("Add data success", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Add data failed", { variant: "error" });
    } finally {
      setLoading(false);
      getData();
      handleCloseModalForm();
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const url = `/job/${id}`;
      await API.delete(url);
      enqueueSnackbar("Delete data success", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Delete data failed", { variant: "error" });
    } finally {
      setLoading(false);
      getData();
      setShowAlertDelete(false);
      setDeleteId(null);
    }
  };

  const downloadFile = (res) => {
    var data = new Blob([res], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    var excelUrl = window.URL.createObjectURL(data);
    let tempLink = document.createElement("a");
    tempLink.href = excelUrl;
    tempLink.setAttribute("download", "jobs.xlsx");
    tempLink.click();
  };
  const handleDownload = async () => {
    try {
      setLoading(true);
      const url = "/download";
      const res = await API.get(url, { responseType: "blob" });
      downloadFile(res.data);
      //   downloadFile(res);
    } catch (error) {
      enqueueSnackbar("Download data failed", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const generateJobs = async () => {
    try {
      setLoading(true);
      const tag = jobTagValue;
      const url = "/scrap/" + tag;
      await API.get(url);
      enqueueSnackbar("Generate jobs success", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Generate jobs failed", { variant: "error" });
    } finally {
      setLoading(false);
      setShowModalGenerateJobs(false);
      setjobTagValue(null);
      setParams({ filter: "all" });
    }
  };

  const helperHandleClick = (type, row) => {
    const dataForm =
      type === "add"
        ? {}
        : {
            ...row,
            jobName: row.job_name,
            workType: row.work_type,
            jobTag: row.job_tag,
            benefit: row?.benefit.toString(),
          };
    RHF.reset({ ...dataForm });
    setTempRow(row);
    setFormType(type);
    setShowFormModal(true);
  };
  const handleCloseModalForm = () => {
    setShowFormModal(false);
    setFormType("");
    setTempRow(null);
    RHF.reset({});
  };

  const onSubmitForm = async () => {
    const data = RHF.getValues();
    if (formType === "add") {
      handleAdd(data);
    } else if (formType === "edit") {
      handleEdit(data);
    } else if (formType === "view") {
      handleCloseModalForm();
    }
  };

  //useeffect

  useEffect(() => {
    getData();
  }, [params]);

  const actions = {
    view: true,
    show: true,
    add: true,
    view: true,
    delete: true,
    edit: true,
    download: true,
    search: true,
    filter: true,
    customButton: [
      {
        show: true,
        text: "Generate Jobs",
        handleClick: () => setShowModalGenerateJobs(true),
        testId: "generateJobButton",
      },
    ],
  };

  return (
    <div data-testid="homeContainer">
      <TableCom
        testId="homeTable"
        title="Job List"
        actions={actions}
        rows={dataRow}
        columns={column}
        pageSize={params.size}
        pageNo={params.page}
        total={total}
        handleAdd={(row) => {
          helperHandleClick("add", row);
        }}
        handleEdit={(row) => {
          helperHandleClick("edit", row);
        }}
        handleDelete={(row) => {
          setDeleteId(row.id);
          setShowAlertDelete(true);
        }}
        handleView={(row) => {
          helperHandleClick("view", row);
        }}
        filterProps={{
          value: params.filter,
          setValue: (val) => {
            setParams((prev) => ({ ...prev, filter: val }));
          },
        }}
        handleDownload={handleDownload}
        loading={loading}
      />
      {showAlertDelete && (
        <div data-testid="homeDeleteAlert">
          <AlertCom
            testId="homeDeleteAlert"
            title={"Delete Data"}
            loading={loading}
            type="error"
            width={{ xs: "80%", sm: "359px" }}
            message={"Are you sure you want to delete this data?"}
            open={showAlertDelete}
            onClose={() => {
              setShowAlertDelete(false);
              setDeleteId(null);
            }}
            onConfirm={() => {
              handleDelete(deleteId);
            }}
          />
        </div>
      )}
      <ModalCom
        open={showModalGenerateJobs}
        onClose={() => {
          setShowModalGenerateJobs(false);
          setjobTagValue(null);
        }}
        loading={loading}
        okText="Generate"
        key="generateJobModal"
        size="xs"
        onConfirm={() => {
          generateJobs();
        }}
        title="Generate Jobs Data"
      >
        <div data-testid="homeGenerateModal">
          <InputLabel id="jobtag" sx={{ mb: "20px" }}>
            Please input job tag
          </InputLabel>

          <FormControl variant="standard" fullWidth>
            <Select
              id="generate-jobs-select"
              value={jobTagValue}
              onChange={(e) => setjobTagValue(e.target.value)}
            >
              {OptionsJobTag.map((val) => {
                return <MenuItem value={val?.value}>{val?.label}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </div>
      </ModalCom>
      {showFormModal && (
        <ModalCom
          open={showFormModal}
          onClose={handleCloseModalForm}
          loading={loading}
          okText={formType === "view" ? "OK" : "Save"}
          key="modalJobForm"
          size="xl"
          minHeight="65vh"
          onConfirm={async () => {
            const isValid = await RHF.trigger();
            if (isValid) {
              onSubmitForm();
            }
          }}
          title={`${
            formType.charAt(0).toUpperCase() + formType.slice(1)
          } Job Data`}
        >
          <div data-testid="homeFormModal">
            <FormJob
              RHF={RHF}
              isViewOnly={formType === "view"}
              formType={formType}
              row={tempRow}
            />
          </div>
        </ModalCom>
      )}
    </div>
  );
}
