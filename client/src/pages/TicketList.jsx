import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../store/auth";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get("/tickets").then(({ data }) => setTickets(data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Tickets</h1>
        {user?.role === "user" && (
          <Link to="/tickets/new" className="btn-primary">+ New Ticket</Link>
        )}
      </div>
      <div className="grid gap-3">
        {tickets.map(t => (
          <Link to={`/tickets/${t._id}`} key={t._id} className="card p-4 hover:bg-slate-50">
            <h3 className="font-semibold">{t.title}</h3>
            <p className="text-sm text-slate-600">{t.description.slice(0,80)}...</p>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Status: {t.status}</span>
              <span>By: {t.createdBy?.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}