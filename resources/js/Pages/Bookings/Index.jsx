import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function Index({ bookings }) {
	const [data, setData] = useState(bookings);
    const renderStatus = (params) => {
        switch (params.value) {
            case 0:
                return 'Đã đặt';
            case 1:
                return 'Đã sắp lịch';
            case 2:
                return 'Hoàn thành';
            case 3: 
                return 'Đã hủy';
            case 4:
                return 'Thành công';
            default:
                return '';
        }
    };
	const columns = [
		{ field: "id", headerName: "Mã đặt lịch", width: 100, renderCell: (params) => (params.value ? "SC-" + params.value : "N/A") },
		{ field:'customer_name',headerName: "Tên khách hàng", width: 200,renderCell: (params) => (params.row.customer.name) },
		{ field:'customer_phone',headerName: "Số điện thoại", width: 200 ,renderCell: (params) => (params.row.customer.phone)},
		{ field:'service_name',headerName: "Dịch vụ", width: 200,renderCell: (params) => (params.row.service.name) },
		{ field:'price',headerName: "Giá tiền", width: 150,renderCell: (params) => (params.row.service.price) },
        {field:'schedule',headerName: "Ngày đến", width: 150 ,renderCell: (params) => (params.row.time) },
		{headerName: "Tổng tiền (VND)", width: 150, type: "currency",renderCell: (params) => (params.row.service.price) },
		{ field: "status", headerName: "Trạng thái", width: 150, renderCell: renderStatus,  },
	];
	return (
		<Layout>
			<>
				<Box sx={{ height: 900, width: "100%" }}>
					<DataGrid
						rows={data}
						columns={columns}
						pageSize={5}
						checkboxSelection
						editMode="cell"
						initialState={{
							pagination: {
								paginationModel: {
									pageSize: 15,
								},
							},
						}}
						pageSizeOptions={[5]}
						disableRowSelectionOnClick
					/>
				</Box>
			</>
		</Layout>
	);
}

export default Index;
