import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function Index({ serviceBills }) {
	const [data, setData] = useState(serviceBills);

	const columns = [
		{ field: "id", headerName: "Mã Hóa Đơn", width: 100, renderCell: (params) => (params.value ? "GBK-" + params.value : "N/A") },
		{ field: "customer_name", headerName: "Người đặt", width: 200 },
		{ field: "customer_email", headerName: "Địa chỉ Email", width: 200 },
		{ field: "customer_phone", headerName: "Số điện thoại", width: 200, renderCell: (params) => (params.value ? params.value : "N/A") },
		{ field: "booking_date", headerName: "Ngày đến", width: 150 },
		{ field: "service_name", headerName: "Tên dịch vụ", width: 250 },
		{ field: "status", headerName: "Trạng thái", width: 150, renderCell: (params) => (params.value === 0 ? "Chưa thanh toán" : "Đã thanh toán") },
		{ field: "total", headerName: "Tổng tiền (VND)", width: 150, type: "number" },
	];
	return (
		<Layout>
			<>
				<Box sx={{ height: 400, width: "100%" }}>
					<DataGrid
						rows={data}
						columns={columns}
						pageSize={5}
						checkboxSelection
						editMode="cell"
						initialState={{
							pagination: {
								paginationModel: {
									pageSize: 5,
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
