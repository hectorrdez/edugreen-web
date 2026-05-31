import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IconChalkboard,
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconShield,
  IconUser,
} from "@tabler/icons-react";
import useAuth from "@contexts/AccessContext";
import useUser from "@contexts/UserContext";
import { getRoute } from "@/utils/RouteUtils";

type UserMenuProps = {
  variant?: "dark" | "light";
};

export function UserMenu({ variant = "light" }: UserMenuProps) {
  const { user } = useUser()!;
  const { auth, setAuth } = useAuth()!;
  const isAdmin = user?.role === "admin";
  const isTeacher = user?.role === "teacher" || user?.role === "admin";
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    setAuth(null);
    setOpen(false);
    navigate("/");
  }

  const displayName = user ? `${user.name} ${user.lastName}` : "…";
  const buttonCls =
    variant === "dark" ? "text-white hover:bg-white/10" : "hover:bg-black/5";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 font-semibold px-3 py-2 rounded-lg transition-colors ${buttonCls}`}
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-black text-xs font-bold shrink-0">
          {user ? `${user.name.charAt(0)}${user.lastName.charAt(0)}` : "?"}
        </span>
        <span className="max-w-36 truncate">{displayName}</span>
        <IconChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-50 border border-gray-100">
          <DropdownLink
            to={`/profile/${auth?.id}`}
            icon={<IconUser size={15} />}
            onClick={() => setOpen(false)}
          >
            Perfil
          </DropdownLink>
          <DropdownLink
            to="/settings"
            icon={<IconSettings size={15} />}
            onClick={() => setOpen(false)}
          >
            Configuración
          </DropdownLink>
          {isAdmin && (
            <DropdownLink
              to={getRoute("admin")}
              icon={<IconShield size={15} />}
              onClick={() => setOpen(false)}
            >
              Administración
            </DropdownLink>
          )}
          {isTeacher && (
            <DropdownLink
              to={getRoute("teacher-panel")}
              icon={<IconChalkboard size={15} />}
              onClick={() => setOpen(false)}
            >
              Gestionar clases
            </DropdownLink>
          )}
          <hr className="my-1 border-gray-100" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <IconLogout size={15} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

type DropdownLinkProps = {
  to: string;
  icon: React.ReactNode;
  onClick: () => void;
  children: string;
};

export function DropdownLink({
  to,
  icon,
  onClick,
  children,
}: DropdownLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}
