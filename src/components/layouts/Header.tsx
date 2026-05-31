import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import Button from "../controls/Button";
import { LogoWithText } from "../Logo";
import ButtonOutlined from "../controls/ButtonOutlined";
import useAuth from "@contexts/AccessContext";
import useUser from "@contexts/UserContext";
import { UserMenu } from "../auth/UserMenu";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-header sticky top-0 z-50">
      <div className="flex justify-between items-center px-4 py-4 max-w-7xl mx-auto">
        {/* Logo — flex-1 left */}
        <div className="flex-1 flex justify-start">
          <Link to="/" target="_self">
            <LogoWithText textClassName="text-white" />
          </Link>
        </div>

        {/* Nav — flex-1 center — desktop only */}
        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex text-white gap-8">
            <HeaderLink to="/">Inicio</HeaderLink>
            <HeaderLink to="/challenges">Retos</HeaderLink>
            <HeaderLink to="/ranking">Ranking</HeaderLink>
            <HeaderLink to="/media">Recursos</HeaderLink>
          </ul>
        </nav>

        {/* Auth area — flex-1 right — desktop only */}
        <div className="hidden md:flex flex-1 justify-end gap-2">
          <AuthArea />
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden text-white p-2 rounded-md"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden bg-header border-t border-white/10 px-4 pb-4">
          <ul className="flex flex-col text-white gap-4 pt-4">
            <MobileHeaderLink to="/" onNavigate={() => setIsOpen(false)}>Inicio</MobileHeaderLink>
            <MobileHeaderLink to="/challenges" onNavigate={() => setIsOpen(false)}>Retos</MobileHeaderLink>
            <MobileHeaderLink to="/ranking" onNavigate={() => setIsOpen(false)}>Ranking</MobileHeaderLink>
            <MobileHeaderLink to="/media" onNavigate={() => setIsOpen(false)}>Recursos</MobileHeaderLink>
          </ul>
          <div className="mt-6">
            <MobileAuthArea onNavigate={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}

type HeaderLinkProps = {
  children: string;
  to: string;
};

function HeaderLink({ children, to }: HeaderLinkProps) {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <li>
      <Link
        to={to}
        className={`font-semibold transition-colors ${isActive ? "text-white" : "text-header hover:text-white"}`}
      >
        {children}
      </Link>
    </li>
  );
}

type MobileHeaderLinkProps = HeaderLinkProps & { onNavigate: () => void };

function MobileHeaderLink({ children, to, onNavigate }: MobileHeaderLinkProps) {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <li>
      <Link
        to={to}
        onClick={onNavigate}
        className={`font-semibold text-lg transition-colors ${isActive ? "text-white" : "text-header hover:text-white"}`}
      >
        {children}
      </Link>
    </li>
  );
}

// ── Auth area ──────────────────────────────────────────────────────────────────

function AuthArea() {
  const auth = useAuth();
  if (auth?.auth) return <UserMenu variant="dark" />;
  return (
    <>
      <Link to="/access/login">
        <ButtonOutlined>Iniciar Sesión</ButtonOutlined>
      </Link>
      <Link to="/access/register">
        <Button>Registrarse</Button>
      </Link>
    </>
  );
}

// ── Mobile auth area ───────────────────────────────────────────────────────────

type MobileAuthAreaProps = { onNavigate: () => void };

function MobileAuthArea({ onNavigate }: MobileAuthAreaProps) {
  const auth = useAuth();
  const { user } = useUser()!;
  const { setAuth } = auth!;
  const navigate = useNavigate();

  if (!auth?.auth) {
    return (
      <div className="flex flex-col gap-2">
        <Link to="/access/login" onClick={onNavigate}>
          <ButtonOutlined className="w-full justify-center">Iniciar Sesión</ButtonOutlined>
        </Link>
        <Link to="/access/register" onClick={onNavigate}>
          <Button className="w-full justify-center">Registrarse</Button>
        </Link>
      </div>
    );
  }

  function handleLogout() {
    setAuth(null);
    onNavigate();
    navigate("/");
  }

  return (
    <div className="border-t border-white/10 pt-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-black text-sm font-bold shrink-0">
          {user ? `${user.name.charAt(0)}${user.lastName.charAt(0)}` : "?"}
        </span>
        <span className="text-white font-semibold truncate">
          {user ? `${user.name} ${user.lastName}` : "…"}
        </span>
      </div>
      <ul className="flex flex-col gap-3 text-white">
        <MobileDropdownLink to="/profile" icon={<IconUser size={16} />} onNavigate={onNavigate}>
          Perfil
        </MobileDropdownLink>
        <MobileDropdownLink to="/settings" icon={<IconSettings size={16} />} onNavigate={onNavigate}>
          Configuración
        </MobileDropdownLink>
      </ul>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2.5 mt-4 text-red-400 font-semibold"
      >
        <IconLogout size={16} />
        Cerrar sesión
      </button>
    </div>
  );
}

type MobileDropdownLinkProps = {
  to: string;
  icon: React.ReactNode;
  onNavigate: () => void;
  children: string;
};

function MobileDropdownLink({ to, icon, onNavigate, children }: MobileDropdownLinkProps) {
  return (
    <li>
      <Link
        to={to}
        onClick={onNavigate}
        className="flex items-center gap-2.5 font-semibold text-header hover:text-white transition-colors"
      >
        {icon}
        {children}
      </Link>
    </li>
  );
}
