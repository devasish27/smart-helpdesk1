import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../store/auth";
import AuditTimeline from "../components/AuditTimeline";

export default function TicketForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (id) {
      api.get(`/tickets/${id}`).then(({ data }) => {
        setTitle(data.title);
        setDescription(data.description);
        setStatus(data.status);
        setTicket(data);
      });
    }
  }, [id]);

  async function onSave() {
    const payload = { title, description, status };
    if (id) {
      const { data } = await api.put(`/tickets/${id}`, payload);
      setTicket(data);
    } else {
      await api.post("/tickets", payload);
      navigate("/tickets");
    }
  }

  async function runTriage() {
    const { data } = await api.post(`/triage/${id}/triage`);
    setTicket(data);
  }

  async function saveReply() {
    await api.put(`/tickets/${id}`, { draftReply: ticket.draftReply, status: "resolved" });
    navigate("/tickets");
  }

  if (id && !ticket) return <div>Loading...</div>;

  return (
    <div className="max-w-lg mx-auto p-4 card space-y-3">
      <h2 className="text-xl font-semibold">{id ? "Edit Ticket" : "New Ticket"}</h2>

      {/* Basic ticket fields */}
      <input
        className="input mb-2"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        className="input mb-2 min-h-[120px]"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Describe your issue..."
      />
      <select
        className="input mb-2"
        value={status}
        onChange={e => setStatus(e.target.value)}
      >
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      <button className="btn-primary w-full" onClick={onSave}>
        Save
      </button>

      {/* AI triage + agent review (admins/agents only) */}
      {id && user?.role !== "user" && (
        <div className="mt-4 space-y-3">
          <button className="btn-secondary w-full" onClick={runTriage}>
            Run AI Triage
          </button>

          {ticket?.kbSuggestions?.length > 0 && (
            <div className="bg-slate-50 p-3 rounded">
              <h3 className="font-semibold">Suggested KB Articles:</h3>
              <ul className="list-disc list-inside">
                {ticket.kbSuggestions.map(a => (
                  <li key={a._id}>{a.title}</li>
                ))}
              </ul>
            </div>
          )}

          {ticket && <AuditTimeline traceId={ticket._id} />}

          {ticket?.draftReply && (
            <div>
              <h3 className="font-semibold mt-2">AI Draft Reply:</h3>
              <textarea
                className="input w-full min-h-[120px]"
                value={ticket.draftReply}
                onChange={e =>
                  setTicket({ ...ticket, draftReply: e.target.value })
                }
              />
              <button className="btn-primary w-full mt-2" onClick={saveReply}>
                Send Final Reply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}