import { IconMailForward } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { canInsertEmail, insertNewEmail } from "../../services/Newsletter";
import { getRoute } from "../../utils/RouteUtils";
import StringUtils from "../../utils/StringUtils";
import Button from "../controls/Button";
import Input from "../inputs/Input";
import { LogoWithText } from "../Logo";
import { useNotification } from "../notifications/useNotification";
import Column from "../placing/Column";
import Row from "../placing/Row";

export default function Footer() {
  const [newsLetterState, setNewLetterState] = useState({ email: "" });
  const { notify } = useNotification();

  const onSubmitNewLetter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = newsLetterState.email.trim();

    if (!canInsertEmail(email)) {
      notify({
        variant: "warning",
        message: "Introduce un correo electrónico válido.",
      });
      return;
    }

    try {
      await insertNewEmail(email);
      setNewLetterState({ email: "" });
      notify({
        variant: "success",
        title: "¡Suscrito!",
        message: "Te has suscrito al boletín correctamente.",
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo completar la suscripción.";
      notify({ variant: "error", title: "Error", message });
    }
  };

  return (
    <footer className="bg-footer text-footer px-4 py-6 w-full flex justify-center items-center min-h-64">
      <Column className="justify-center items-center max-w-7xl w-full gap-6">
        <section>
          <Row className="justify-between gap-10">
            <Column className="flex-1 gap-2">
              <Link to="/">
                <LogoWithText />
              </Link>
              <p className="text-footer-secondary text-sm font-medium">
                Empoderando a la próxima generación de líderes ambientales a
                través de la educación y la acción.
              </p>
            </Column>
            <Column className="flex-1 gap-2">
              <FooterTitle>Plataforma</FooterTitle>
              <ul>
                <FooterLink to={getRoute("about")}>Sobre Nosotros</FooterLink>
                <FooterLink to={getRoute("how-it-works")}>
                  Cómo Funciona
                </FooterLink>
                <FooterLink to={getRoute("for-teachers")}>
                  Para Profesores
                </FooterLink>
                <FooterLink to={getRoute("contribute")}>Precios</FooterLink>
              </ul>
            </Column>
            <Column className="flex-1 gap-2">
              <FooterTitle>Recursos</FooterTitle>
              <ul>
                <FooterLink to={getRoute("blog")}>Blog</FooterLink>
                <FooterLink to={getRoute("guides")}>
                  Guías de Reciclaje
                </FooterLink>
                <FooterLink to={getRoute("media")}>Webinars</FooterLink>
                <FooterLink to={getRoute("support")}>Soporte</FooterLink>
              </ul>
            </Column>
            <Column className="flex-1 gap-2">
              <FooterTitle>Boletín</FooterTitle>
              <p className="font-medium text-footer-secondary text-sm">
                Recibe consejos semanales y noticias sobre sostenibilidad
              </p>
              <form onSubmit={onSubmitNewLetter}>
                <Row className="gap-2">
                  <Input
                    variant="dark"
                    value={newsLetterState.email}
                    onChange={(value) => setNewLetterState({ email: value })}
                  >
                    Tu email
                  </Input>
                  <Button type="submit">
                    <IconMailForward />
                  </Button>
                </Row>
              </form>
            </Column>
          </Row>
        </section>
        <hr className="bg-[#9ca3af] border-none h-0.5 w-full" />
        <section className="text-footer-secondary text-sm font-medium w-full">
          <Row className="justify-between w-full">
            <p>© 2026 Edugreen. Todos los derechos reservados</p>
            <ul>
              <Row className="gap-6">
                <FooterLink to={getRoute("privacy")}>Privacidad</FooterLink>
                <FooterLink to={getRoute("use-terms")}>Términos</FooterLink>
                <FooterLink to={getRoute("cookies")}>Cookies</FooterLink>
              </Row>
            </ul>
          </Row>
        </section>
      </Column>
    </footer>
  );
}

type FooterTitleProps = {
  children: string;
};

function FooterTitle({ children }: FooterTitleProps) {
  return <span className="font-semibold">{children}</span>;
}

type FooterLinkProps = {
  children: string;
  className?: string;
  to: string;
};

function FooterLink({ to, className = "", children }: FooterLinkProps) {
  const newClassName = StringUtils.JoinClassName(
    "font-medium text-footer-secondary min-w-link min-h-link text-sm hover:text-footer transition-colors",
    className,
  );
  return (
    <li>
      <Link className={newClassName} to={to}>
        {children}
      </Link>
    </li>
  );
}
