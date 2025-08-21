import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { kbSearch, kbDelete, kbPublish } from "../lib/kb";
import { useAuth } from "../store/auth";

export default function KBList() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const limit = 10;

  const load = async () => {
    setLoading(true);
    try {
      const data = await kbSearch({ query, status, page, limit });
      setItems(data.items);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await kbSearch({ query, status, page, limit });
      setItems(data.items);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [query, status, page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Knowledge Base</h1>
        {user?.role === "admin" && (
          <button
            onClick={() => navigate("/kb/new")}
            className="btn-primary"
          >
            New Article
          </button>
        )}
      </div>

      {/* Search filters */}
      <div className="card p-4 mb-4">
        <div className="grid md:grid-cols-3 gap-3">
          <input
            className="input"
            placeholder="Search title, body, tags"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button className="btn-primary" onClick={() => setPage(1)}>
            Search
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading && (
          <div className="card p-6 animate-pulse">Loading articles...</div>
        )}
        {!loading && items.length === 0 && (
          <div className="card p-6">No articles found.</div>
        )}
        {!loading &&
          items.map((a) => (
            <div
              key={a._id}
              className="card p-4 flex items-start justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-2 mt-1">
                  {a.body}
                </p>
                <div className="mt-2 text-xs text-slate-500">
                  Tags: {a.tags?.join(", ") || "—"} · Status:{" "}
                  <span
                    className={
                      a.status === "published"
                        ? "text-green-700"
                        : "text-slate-600"
                    }
                  >
                    {a.status}
                  </span>
                </div>
              </div>
              {user?.role === "admin" && (
                <div className="flex items-center gap-2">
                  <Link to={`/kb/${a._id}`} className="btn-primary">
                    Edit
                  </Link>
                  <button
                    onClick={async () => {
                      if (confirm("Delete this article?")) {
                        await kbDelete(a._id);
                        load();
                      }
                    }}
                    className="px-3 py-2 rounded-xl border border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                  <button
                    onClick={async () => {
                      await kbPublish(
                        a._id,
                        a.status === "published" ? "draft" : "published"
                      );
                      load();
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50"
                  >
                    {a.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-2 rounded-xl border border-slate-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-2 rounded-xl border border-slate-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}