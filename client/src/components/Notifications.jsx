import { useEffect, useState } from "react";
import api from "../lib/api";

export default function Notifications() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data } = await api.get("/notifications");
    setItems(data);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, []);

  async function markAllRead() {
    await api.put("/notifications/read");
    load();
  }

  return (
    <div className="relative">
      <button className="relative">
        🔔
        {items.some(i => !i.read) && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded">
            {items.filter(i => !i.read).length}
          </span>
        )}
      </button>
      <div className="absolute right-0 mt-2 bg-white shadow-lg rounded w-64 p-2 z-50">
        {items.length === 0 ? <p>No notifications</p> : (
          <ul className="space-y-1 max-h-48 overflow-y-auto">
            {items.map(n => (
              <li key={n._id} className={`text-sm p-1 ${n.read ? "text-gray-500" : "font-bold"}`}>
                {n.message}
              </li>
            ))}
          </ul>
        )}
        <button className="text-xs text-blue-600 mt-2" onClick={markAllRead}>Mark all read</button>
      </div>
    </div>
  );
}