import {
  IconChartBar,
  IconCookie,
  IconMail,
  IconSettings,
  IconShieldCheck,
} from "@tabler/icons-react";
import Card from "../../../components/cards/Card";
import Page from "../../../components/layouts/Page";
import Column from "../../../components/placing/Column";
import Row from "../../../components/placing/Row";
import Section from "../../../components/placing/Section";

const cookieTypes = [
  {
    icon: <IconShieldCheck size={28} className="text-primary" />,
    title: "Cookies técnicas",
    description:
      "Necesarias para el funcionamiento básico de la plataforma. Sin ellas no es posible navegar ni autenticarse. No requieren consentimiento.",
  },
  {
    icon: <IconChartBar size={28} className="text-primary" />,
    title: "Cookies analíticas",
    description:
      "Nos permiten medir el uso de la plataforma de forma agregada y anónima para mejorar la experiencia. Se activan solo con tu consentimiento.",
  },
  {
    icon: <IconSettings size={28} className="text-primary" />,
    title: "Cookies de preferencias",
    description:
      "Guardan configuraciones como el idioma o el tema seleccionado para que no tengas que indicarlos en cada visita.",
  },
];

const browserGuides = [
  { name: "Chrome", path: "Configuración → Privacidad → Cookies" },
  { name: "Firefox", path: "Ajustes → Privacidad → Cookies y datos" },
  { name: "Safari", path: "Preferencias → Privacidad → Gestionar datos" },
  { name: "Edge", path: "Configuración → Privacidad → Cookies del sitio" },
];

export default function CookiesPage() {
  return (
    <Page>
      {/* Hero */}
      <Section
        className="bg-header"
        containerClassName="py-20 px-6 gap-4 items-center text-center"
      >
        <IconCookie size={48} className="text-primary" />
        <h1 className="text-4xl font-bold text-white max-w-2xl leading-tight">
          Política de <span className="text-primary">Cookies</span>
        </h1>
        <p className="text-gray-400 max-w-xl text-lg">
          Explicamos qué son las cookies, cuáles usamos en EduGreen y cómo
          puedes gestionarlas desde tu navegador.
        </p>
        <p className="text-gray-500 text-sm">Última actualización: mayo 2026</p>
      </Section>

      {/* Qué son las cookies */}
      <Section containerClassName="py-16 px-6 gap-6">
        <Row className="gap-12 flex-wrap items-start">
          <Column className="flex-1 min-w-70 gap-4">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              Definición
            </span>
            <h2 className="text-3xl font-bold text-secondary leading-tight">
              ¿Qué son las cookies?
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Las cookies son pequeños archivos de texto que un sitio web
              almacena en tu dispositivo cuando lo visitas. Sirven para recordar
              información sobre tu sesión, preferencias o comportamiento de
              navegación.
            </p>
            <p className="text-gray-500 leading-relaxed">
              No contienen código ejecutable ni virus. Su único propósito es
              hacer que la experiencia sea más coherente y personalizada entre
              visitas.
            </p>
          </Column>
          <Column className="flex-1 min-w-70 gap-4">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              Nuestro uso
            </span>
            <h2 className="text-3xl font-bold text-secondary leading-tight">
              ¿Para qué las usamos?
            </h2>
            <p className="text-gray-500 leading-relaxed">
              En EduGreen utilizamos cookies únicamente para lo esencial:
              mantener tu sesión activa, recordar preferencias de interfaz y, si
              lo consientes, obtener métricas anónimas que nos ayuden a mejorar
              la plataforma.
            </p>
            <p className="text-gray-500 leading-relaxed">
              No compartimos ningún dato de cookies con terceros con fines
              publicitarios.
            </p>
          </Column>
        </Row>
      </Section>

      {/* Tipos de cookies */}
      <Section className="bg-card" containerClassName="py-16 px-6 gap-10">
        <Column className="items-center text-center gap-2">
          <h2 className="text-3xl font-bold text-secondary">
            Tipos de cookies que usamos
          </h2>
          <p className="text-gray-500 max-w-lg">
            Clasificamos las cookies según su finalidad y necesidad de
            consentimiento.
          </p>
        </Column>
        <Row className="gap-6 flex-wrap justify-center">
          {cookieTypes.map(({ icon, title, description }) => (
            <Card
              key={title}
              className="flex-1 min-w-55 max-w-75 flex flex-col gap-4"
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

      {/* Cómo gestionarlas */}
      <Section containerClassName="py-16 px-6 gap-10">
        <Column className="items-center text-center gap-2">
          <h2 className="text-3xl font-bold text-secondary">
            Cómo gestionar las cookies
          </h2>
          <p className="text-gray-500 max-w-lg">
            Puedes aceptar, rechazar o eliminar las cookies desde la
            configuración de tu navegador. Aquí te indicamos dónde encontrar esa
            opción en los más habituales.
          </p>
        </Column>
        <Row className="gap-4 flex-wrap justify-center">
          {browserGuides.map(({ name, path }) => (
            <Card key={name} className="flex flex-col gap-2 min-w-45">
              <span className="font-semibold text-secondary">{name}</span>
              <span className="text-gray-500 text-sm">{path}</span>
            </Card>
          ))}
        </Row>
        <Row className="justify-center">
          <p className="text-gray-500 text-sm text-center max-w-xl">
            Ten en cuenta que desactivar ciertas cookies puede afectar al
            funcionamiento de algunas partes de la plataforma.
          </p>
        </Row>
      </Section>

      {/* Contacto */}
      <Section
        className="bg-header"
        containerClassName="py-20 px-6 items-center text-center gap-6"
      >
        <h2 className="text-3xl font-bold text-white">¿Tienes alguna duda?</h2>
        <p className="text-gray-400 max-w-md">
          Si quieres saber más sobre cómo tratamos los datos o ejercer tus
          derechos, puedes contactarnos directamente.
        </p>
        <Row className="gap-3 items-center">
          <IconMail size={20} className="text-primary" />
          <span className="text-gray-300">hectorrdez@gmail.com</span>
        </Row>
      </Section>
    </Page>
  );
}
