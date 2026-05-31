import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "@contexts/AccessContext";

export default function RouteProtector() {
  const authContext = useAuth();
  const location = useLocation();

  if (!authContext?.auth) {
    return <Navigate to="/access/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
