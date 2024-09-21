import {Table} from "react-bootstrap";
import React, { useState, useEffect } from 'react';
import Log from "../../../../../logs/logs.json";
import "./IpTable.css";

const DataTable = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(Log);
    }, []);

    const formatDateTime = (isoString) => {
        const options = {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            hour12: true
        };
        return new Date(isoString).toLocaleString(undefined, options);
    };

    return (
        <div className="m-3 table-container">
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>Serial No</th>
                        <th>IP Address</th>
                        <th>Date Time</th>
                        <th>Status Code</th>
                    </tr>
                </thead>
                <tbody style={{overflowY: "scroll"}}>
                    {data.map((entry, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{entry.ip}</td>
                            <td>{formatDateTime(entry.date_time)}</td>
                            <td>{entry.status}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default DataTable;
