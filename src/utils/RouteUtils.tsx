import type { ReactNode } from "react";
import { Route } from "react-router-dom";
import GuestProtector from "@components/routing/GuestProtector";
import RoleGuard from "@components/routing/RoleGuard";
import RouteProtector from "@components/routing/RouteProtector";
import type { RouteConfig } from "@pages/Routes";
import siteMap from "@pages/Routes";

export function buildRoutes(routes: RouteConfig[]): ReactNode {
  const publicRoutes = routes.filter((r) => !r.protected && !r.guestOnly);
  const protectedRoutes = routes.filter((r) => r.protected);
  const guestOnlyRoutes = routes.filter((r) => r.guestOnly);

  return (
    <>
      {publicRoutes.map((r) => (
        <Route key={r.path} path={r.path} element={r.component} />
      ))}
      {protectedRoutes.length > 0 && (
        <Route element={<RouteProtector />}>
          {protectedRoutes.map((r) => (
            <Route
              key={r.path}
              path={r.path}
              element={
                r.roles ? (
                  <RoleGuard roles={r.roles}>{r.component}</RoleGuard>
                ) : (
                  r.component
                )
              }
            />
          ))}
        </Route>
      )}
      {guestOnlyRoutes.length > 0 && (
        <Route element={<GuestProtector />}>
          {guestOnlyRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={r.component} />
          ))}
        </Route>
      )}
    </>
  );
}

export function getRoute(
  route: string,
  routes: RouteConfig[] = siteMap,
): string {
  return routes.filter((r) => r.name == route)[0]?.path ?? `/${route}`;
}
