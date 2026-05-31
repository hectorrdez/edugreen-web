import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "@contexts/AccessContext";

export default function GuestProtector() {
  const authContext = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  if (authContext?.auth) {
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
