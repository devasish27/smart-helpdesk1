import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Protected } from './components/Protected';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import KBList from './pages/KBList';
import KBEdit from './pages/KBEdit';
import TicketList from "./pages/TicketList";
import TicketForm from "./pages/TicketForm";
import AuditLogs from "./pages/AuditLogs";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import ConfigPage from "./pages/ConfigPage";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard - any authenticated user */}
        <Route element={<Protected />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

        {/* KB Management (Admin only) */}
        <Route element={<Protected roles={["admin"]} />}>
          <Route path="/kb" element={<KBList />} />
          <Route path="/kb/new" element={<KBEdit />} />
          <Route path="/kb/:id" element={<KBEdit />} />
        </Route>

        {/* Tickets (Users, Agents, Admins) */}
        <Route element={<Protected roles={["user","admin","agent"]} />}>
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/tickets/new" element={<TicketForm />} />
          <Route path="/tickets/:id" element={<TicketForm />} />
        </Route>

        <Route element={<Protected roles={["admin"]} />}>
          <Route path="/analytics" element={<AnalyticsDashboard />} />
        </Route>

        <Route element={<Protected roles={["admin"]} />}>
          <Route path="/config" element={<ConfigPage />} />
        </Route>

        {/* Audit Logs (Admin only) */}
        <Route element={<Protected roles={["admin"]} />}>
          <Route path="/audit" element={<AuditLogs />} />
        </Route>
      </Routes>
    </div>
  );
}