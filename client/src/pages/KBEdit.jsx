import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";

export default function KBEdit() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return; // skip new
    setLoading(true);
    api.get(`/kb/${id}`)
      .then(({ data }) => {
        setTitle(data.title);
        setBody(data.body);
        setTags((data.tags || []).join(","));
        setStatus(data.status);
      })
      .catch(err => {
        alert(err.response?.data?.error || "Failed to load article");
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function onSave() {
    const payload = {
      title,
      body,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      status,
    };
    try {
      if (isNew) {
        await api.post("/kb", payload);
      } else {
        await api.put(`/kb/${id}`, payload);
      }
      navigate("/kb");
    } catch (err) {
      alert(err.response?.data?.error || "Save failed");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="card p-6">
        <h1 className="text-xl font-semibold">{isNew ? "New Article" : "Edit Article"}</h1>
        <div className="grid gap-4 mt-4">
          <div>
            <label className="label">Title</label>
            <input
              className="input mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="How to update payment method"
            />
          </div>
          <div>
            <label className="label">Body</label>
            <textarea
              className="input mt-1 h-56"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write the steps..."
            />
          </div>
          <div>
            <label className="label">Tags (comma separated)</label>
            <input
              className="input mt-1"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="billing,payments"
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              className="input mt-1"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button className="btn-primary" onClick={onSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              className="px-4 py-2 rounded-xl border border-slate-300"
              onClick={() => navigate("/kb")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}