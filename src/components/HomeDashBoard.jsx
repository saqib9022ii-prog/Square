import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import "../style/DashBoard.css";

const BASE_URL = "https://saqib9022ii.pythonanywhere.com";

export default function HomeDashboard() {
  const [stats, setStats] = useState({ users: 0, today_requests: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
  axios.get(`${BASE_URL}/stats/requests`)
    .then(res => {
      const { total_users, today_requests } = res.data; // <-- change here
      setStats({ users: total_users, today_requests });

      const data = [
        { name: "Users", value: total_users },
        { name: "Requests Today", value: today_requests }
      ];
      setChartData(data);
    })
    .catch(err => console.error(err));
}, []);


  // Loading state
  if (!chartData || chartData.length === 0) {
    return <p className="no-data">Loading dashboard...</p>;
  }

  return (
    <div className="homeContainer">
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      {/* Stats cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.users}</p>
        </div>
        <div className="stat-card">
          <h3>Today's Requests</h3>
          <p>{stats.today_requests}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#4fc3f7" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    </div>
  );
}
