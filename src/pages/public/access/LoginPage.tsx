import Card from "@components/cards/Card";
import Button from "@components/controls/Button";
import ButtonSecondary from "@components/controls/ButtonSecondary";
import InputField from "@components/inputs/InputField";
import AccessHeader from "@components/layouts/AccessHeader";
import Page from "@components/layouts/Page";
import { useNotification } from "@components/notifications/useNotification";
import Column from "@components/placing/Column";
import Row from "@components/placing/Row";
import useAuth from "@contexts/AccessContext";
import AccessService from "@services/AccessService";
import type { AccessCredentials } from "@services/AccessService";
import {
  IconLock,
  IconMail,
  IconSchoolFilled,
  IconSeedingFilled,
  IconTrophyFilled,
  IconUserPlus,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { notify } = useNotification();
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? "/";
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      notify({
        variant: "warning",
        title: "Campos incompletos",
        message: "Rellena el correo y la contraseña para continuar.",
      });
      return;
    }

    try {
      const credentials: AccessCredentials = {
        email: formData.username,
        password: formData.password,
      };
      const data = await AccessService.login(credentials);
      auth?.setAuth({
        id: data.id,
        sessionToken: data.sessionToken,
        refreshToken: data.refreshToken,
        role: data.role,
      });
      notify({
        variant: "success",
        title: "Sesión iniciada",
        message: "Bienvenido de nuevo. Cargando tu perfil…",
      });
      navigate(from, { replace: true });
    } catch (error) {
      notify({
        variant: "error",
        title: "Error al iniciar sesión",
        message: error instanceof Error ? error.message : "Inténtalo de nuevo.",
      });
    }
  };

  return (
    <Page
      header={<AccessHeader />}
      className="flex flex-col justify-between items-center py-10 px-4"
    >
      <Column className="items-center gap-8 w-full">
        <section className="text-center">
          <h1 className="text-3xl font-bold">Únete al cambio</h1>
          <p className="text-secondary">
            Aprende, juega y transforma el planeta. Tu viaje a la sostenibilidad
            comienza aquí.
          </p>
        </section>
        <Card className="w-full max-w-md">
          <div className="space-y-5">
            <div className="space-y-1">
              <Row className="justify-between items-center">
                <h2 className="text-xl font-bold">Iniciar sesión</h2>
                <div className="flex justify-center items-center p-2 bg-button-primary/20 text-primary rounded-full">
                  <IconUserPlus />
                </div>
              </Row>
              <p className="text-sm text-secondary">
                Bienvenido de nuevo. Continúa tu progreso y sube de nivel.
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <Column className="gap-6">
                <Column className="gap-4">
                  <InputField
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(d: string) =>
                      setFormData({ ...formData, username: d })
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
                </Column>
                <Column className="gap-2">
                  <Button type="submit">Iniciar sesión</Button>
                  <Link to="/access/register">
                    <ButtonSecondary className="w-full">
                      Crear una cuenta
                    </ButtonSecondary>
                  </Link>
                </Column>
              </Column>
            </form>
          </div>
        </Card>
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
