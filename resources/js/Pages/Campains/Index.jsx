import React, { useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import 'notyf/notyf.min.css';
import { Notyf } from 'notyf';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Select, MenuItem } from "@mui/material";

function Index({ dataCampaigns }) {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [link, setLink] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [start, setStart] = useState(''); // Allowing for nullable start date
    const [end, setEnd] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [currentCampaignId, setCurrentCampaignId] = useState(null);
    const [data, setData] = useState(dataCampaigns);

    const notyf = new Notyf({
        duration: 2000,
        position: {
            x: 'right',
            y: 'top',
        },
        types: [
            {
                type: 'warning',
                background: 'orange',
                icon: {
                    className: 'material-icons',
                    tagName: 'i',
                    text: 'warning'
                }
            },
            {
                type: 'error',
                background: 'indianred',
                dismissible: true
            },
            {
                type: 'success',
                background: 'green',
                color: 'white',
                dismissible: true
            },
            {
                type: 'info',
                background: '#24b3f0',
                color: 'white',
                dismissible: false,
                icon: '<i class="bi bi-bag-check"></i>'
            }
        ]
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleCellEditStop = (id, field, value) => {
        axios.put(`/campains/${id}`, { [field]: value })
            .then((res) => {
                if (res.data.check) {
                    notyf.open({ type: "success", message: "Data updated successfully" });
                    setData(res.data.data);
                } else {
                    notyf.open({ type: "error", message: res.data.msg });
                }
            })
            .catch((error) => {
                console.error("Error updating campaign:", error);
                notyf.open({ type: "error", message: "An error occurred while updating the campaign." });
            });
    };

    const handleUpdate = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('summary', summary);
        formData.append('link', link);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        formData.append('start', start || null); // Handle nullable start
        formData.append('end', end);

        try {
            const response = await axios.post(`/edit-campaign/${currentCampaignId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.check) {
                notyf.open({ type: "success", message: "Campaign updated successfully" });
                setData(response.data.data);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
                setEditMode(false);
            } else {
                notyf.open({ type: "error", message: response.data.msg });
            }
        } catch (error) {
            console.error('Error updating campaign', error);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('summary', summary);
        formData.append('link', link);
        formData.append('image', imageFile);
        formData.append('start', start || null); // Handle nullable start
        formData.append('end', end);

        try {
            const response = await axios.post('/campains', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.check) {
                notyf.open({ type: "success", message: "Campaign added successfully" });
                setData(response.data.data);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                notyf.open({ type: "error", message: response.data.msg });
            }
        } catch (error) {
            console.error('Error adding campaign', error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`/campains/${id}`);
            if (response.data.check) {
                notyf.open({ type: "success", message: "Campaign deleted successfully" });
                setData(response.data.data);
            } else {
                notyf.open({ type: "error", message: response.data.msg });
            }
        } catch (error) {
            console.error('Error deleting campaign', error);
            notyf.open({ type: "error", message: "An error occurred while deleting the campaign." });
        }
    };

    const handleEditClick = (id) => {
        axios.get(`/campains/${id}`)
            .then((res) => {
                const campaign = res.data.campaign;
                setTitle(campaign.title);
                setSummary(campaign.summary);
                setLink(campaign.link);
                setImagePreview(`/storage/campains/${campaign.image}`);
                setStart(campaign.start || ''); // Handle nullable start
                setEnd(campaign.end);
                setCurrentCampaignId(campaign.id);
                setEditMode(true);
            })
            .catch((error) => {
                console.error("Error fetching campaign:", error);
            });
    };

    const columns = [
        { field: "id", headerName: "#", width: 100 },
        { field: "title", headerName: "Title", width: 200, editable: true },
        { field: "summary", headerName: "Summary", width: 250, editable: true },
        { field: "link", headerName: "Link", width: 200, editable: true },
        {
            field: "image", headerName: "Image", width: 150, renderCell: (params) => (
                <img src={`/storage/${params.value}`} alt="Campaign" style={{ width: '100%', maxHeight: '100px' }} />
            )
        },
        { field: "start", headerName: "Start Date", width: 180, valueGetter: (params) => formatDate(params) },
        { field: "end", headerName: "End Date", width: 180, valueGetter: (params) => formatDate(params) },
        {
            field: "edit",
            headerName: "Options",
            width: 150,
            renderCell: (params) => (
                <>
                    <button className="btn btn-sm ms-3 btn-danger" onClick={() => handleDelete(params.row.id)}>Delete</button>
                </>
            ),
        },
    ];

    return (
        <Layout>
            <div className="row">
                <div className="card text-start">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="input-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Campaign title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div className="input-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Campaign summary"
                                        value={summary}
                                        onChange={(e) => setSummary(e.target.value)}
                                    />
                                </div>
                                <div className="input-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Campaign link"
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                    />
                                </div>
                                <label htmlFor="image">Image </label>
                                <div className="input-group mb-2">
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                {imagePreview && (
                                    <div className="mb-2">
                                        <img src={imagePreview} alt="Image Preview" style={{ width: '100%', maxHeight: '200px' }} />
                                    </div>
                                )}
                                <div className="mb-2">
                                    <label htmlFor="start" className="form-label">Start Date</label>
                                    <input
                                        type="datetime-local"
                                        id="start"
                                        className="form-control"
                                        value={start}
                                        onChange={(e) => setStart(e.target.value)}
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="end" className="form-label">End Date</label>
                                    <input
                                        id="end"
                                        type="datetime-local"
                                        className="form-control"
                                        value={end}
                                        onChange={(e) => setEnd(e.target.value)}
                                    />
                                </div>
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={editMode ? handleUpdate : handleSubmit}
                                >
                                    {editMode ? "Update" : "Add"}
                                </button>
                            </div>
                            <div className="col-md-9">

                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md">
                                <Box sx={{ height: 400, width: '100%' }}>
                                    <DataGrid
                                        rows={data}
                                        columns={columns}
                                        pageSize={5}
                                        rowsPerPageOptions={[5]}
                                        onCellEditStop={(params) => handleCellEditStop(params.id, params.field, params.value)}
                                    />
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Index;
