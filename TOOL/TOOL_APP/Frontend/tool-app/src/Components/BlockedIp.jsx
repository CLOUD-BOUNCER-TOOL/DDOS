import { Table, Button } from "react-bootstrap";
import React, { useState, useEffect } from 'react';
import Log from "../../../../../logs/blocked_ips.json";
import DeleteIcon from '@mui/icons-material/Delete';
import './IpTable.css';

// Function to format ISO string to a readable date-time format
const formatDateTime = (isoString) => {
    const options = {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: true
    };
    return new Date(isoString).toLocaleString(undefined, options);
};

// Function to handle delete action
const handleDelete = (ip, data, setData) => {
    const updatedData = data.filter(entry => entry.ip !== ip);
    setData(updatedData);
};

const BlockedIpData = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(Log);
    }, []);

    return (
        <div className="table-container m-2">
            <Table striped bordered hover>
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
                            <td>{formatDateTime(entry.date_time)}</td>
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
