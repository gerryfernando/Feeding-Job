"use client";
import Image from "next/image";
import styles from "./page.module.css";
import TableCom from "../components/TableCom";
export default function Home() {
  const column = [
    {
      field: "roleName",
      headerName: "Job Name",
      minWidth: 200,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "company",
      headerName: "Company",
      minWidth: 200,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 200,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "location",
      headerName: "Location",
      minWidth: 200,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
  ];

  const actions = {
    view: true,
    show: true,
    add: true,
    view: true,
    delete: true,
    edit: true,
    download: true,
    search: true,
  };
  return (
    <main>
      <div>
        <TableCom
          title="Daftar Jobs"
          actions={actions}
          rows={[{ id: 1 }, { id: 2 }]}
          columns={column}
          pageSize={10}
          pageNo={1}
          total={10}
          onChangePage={() => {}}
          onChangePageSize={() => {}}
          handleView={() => {}}
          loading={false}
        />
      </div>
    </main>
  );
}
