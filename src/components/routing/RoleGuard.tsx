import useUser from "@/contexts/UserContext";
import NotAuthorizedPage from "@pages/public/auxiliar/NotAuthorizedPage";
import type { ReactElement } from "react";

type RoleGuardProps = {
  roles: string[];
  children: ReactElement;
};

export default function RoleGuard({ roles, children }: RoleGuardProps) {
  const userContext = useUser();

  if (!userContext?.user || !roles.includes(userContext.user.role)) {
    return <NotAuthorizedPage />;
  }

  return children;
}
