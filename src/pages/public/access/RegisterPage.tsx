import {
  IconLock,
  IconLogin,
  IconMail,
  IconSchoolFilled,
  IconSeedingFilled,
  IconTrophyFilled,
  IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../../components/cards/Card";
import Button from "../../../components/controls/Button";
import ButtonSecondary from "../../../components/controls/ButtonSecondary";
import InputField from "../../../components/inputs/InputField";
import AccessHeader from "../../../components/layouts/AccessHeader";
import Page from "../../../components/layouts/Page";
import Column from "../../../components/placing/Column";
import Row from "../../../components/placing/Row";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  return (
    <Page
      customHeader
      className="flex flex-col justify-between items-center py-10 px-4"
    >
      <AccessHeader />
      <Column className="items-center gap-8 w-full">
        <section className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Crea tu cuenta</h1>
          <p className="text-secondary">
            Únete a la comunidad y comienza tu camino hacia un futuro más verde.
          </p>
        </section>
        <Card className="w-full max-w-sm">
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
            <form>
              <Column className="gap-6">
                <Column className="gap-4">
                  <InputField
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(d: string) =>
                      setFormData({ ...formData, name: d })
                    }
                    placeholder="Tu nombre completo"
                    icon={<IconUser />}
                  >
                    Nombre completo
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
                  <Button type="submit">Crear cuenta</Button>
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
