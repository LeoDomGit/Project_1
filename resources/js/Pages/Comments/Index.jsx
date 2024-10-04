import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Box, Button, ButtonGroup, Grid, Modal, Switch, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ChatIcon from "@mui/icons-material/Chat";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import SendIcon from "@mui/icons-material/Send";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axios from "axios";
import { Notyf } from "notyf";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export default function Index({ comments }) {
	const [data, setData] = useState([]);
	const [details, setDetails] = useState([]);
	const [open, setOpen] = useState(false);
	const [reply, setReply] = useState([]);

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
				color: "black",
				duration: 2000,
				dismissible: true,
			},
			{
				type: "info",
				background: "#24b3f0",
				color: "black",
				duration: 1500,
				dismissible: false,
				icon: '<i class="bi bi-bag-check"></i>',
			},
		],
	});

	const handleOpen = (data) => {
		console.log(data);
		setDetails(data);
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
		setReply("");
		setDetails([]);
	};

	const handleReply = () => {
		if (!reply) {
			notyf.open({ type: "error", message: "Nội dung phản hồi không được để trống!" });
			return;
		}
		axios
			.post("/comments", { id_product: details.id_product, id_parent: details.id, comment: reply })
			.then((res) => {
				if (res.data.check === true) {
					notyf.open({ type: "success", message: res.data.msg });
					setReply("");
					handleClose();
					setData(res.data.data);
				} else if (res.data.check === false) {
					notyf.open({ type: "error", message: res.data.msg });
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	function switchService(params, value) {
		let field = params.field;
		console.log(params.id, field, value);

		axios
			.put("/comments/" + params.id, {
				[field]: value,
			})
			.then((res) => {
				if (res.data.check == false) {
					if (res.data.msg) {
						notyf.open({
							type: "error",
							message: res.data.msg,
						});
					}
				} else if (res.data.check == true) {
					notyf.open({
						type: "success",
						message: res.data.msg,
					});
					setData(res.data.data);
				}
			});
	}

	const handleDelete = (id) => {
		axios.delete("/comments/" + id).then((res) => {
			if (res.data.check == true) {
				notyf.open({
					type: "success",
					message: "Đã xóa",
				});
				setData(res.data.data);
			}
		});
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 40 },
		{ field: "id_product", headerName: "Sản phẩm", width: 240, renderCell: (params) => (params.row.product ? params.row.product.name : "N/A") },
		{
			field: "id_customer",
			headerName: "Người viết",
			width: 120,
			renderCell: (params) => {
				if (params.row.customer) {
					return params.row.customer.name;
				} else if (params.row.user) {
					return params.row.user.name;
				} else {
					return "N/A";
				}
			},
		},
		{ field: "id_service", headerName: "Dịch vụ", width: 200, renderCell: (params) => (params.row.service ? params.row.service.name : "N/A") },
		{ field: "comment", headerName: "Nội dung", width: 240 },
		{
			field: "id_parent",
			headerName: "Phân hồi từ",
			width: 120,
			renderCell: (params) => params.row.parent?.customer?.name || params.row.parent?.user?.name || "N/A",
		},
		{
			field: "status",
			headerName: "Trạng thái",
			width: 100,
			editable: true,
			renderCell: (params) => <Switch checked={params.value == 1} onChange={(e) => switchService(params, e.target.checked ? 1 : 0)} inputProps={{ "aria-label": "controlled" }} />,
		},
		{ field: "created_at", headerName: "Ngày đăng", width: 150, renderCell: (params) => (params.value ? new Date(params.value).toLocaleString() : "N/A") },
		{
			field: "action",
			headerName: "Thao tác",
			width: 300,
			renderCell: (params) => (
				<>
					<Button variant="contained" startIcon={<ChatIcon />} onClick={() => handleOpen(params.row)}>
						Xem bình luận
					</Button>
					<Button variant="contained" color="error" sx={{ ml: 2 }} startIcon={<DeleteForeverIcon />} onClick={() => handleDelete(params.row.id)}>
						Xóa
					</Button>
				</>
			),
		},
	];

	useEffect(() => {
		setData(comments);
	}, [comments]);

	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 1200,
		bgcolor: "background.paper",
		border: "2px solid #000",
		boxShadow: 24,
		p: 4,
	};

	return (
		<Layout>
			<>
				<Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
					<Box sx={style}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Typography id="modal-modal-title" variant="h6" component="h2">
									Trả lời bình luận của <span style={{ color: "red", fontSize: 22, fontWeight: "bold" }}>{details?.customer?.name || details?.user?.name || "Người dùng không xác định"}</span>
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<Typography id="modal-modal-description" sx={{ mt: 2 }}>
									<TextField fullWidth id="outlined-multiline-static" label="Bình luận" multiline rows={4} defaultValue={details?.comment} />
									<ButtonGroup variant="text" sx={{ mt: 2 }} aria-label="Basic button group">
										<Button endIcon={<ThumbUpOffAltIcon />}>Thích ({details?.likes || 0})</Button>
										<Button endIcon={<ThumbDownOffAltIcon />}>Không thích ({details?.dislikes || 0})</Button>
										<Button endIcon={<FavoriteBorderIcon />}>Yêu thích ({details?.heart || 0})</Button>
									</ButtonGroup>
								</Typography>
							</Grid>
							<Grid item xs={1}>
								<SubdirectoryArrowRightIcon sx={{ fontSize: 60, mt: 2 }} />
							</Grid>
							<Grid item xs={10}>
								<Typography id="modal-modal-description" sx={{ mt: 2 }}>
									<TextField fullWidth id="outlined-multiline-static" label="Trả lời Bình luận" multiline rows={4} onChange={(e) => setReply(e.target.value)} />
								</Typography>
							</Grid>
							<Grid item xs={1}>
								<Button variant="contained" type="submit" sx={{ mt: 2, height: "88%" }} endIcon={<SendIcon />} onClick={handleReply}>
									Send
								</Button>
							</Grid>
						</Grid>
					</Box>
				</Modal>

				<Box>
					<DataGrid rows={data} columns={columns} pageSize={5} rowsPerPageOptions={[5]} checkboxSelection disableRowSelectionOnClick />
				</Box>
			</>
		</Layout>
	);
}
