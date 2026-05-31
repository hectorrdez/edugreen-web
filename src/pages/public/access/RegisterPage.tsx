import {
  IconLock,
  IconLogin,
  IconMail,
  IconMailCheck,
  IconSchoolFilled,
  IconSeedingFilled,
  IconTrophyFilled,
  IconUser,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import InstitutionService from "@services/InstitutionService";

type PageState = "form" | "email-sent" | "verifying";

export default function RegisterPage() {
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pageState, setPageState] = useState<PageState>("form");
  const [isLoading, setIsLoading] = useState(false);
  const confirmCalledRef = useRef(false);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = searchParams.get("t");
    if (!token || confirmCalledRef.current) return;

    confirmCalledRef.current = true;
    setPageState("verifying");
    setIsLoading(true);
    AccessService.confirmRegister(token)
      .then(() => {
        notify({
          variant: "success",
          title: "Cuenta verificada",
          message: "Tu cuenta está activa. Inicia sesión para continuar.",
        });
        navigate("/access/login", { replace: true });
      })
      .catch((error) => {
        notify({
          variant: "error",
          title: "Verificación fallida",
          message:
            error instanceof Error
              ? error.message
              : "El enlace no es válido o ha expirado.",
        });
        setPageState("form");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      notify({
        variant: "warning",
        title: "Campos incompletos",
        message: "Rellena todos los campos para continuar.",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      notify({
        variant: "warning",
        title: "Las contraseñas no coinciden",
        message: "Comprueba que ambas contraseñas sean iguales.",
      });
      return;
    }

    const domain = formData.email.split("@")[1];
    if (!domain) {
      notify({
        variant: "warning",
        title: "Email inválido",
        message: "Introduce un correo electrónico válido.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await InstitutionService.searchByDomain(domain);
    } catch {
      notify({
        variant: "error",
        title: "Institución no reconocida",
        message:
          "El dominio de tu correo no está registrado en ninguna institución.",
      });
      setIsLoading(false);
      return;
    }

    try {
      await AccessService.register({
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      setPageState("email-sent");
    } catch (error) {
      notify({
        variant: "error",
        title: "Error al registrarse",
        message: error instanceof Error ? error.message : "Inténtalo de nuevo.",
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
          <h1 className="text-3xl font-bold">Crea tu cuenta</h1>
          <p className="text-secondary">
            Únete a la comunidad y comienza tu camino hacia un futuro más verde.
          </p>
        </section>

        {pageState === "form" && (
          <Card className="w-full max-w-md">
            <div className="space-y-5">
              <div className="space-y-1">
                <Row className="justify-between items-center">
                  <h2 className="text-xl font-bold">Registrarse</h2>
                  <div className="flex justify-center items-center p-2 bg-button-primary/20 text-primary rounded-full">
                    <IconLogin />
                  </div>
                </Row>
                <p className="text-sm text-secondary">
                  Completa tus datos para empezar a aprender y ganar puntos.
                </p>
              </div>
              <form onSubmit={handleSubmit}>
                <Column className="gap-6">
                  <Column className="gap-4">
                    <InputField
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(d: string) =>
                        setFormData({ ...formData, name: d })
                      }
                      placeholder="Tu nombre"
                      icon={<IconUser />}
                    >
                      Nombre
                    </InputField>
                    <InputField
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(d: string) =>
                        setFormData({ ...formData, lastName: d })
                      }
                      placeholder="Tus apellidos"
                      icon={<IconUser />}
                    >
                      Apellidos
                    </InputField>
                    <InputField
                      id="email"
                      type="text"
                      value={formData.email}
                      onChange={(d: string) =>
                        setFormData({ ...formData, email: d })
                      }
                      placeholder="estudiante@escuela.edu"
                      icon={<IconMail />}
                    >
                      Correo electrónico
                    </InputField>
                    <InputField
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(d: string) =>
                        setFormData({ ...formData, password: d })
                      }
                      placeholder="************"
                      icon={<IconLock />}
                    >
                      Contraseña
                    </InputField>
                    <InputField
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(d: string) =>
                        setFormData({ ...formData, confirmPassword: d })
                      }
                      placeholder="************"
                      icon={<IconLock />}
                    >
                      Confirmar contraseña
                    </InputField>
                  </Column>
                  <Column className="gap-2">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Verificando..." : "Crear cuenta"}
                    </Button>
                    <Link to="/access/login">
                      <ButtonSecondary className="w-full">
                        Ya tengo una cuenta
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
                  Te hemos enviado un enlace de verificación a{" "}
                  <span className="font-semibold text-foreground">
                    {formData.email}
                  </span>
                  . Haz clic en el enlace para activar tu cuenta.
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

        {pageState === "verifying" && (
          <Card className="w-full max-w-sm">
            <Column className="items-center gap-4 text-center">
              <div className="flex justify-center items-center p-4 bg-button-primary/20 text-primary rounded-full">
                <IconMailCheck size={40} />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold">Verificando cuenta…</h2>
                <p className="text-sm text-secondary">
                  Estamos activando tu cuenta. Un momento.
                </p>
              </div>
            </Column>
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
