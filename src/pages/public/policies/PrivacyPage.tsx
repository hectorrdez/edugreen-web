import {
  IconShieldLock,
  IconDatabase,
  IconUserCircle,
  IconTrash,
  IconDownload,
  IconEdit,
  IconMail,
} from "@tabler/icons-react";
import Page from "../../../components/layouts/Page";
import Section from "../../../components/placing/Section";
import Column from "../../../components/placing/Column";
import Row from "../../../components/placing/Row";
import Card from "../../../components/cards/Card";

const dataCollected = [
  {
    icon: <IconUserCircle size={28} className="text-primary" />,
    title: "Datos de registro",
    description:
      "Nombre, dirección de correo electrónico y contraseña (almacenada cifrada). Son necesarios para crear y gestionar tu cuenta.",
  },
  {
    icon: <IconDatabase size={28} className="text-primary" />,
    title: "Datos de actividad",
    description:
      "Retos completados, puntuaciones y posición en el ranking. Se usan para ofrecer la experiencia de gamificación de la plataforma.",
  },
  {
    icon: <IconShieldLock size={28} className="text-primary" />,
    title: "Datos técnicos",
    description:
      "Dirección IP y navegador, recogidos automáticamente para garantizar la seguridad y el correcto funcionamiento del servicio.",
  },
];

const userRights = [
  {
    icon: <IconUserCircle size={22} className="text-primary" />,
    title: "Acceso",
    description: "Solicitar en cualquier momento qué datos tuyos almacenamos.",
  },
  {
    icon: <IconEdit size={22} className="text-primary" />,
    title: "Rectificación",
    description: "Corregir datos incorrectos o incompletos desde tu perfil.",
  },
  {
    icon: <IconTrash size={22} className="text-primary" />,
    title: "Supresión",
    description: "Pedir la eliminación de tu cuenta y todos tus datos.",
  },
  {
    icon: <IconDownload size={22} className="text-primary" />,
    title: "Portabilidad",
    description: "Recibir una copia de tus datos en formato legible por máquina.",
  },
];

export default function PrivacyPage() {
  return (
    <Page>
      {/* Hero */}
      <Section
        className="bg-header"
        containerClassName="py-20 px-6 gap-4 items-center text-center"
      >
        <IconShieldLock size={48} className="text-primary" />
        <h1 className="text-4xl font-bold text-white max-w-2xl leading-tight">
          Política de <span className="text-primary">Privacidad</span>
        </h1>
        <p className="text-gray-400 max-w-xl text-lg">
          Explicamos qué datos recopilamos, por qué lo hacemos y cómo puedes
          ejercer tus derechos sobre ellos.
        </p>
        <p className="text-gray-500 text-sm">Última actualización: mayo 2026</p>
      </Section>

      {/* Responsable y base legal */}
      <Section containerClassName="py-16 px-6 gap-6">
        <Row className="gap-12 flex-wrap items-start">
          <Column className="flex-1 min-w-70 gap-4">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              Responsable
            </span>
            <h2 className="text-3xl font-bold text-secondary leading-tight">
              ¿Quién trata tus datos?
            </h2>
            <p className="text-gray-500 leading-relaxed">
              El responsable del tratamiento es Héctor Rodríguez, titular del
              proyecto EduGreen, contactable en{" "}
              <span className="text-secondary font-medium">
                hectorrdez@gmail.com
              </span>
              .
            </p>
            <p className="text-gray-500 leading-relaxed">
              EduGreen es un proyecto educativo de fin de ciclo y no persigue
              fines comerciales. Los datos se tratan exclusivamente para
              prestar el servicio descrito en esta política.
            </p>
          </Column>
          <Column className="flex-1 min-w-70 gap-4">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              Base legal
            </span>
            <h2 className="text-3xl font-bold text-secondary leading-tight">
              ¿Por qué podemos tratar tus datos?
            </h2>
            <p className="text-gray-500 leading-relaxed">
              El tratamiento se basa en la relación contractual que se establece
              al aceptar los Términos de Uso al registrarte. Sin estos datos no
              es posible ofrecer el servicio.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Para los datos de carácter analítico, la base legal es tu
              consentimiento expreso, que puedes retirar en cualquier momento
              desde la configuración de cookies.
            </p>
          </Column>
        </Row>
      </Section>

      {/* Datos que recopilamos */}
      <Section className="bg-card" containerClassName="py-16 px-6 gap-10">
        <Column className="items-center text-center gap-2">
          <h2 className="text-3xl font-bold text-secondary">
            Datos que recopilamos
          </h2>
          <p className="text-gray-500 max-w-lg">
            Solo recogemos lo estrictamente necesario para que la plataforma
            funcione.
          </p>
        </Column>
        <Row className="gap-6 flex-wrap justify-center">
          {dataCollected.map(({ icon, title, description }) => (
            <Card
              key={title}
              className="flex-1 min-w-[220px] max-w-[300px] flex flex-col gap-4"
            >
              {icon}
              <h3 className="text-lg font-semibold text-secondary">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {description}
              </p>
            </Card>
          ))}
        </Row>
      </Section>

      {/* Conservación y terceros */}
      <Section containerClassName="py-16 px-6 gap-6">
        <Row className="gap-12 flex-wrap items-start">
          <Column className="flex-1 min-w-70 gap-4">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              Conservación
            </span>
            <h2 className="text-3xl font-bold text-secondary leading-tight">
              ¿Cuánto tiempo guardamos tus datos?
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Tus datos se conservan mientras tu cuenta esté activa. Si la
              eliminas, borraremos toda tu información en un plazo máximo de 30
              días, salvo obligación legal en contrario.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Los registros técnicos de seguridad se conservan durante 90 días
              y se eliminan automáticamente.
            </p>
          </Column>
          <Column className="flex-1 min-w-70 gap-4">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              Terceros
            </span>
            <h2 className="text-3xl font-bold text-secondary leading-tight">
              ¿Compartimos tus datos?
            </h2>
            <p className="text-gray-500 leading-relaxed">
              No vendemos ni cedemos tus datos a terceros con fines
              publicitarios. Únicamente podríamos compartirlos con proveedores
              de infraestructura (alojamiento, base de datos) bajo acuerdos de
              confidencialidad.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Si la ley nos obligase a facilitar datos a una autoridad, lo
              haríamos exclusivamente en la medida requerida.
            </p>
          </Column>
        </Row>
      </Section>

      {/* Derechos del usuario */}
      <Section className="bg-card" containerClassName="py-16 px-6 gap-10">
        <Column className="items-center text-center gap-2">
          <h2 className="text-3xl font-bold text-secondary">Tus derechos</h2>
          <p className="text-gray-500 max-w-lg">
            El RGPD y la LOPDGDD te reconocen los siguientes derechos sobre tus
            datos. Puedes ejercerlos escribiéndonos al correo indicado.
          </p>
        </Column>
        <Row className="gap-4 flex-wrap justify-center">
          {userRights.map(({ icon, title, description }) => (
            <Card
              key={title}
              className="flex-1 min-w-[180px] max-w-[240px] flex flex-col gap-3"
            >
              <Row className="gap-2 items-center">
                {icon}
                <span className="font-semibold text-secondary">{title}</span>
              </Row>
              <p className="text-gray-500 text-sm leading-relaxed">
                {description}
              </p>
            </Card>
          ))}
        </Row>
      </Section>

      {/* Contacto */}
      <Section
        className="bg-header"
        containerClassName="py-20 px-6 items-center text-center gap-6"
      >
        <h2 className="text-3xl font-bold text-white">
          ¿Quieres ejercer tus derechos?
        </h2>
        <p className="text-gray-400 max-w-md">
          Escríbenos indicando tu solicitud y te responderemos en un plazo
          máximo de 30 días.
        </p>
        <Row className="gap-3 items-center">
          <IconMail size={20} className="text-primary" />
          <span className="text-gray-300">hectorrdez@gmail.com</span>
        </Row>
      </Section>
    </Page>
  );
}
