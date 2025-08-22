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

  // Load ticket if editing
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

  // Save ticket
  async function onSave() {
    const payload = { title, description, status, userId: user._id };
    let savedTicket;

    if (id) {
      const { data } = await api.put(`/tickets/${id}`, payload);
      savedTicket = data;
    } else {
      const { data } = await api.post("/tickets", payload);
      savedTicket = data;

      // Auto-triage for new tickets
      const { data: triageData } = await api.post(`/triage/${savedTicket._id}/triage`);

      // Simulate auto-close based on confidence threshold
      if (triageData.confidence >= 0.8 && triageData.autoClose) {
        await api.put(`/tickets/${savedTicket._id}`, {
          status: "resolved",
          draftReply: triageData.suggestedReply,
        });
        savedTicket.status = "resolved";
        savedTicket.draftReply = triageData.suggestedReply;
      } else {
        // Below threshold → waiting_human
        await api.put(`/tickets/${savedTicket._id}`, { status: "waiting_human" });
        savedTicket.status = "waiting_human";
      }
    }

    setTicket(savedTicket);
    navigate("/tickets");
  }

  // Admin triage trigger
  async function runTriage() {
    const { data } = await api.post(`/triage/${id}/triage`);
    setTicket(data);
  }

  // Admin sends final reply
  async function saveReply() {
    await api.put(`/tickets/${id}`, { draftReply: ticket.draftReply, status: "resolved" });
    navigate("/tickets");
  }

  if (id && !ticket) return <div>Loading...</div>;

  return (
    <div className="max-w-lg mx-auto p-4 card space-y-3">
      <h2 className="text-xl font-semibold">{id ? "Edit Ticket" : "New Ticket"}</h2>

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

      {id && (
        <select
          className="input mb-2"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="waiting_human">Waiting Human</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      )}

      <button className="btn-primary w-full" onClick={onSave}>
        Save
      </button>

      {/* Admin / Agent Panel */}
      {id && user.role !== "user" && (
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
                onChange={e => setTicket({ ...ticket, draftReply: e.target.value })}
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