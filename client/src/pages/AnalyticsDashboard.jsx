import { useEffect, useState } from "react";
import api from "../lib/api";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/analytics/overview").then(({ data }) => setData(data));
  }, []);

  if (!data) return <div>Loading analytics...</div>;

  const statusData = data.statusCounts.map(s => ({ name: s._id, value: s.count }));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tickets per Status */}
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Tickets by Status</h3>
          <PieChart width={300} height={250}>
            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {statusData.map((entry, i) => (
                <Cell 
                    key={entry.name || entry.category || i}   // use a stable field from your data
                    fill={["#8884d8", "#82ca9d", "#ffc658", "#ff8042"][i % 4]} 
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Auto vs Agent Closed */}
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Closure Type</h3>
          <BarChart width={300} height={250} data={[
            { name: "Auto Closed", value: data.autoClosed },
            { name: "Agent Closed", value: data.agentClosed }
          ]}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>

      {/* Avg Resolution Time */}
      <div className="card p-4 mt-6">
        <h3 className="font-semibold">Avg Resolution Time</h3>
        <p>{(data.avgResolution / (1000*60*60)).toFixed(2)} hours</p>
      </div>
    </div>
  );
}