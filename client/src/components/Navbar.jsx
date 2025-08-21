import { Link } from "react-router-dom";
import { useAuth } from "../store/auth";
import Notifications from "./Notifications";

export default function Navbar() {
  const { user, logout } = useAuth();

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

      {/* Right side: logout button */}
      <div>
        {user && <Notifications />}
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