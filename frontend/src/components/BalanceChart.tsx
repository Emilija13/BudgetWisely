import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const AccountHistoryChart = ({ accountId }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch account history data
        axios.get(`http://localhost:8080/api/account-history/${accountId}`)
            .then((response) => {
                // Transform data for the line chart
                const chartData = response.data.map((entry) => ({
                    timestamp: new Date(entry.timestamp).toLocaleDateString(), // Format timestamp
                    balance: entry.balance,
                }));
                setData(chartData);
            })
            .catch((error) => console.error('Error fetching account history:', error));
    }, [accountId]);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="balance" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default AccountHistoryChart;
