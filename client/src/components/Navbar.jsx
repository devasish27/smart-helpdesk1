import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/auth";
import Notifications from "./Notifications";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false); // control dropdown

  const handleNotifToggle = () => setNotifOpen(!notifOpen);

  return (
    <nav className="bg-slate-800 text-white p-3 flex justify-between items-center">
      {/* Left side: app name / links */}
      <div className="flex space-x-4">
        {user ? (
          <>
            <Link to="/" className="hover:underline">Dashboard</Link>
            <Link to="/tickets" className="hover:underline">Tickets</Link>

            {/* Admin-only pages */}
            {user.role === "admin" && (
              <>
                <Link to="/kb" className="hover:underline">Knowledge Base</Link>
                <Link to="/audit" className="hover:underline">Audit Logs</Link>
              </>
            )}
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>

      {/* Right side: notifications and logout */}
      <div className="relative flex items-center space-x-3">
        {user && (
          <>
            <button
              onClick={handleNotifToggle}
              className="relative bg-slate-700 p-2 rounded hover:bg-slate-600"
            >
              Notifications
            </button>
            {notifOpen && (
              <Notifications
                onClose={() => setNotifOpen(false)} // close dropdown when all read
              />
            )}
          </>
        )}

        {user && (
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}