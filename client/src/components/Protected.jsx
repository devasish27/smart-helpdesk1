import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/auth";
import PropTypes from "prop-types";

export function Protected({ roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
}

Protected.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string), // optional array of strings
};
