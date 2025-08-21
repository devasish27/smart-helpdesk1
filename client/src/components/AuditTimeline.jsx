import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import api from "../lib/api";

export default function AuditTimeline({ traceId }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (traceId) {
      api.get(`/audit/${traceId}`).then(({ data }) => setLogs(data));
    }
  }, [traceId]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Audit Trail</h3>
      <ul className="border-l-2 border-slate-300 pl-4 space-y-2">
        {logs.map(log => (
          <li key={log._id}>
            <div className="text-sm">
              <span className="font-semibold">{log.action}</span>
              <span className="text-gray-500"> — {new Date(log.createdAt).toLocaleString()}</span>
            </div>
            {log.user && (
              <div className="text-xs text-gray-600">
                by {log.user.email} ({log.user.role})
              </div>
            )}
            {log.details && (
              <pre className="text-xs bg-slate-100 p-1 rounded mt-1">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ✅ PropTypes validation
AuditTimeline.propTypes = {
  traceId: PropTypes.string.isRequired,
};