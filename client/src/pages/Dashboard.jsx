import { useAuth } from "../store/auth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container py-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">
        Welcome back, {user?.email || "User"} 👋
      </h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 card-hover">
          <h2 className="text-sm font-semibold text-slate-500">Open Tickets</h2>
          <p className="text-3xl font-bold mt-2 text-brand-600">12</p>
        </div>
        <div className="card p-6 card-hover">
          <h2 className="text-sm font-semibold text-slate-500">Resolved This Week</h2>
          <p className="text-3xl font-bold mt-2 text-green-600">8</p>
        </div>
        <div className="card p-6 card-hover">
          <h2 className="text-sm font-semibold text-slate-500">Knowledge Articles</h2>
          <p className="text-3xl font-bold mt-2 text-purple-600">23</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            <a href="/tickets/new" className="btn-primary text-center">+ Create Ticket</a>
            {user?.role === "admin" && (
              <a href="/kb/new" className="btn-secondary text-center">+ Add KB Article</a>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>✅ Ticket #112 resolved by Agent Smith</li>
            <li>📄 KB article "Password Reset" updated</li>
            <li>🎫 New ticket created by John (Billing Issue)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}