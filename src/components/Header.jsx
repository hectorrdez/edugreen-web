import { Link } from "react-router-dom";
import ButtonLink from "../composables/controls/ButtonLink";
import useAuth from "../contexts/AuthContext";
import Row from "../layouts/row/Row";
import Section from "../layouts/Section";
import HeaderLogo from "../assets/isologo-w.png";

export default function Header() {
  const { isLogged } = useAuth();
  return (
    <header className="bg-green-600 sticky top-0 z-50">
      <Section>
        <Row className="justify-between">
          <Link to="/">
            <img src={HeaderLogo} alt="Logo" className="w-50" />
          </Link>
          <nav className="text-white">
            <ul>
              <Row className="gap-4 items-center font-semibold">
                <li>
                  <Link to="/challenges">Retos</Link>
                </li>
                <li>
                  <Link to="/rankings">Rankings</Link>
                </li>
                {isLogged ? (
                  <li>
                    <Link to="/profile">Perfil</Link>
                  </li>
                ) : (
                  <li className="flex gap-2">
                    <ButtonLink to="/login">Iniciar sesión</ButtonLink>
                    <ButtonLink to="/register">Registrarse</ButtonLink>
                  </li>
                )}
              </Row>
            </ul>
          </nav>
        </Row>
      </Section>
    </header>
  );
}
