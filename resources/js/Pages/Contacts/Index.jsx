import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Notyf } from "notyf";
import { Box, Switch, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import "notyf/notyf.min.css";
import Swal from "sweetalert2";
import axios from "axios";
function Index({ contacts }) {
  const [data, setData] = useState(contacts);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const formatCreatedAt = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  const notyf = new Notyf({
    duration: 1000,
    position: {
      x: "right",
      y: "top",
    },
    types: [
      {
        type: "warning",
        background: "orange",
        icon: {
          className: "material-icons",
          tagName: "i",
          text: "warning",
        },
      },
      {
        type: "error",
        background: "indianred",
        duration: 2000,
        dismissible: true,
      },
      {
        type: "success",
        background: "green",
        color: "white",
        duration: 2000,
        dismissible: true,
      },
      {
        type: "info",
        background: "#24b3f0",
        color: "white",
        duration: 1500,
        dismissible: false,
        icon: '<i class="bi bi-bag-check"></i>',
      },
    ],
  });
  const columns = [
    {
      field: "id",
      headerName: "#",
      width: 100,
      renderCell: (params) => params.rowIndex,
    },
    { field: "name", headerName: "Người liên hệ", width: 200, editable: false },
    { field: "email", headerName: "Email", width: 200, editable: false },
    { field: "phone", headerName: "Số điện thoại", width: 200, editable: false },
    { field: "message", headerName: "Nội dung", width: 200, editable: false },
    { field: "note", headerName: "Ghi chú", width: 200, editable: true },

    ,
    {
      field: "status",
      headerName: "Status",
      width: 70,
      renderCell: (params) => (
        <Switch
          checked={params.value == 1}
          onChange={(e) => switchContact(params, e.target.checked ? 1 : 0)}
          inputProps={{ "aria-label": "controlled" }}
        />
      ),
    },
    {
      field: "created_at",
      headerName: "Created at",
      width: 200,
      valueGetter: (params) => formatCreatedAt(params),
    },
  ];
  const switchContact = (params, value) => {
    var id = params.id;
    var field = params.field;
    axios
      .put(
        `/contacts/${id}`,
        {
          [field]: value,
        }
      )
      .then((res) => {
        if (res.data.check == true) {
          notyf.open({
            type: "success",
            message: "Chỉnh sửa trạng thái sản phẩm thành công",
          });
          setData(res.data.data);
        } else if (res.data.check == false) {
          notyf.open({
            type: "error",
            message: res.data.msg,
          });
        }
      });
  };
  const handleCellEditStop = (id, field, value) => {
    if (value != "") {
      axios
        .put(
          `/contacts/${id}`,
          {
            note: value,
          }
        )
        .then((res) => {
          if (res.data.check == true) {
            notyf.open({
              type: "success",
              message: "Chỉnh sửa ghi chú thành công",
            });
            setData(res.data.data);
          } else if (res.data.check == false) {
            notyf.open({
              type: "error",
              message: res.data.msg,
            });
          }
        });
    }
  };
  return (
    <Layout>
      <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              </ul>
            </div>
          </div>
        </nav>
        <div className="row">
          <div className="col-md-12">
            {data && data.length > 0 && (
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={data}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  onCellEditStop={(params, e) =>
                    handleCellEditStop(
                      params.row.id,
                      params.field,
                      e.target.value
                    )
                  }
                />
              </Box>
            )}
          </div>
        </div>
      </>
    </Layout>
  );
}

export default Index;
