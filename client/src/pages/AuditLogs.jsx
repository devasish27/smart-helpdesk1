import { useEffect, useState } from "react";
import api from "../lib/api";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get("/audit").then(({ data }) => setLogs(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-3">Audit Logs</h1>
      <div className="card p-4">
        <ul className="space-y-2">
          {logs.map(l => (
            <li key={l._id} className="border-b pb-1">
              <span className="font-semibold">{l.action}</span> by {l.performedBy?.email} on {l.target}
              <div className="text-xs text-slate-500">{new Date(l.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}