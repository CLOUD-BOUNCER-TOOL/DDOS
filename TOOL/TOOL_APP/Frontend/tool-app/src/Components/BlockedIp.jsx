import { Table, Button } from "react-bootstrap";
import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from "../utils/axiosInstance";
import './IpTable.css';

const formatDateTime = (isoString) => {
    const options = {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: true
    };
    return new Date(isoString).toLocaleString(undefined, options);
};

const handleDelete = (ip, data, setData) => {
    const updatedData = data.filter(entry => entry.ip !== ip);
    setData(updatedData);
};

const BlockedIpData = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/blockedIps");
                setData(response.data);
            } catch (error) {
                setError("Error while fetching Blocked IPs");
            }
        };

        fetchData();
    }, []);

    return (
        <div className="table-container m-2">
            {error && <div className="alert alert-danger">{error}</div>}
            <Table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>IP Address</th>
                        <th>Date Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{entry.ip}</td>
                            <td>{formatDateTime(entry.timestamp)}</td>
                            <td>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(entry.ip, data, setData)}
                                >
                                    <DeleteIcon />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default BlockedIpData;
