import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../contexts/AuthContext";

export default function RouteProtector() {
  const authContext = useAuth();

  if (!authContext?.auth) {
    return <Navigate to="/access/login" replace />;
  }

  return <Outlet />;
}
