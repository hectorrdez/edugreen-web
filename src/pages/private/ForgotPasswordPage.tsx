import Card from "@components/cards/Card";
import Button from "@components/controls/Button";
import ButtonSecondary from "@components/controls/ButtonSecondary";
import InputField from "@components/inputs/InputField";
import AccessHeader from "@components/layouts/AccessHeader";
import Page from "@components/layouts/Page";
import { useNotification } from "@components/notifications/useNotification";
import Column from "@components/placing/Column";
import Row from "@components/placing/Row";
import AccessService from "@services/AccessService";
import {
  IconLock,
  IconMail,
  IconMailCheck,
  IconSchoolFilled,
  IconSeedingFilled,
  IconTrophyFilled,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

type PageState = "email-form" | "email-sent" | "change-password";

export default function ForgotPasswordPage() {
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t");

  const [pageState, setPageState] = useState<PageState>(
    token ? "change-password" : "email-form"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      notify({
        variant: "warning",
        title: "Campo incompleto",
        message: "Introduce tu correo electrónico.",
      });
      return;
    }
    setIsLoading(true);
    try {
      await AccessService.forgotPassword(email);
      setPageState("email-sent");
    } catch (error) {
      notify({
        variant: "error",
        title: "Error",
        message:
          error instanceof Error ? error.message : "Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwords.password || !passwords.confirmPassword) {
      notify({
        variant: "warning",
        title: "Campos incompletos",
        message: "Rellena ambas contraseñas.",
      });
      return;
    }
    if (passwords.password !== passwords.confirmPassword) {
      notify({
        variant: "warning",
        title: "Las contraseñas no coinciden",
        message: "Comprueba que ambas contraseñas sean iguales.",
      });
      return;
    }
    setIsLoading(true);
    try {
      await AccessService.changePassword(token!, passwords.password);
      notify({
        variant: "success",
        title: "Contraseña actualizada",
        message: "Inicia sesión con tu nueva contraseña.",
      });
      navigate("/access/login", { replace: true });
    } catch (error) {
      notify({
        variant: "error",
        title: "Error al cambiar contraseña",
        message:
          error instanceof Error
            ? error.message
            : "El enlace no es válido o ha expirado.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page
      header={<AccessHeader />}
      className="flex flex-col justify-between items-center py-10 px-4 gap-8"
    >
      <Column className="items-center gap-8 w-full">
        <section className="text-center">
          <h1 className="text-3xl font-bold">Recuperar contraseña</h1>
          <p className="text-secondary">
            {pageState === "change-password"
              ? "Introduce tu nueva contraseña para continuar."
              : "Te enviaremos un enlace para restablecer tu contraseña."}
          </p>
        </section>

        {pageState === "email-form" && (
          <Card className="w-full max-w-md">
            <div className="space-y-5">
              <div className="space-y-1">
                <Row className="justify-between items-center">
                  <h2 className="text-xl font-bold">Olvidé mi contraseña</h2>
                  <div className="flex justify-center items-center p-2 bg-button-primary/20 text-primary rounded-full">
                    <IconMail />
                  </div>
                </Row>
                <p className="text-sm text-secondary">
                  Introduce tu correo y te enviaremos las instrucciones.
                </p>
              </div>
              <form onSubmit={handleEmailSubmit}>
                <Column className="gap-6">
                  <InputField
                    id="email"
                    type="text"
                    value={email}
                    onChange={(d: string) => setEmail(d)}
                    placeholder="estudiante@escuela.edu"
                    icon={<IconMail />}
                  >
                    Correo electrónico
                  </InputField>
                  <Column className="gap-2">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Enviando..." : "Enviar enlace"}
                    </Button>
                    <Link to="/access/login">
                      <ButtonSecondary className="w-full">
                        Volver al inicio de sesión
                      </ButtonSecondary>
                    </Link>
                  </Column>
                </Column>
              </form>
            </div>
          </Card>
        )}

        {pageState === "email-sent" && (
          <Card className="w-full max-w-sm">
            <Column className="items-center gap-4 text-center">
              <div className="flex justify-center items-center p-4 bg-button-primary/20 text-primary rounded-full">
                <IconMailCheck size={40} />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold">Revisa tu correo</h2>
                <p className="text-sm text-secondary">
                  Te hemos enviado un enlace a{" "}
                  <span className="font-semibold text-foreground">{email}</span>
                  . Haz clic en él para restablecer tu contraseña.
                </p>
              </div>
              <Link to="/access/login" className="w-full">
                <ButtonSecondary className="w-full">
                  Volver al inicio de sesión
                </ButtonSecondary>
              </Link>
            </Column>
          </Card>
        )}

        {pageState === "change-password" && (
          <Card className="w-full max-w-md">
            <div className="space-y-5">
              <div className="space-y-1">
                <Row className="justify-between items-center">
                  <h2 className="text-xl font-bold">Nueva contraseña</h2>
                  <div className="flex justify-center items-center p-2 bg-button-primary/20 text-primary rounded-full">
                    <IconLock />
                  </div>
                </Row>
                <p className="text-sm text-secondary">
                  Elige una contraseña segura para tu cuenta.
                </p>
              </div>
              <form onSubmit={handlePasswordSubmit}>
                <Column className="gap-6">
                  <Column className="gap-4">
                    <InputField
                      id="password"
                      type="password"
                      value={passwords.password}
                      onChange={(d: string) =>
                        setPasswords({ ...passwords, password: d })
                      }
                      placeholder="************"
                      icon={<IconLock />}
                    >
                      Nueva contraseña
                    </InputField>
                    <InputField
                      id="confirmPassword"
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(d: string) =>
                        setPasswords({ ...passwords, confirmPassword: d })
                      }
                      placeholder="************"
                      icon={<IconLock />}
                    >
                      Confirmar contraseña
                    </InputField>
                  </Column>
                  <Column className="gap-2">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Guardando..." : "Cambiar contraseña"}
                    </Button>
                    <Link to="/access/login">
                      <ButtonSecondary className="w-full">
                        Volver al inicio de sesión
                      </ButtonSecondary>
                    </Link>
                  </Column>
                </Column>
              </form>
            </div>
          </Card>
        )}
      </Column>

      <section>
        <Row className="gap-8 items-center">
          <AppFeature icon={<IconTrophyFilled size={32} />}>
            Gamificado
          </AppFeature>
          <div className="w-px h-12 bg-gray-300" />
          <AppFeature icon={<IconSchoolFilled size={32} />}>
            Educativo
          </AppFeature>
          <div className="w-px h-12 bg-gray-300" />
          <AppFeature icon={<IconSeedingFilled size={32} />}>
            Sostenible
          </AppFeature>
        </Row>
      </section>
    </Page>
  );
}

type AppFeatureProps = {
  children: string;
  icon: any;
};

function AppFeature({ children, icon }: AppFeatureProps) {
  return (
    <Column className="text-secondary/70 items-center gap-1">
      {icon}
      <span className="font-semibold">{children}</span>
    </Column>
  );
}
