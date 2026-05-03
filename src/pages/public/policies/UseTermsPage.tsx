import {
  IconFileText,
  IconUserCheck,
  IconBan,
  IconLock,
  IconAlertTriangle,
  IconMail,
} from "@tabler/icons-react";
import Page from "../../../components/layouts/Page";
import Section from "../../../components/placing/Section";
import Column from "../../../components/placing/Column";
import Row from "../../../components/placing/Row";
import Card from "../../../components/cards/Card";

const obligations = [
  {
    icon: <IconUserCheck size={28} className="text-primary" />,
    title: "Uso responsable",
    description:
      "Usar la plataforma de forma honesta, respetando a otros usuarios y el contenido publicado por profesores y compañeros.",
  },
  {
    icon: <IconBan size={28} className="text-primary" />,
    title: "Conductas prohibidas",
    description:
      "Queda prohibido suplantar identidades, manipular el ranking, publicar contenido ofensivo o intentar acceder a cuentas ajenas.",
  },
  {
    icon: <IconLock size={28} className="text-primary" />,
    title: "Seguridad de la cuenta",
    description:
      "Eres responsable de mantener tus credenciales seguras y de notificarnos cualquier acceso no autorizado a tu cuenta.",
  },
];

export default function UseTermsPage() {
  return (
    <Page>
      {/* Hero */}
      <Section
        className="bg-header"
        containerClassName="py-20 px-6 gap-4 items-center text-center"
      >
        <IconFileText size={48} className="text-primary" />
        <h1 className="text-4xl font-bold text-white max-w-2xl leading-tight">
          Términos de <span className="text-primary">Uso</span>
        </h1>
        <p className="text-gray-400 max-w-xl text-lg">
          Al acceder a EduGreen aceptas estas condiciones. Te recomendamos
          leerlas antes de registrarte o usar la plataforma.
        </p>
        <p className="text-gray-500 text-sm">Última actualización: mayo 2026</p>
      </Section>

      {/* Objeto y acceso */}
      <Section containerClassName="py-16 px-6 gap-6">
        <Row className="gap-12 flex-wrap items-start">
          <Column className="flex-1 min-w-70 gap-4">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              Objeto
            </span>
            <h2 className="text-3xl font-bold text-secondary leading-tight">
              ¿Qué regula este documento?
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Estos términos establecen las condiciones bajo las que puedes
              acceder y usar EduGreen, la plataforma de gamificación educativa
              orientada a la sostenibilidad medioambiental.
            </p>
            <p className="text-gray-500 leading-relaxed">
              El uso continuado de la plataforma implica la aceptación de estas
              condiciones en su versión vigente. Si no estás de acuerdo, debes
              abstenerte de usar el servicio.
            </p>
          </Column>
          <Column className="flex-1 min-w-70 gap-4">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              Acceso
            </span>
            <h2 className="text-3xl font-bold text-secondary leading-tight">
              ¿Quién puede registrarse?
            </h2>
            <p className="text-gray-500 leading-relaxed">
              EduGreen está dirigido a estudiantes y profesores de entornos
              educativos. Los menores de 14 años deben contar con autorización
              de sus tutores legales para registrarse.
            </p>
            <p className="text-gray-500 leading-relaxed">
              La plataforma se reserva el derecho de suspender cuentas que
              incumplan estos términos o que hayan sido creadas con datos
              falsos.
            </p>
          </Column>
        </Row>
      </Section>

      {/* Obligaciones del usuario */}
      <Section className="bg-card" containerClassName="py-16 px-6 gap-10">
        <Column className="items-center text-center gap-2">
          <h2 className="text-3xl font-bold text-secondary">
            Obligaciones del usuario
          </h2>
          <p className="text-gray-500 max-w-lg">
            Al usar EduGreen te comprometes a cumplir estas condiciones básicas
            de convivencia y seguridad.
          </p>
        </Column>
        <Row className="gap-6 flex-wrap justify-center">
          {obligations.map(({ icon, title, description }) => (
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

      {/* Propiedad intelectual y responsabilidad */}
      <Section containerClassName="py-16 px-6 gap-6">
        <Row className="gap-12 flex-wrap items-start">
          <Column className="flex-1 min-w-70 gap-4">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              Propiedad intelectual
            </span>
            <h2 className="text-3xl font-bold text-secondary leading-tight">
              Contenido de la plataforma
            </h2>
            <p className="text-gray-500 leading-relaxed">
              El código, el diseño y los textos propios de EduGreen están
              protegidos. No está permitida su reproducción total o parcial sin
              autorización expresa del titular.
            </p>
            <p className="text-gray-500 leading-relaxed">
              El contenido creado por profesores (retos, materiales) pertenece a
              sus autores. EduGreen únicamente actúa como plataforma de
              distribución.
            </p>
          </Column>
          <Column className="flex-1 min-w-70 gap-4">
            <Row className="gap-3 items-center">
              <IconAlertTriangle size={22} className="text-primary shrink-0" />
              <span className="text-sm font-semibold text-primary uppercase tracking-widest">
                Limitación de responsabilidad
              </span>
            </Row>
            <h2 className="text-3xl font-bold text-secondary leading-tight">
              Exención de garantías
            </h2>
            <p className="text-gray-500 leading-relaxed">
              EduGreen se ofrece "tal cual", sin garantías de disponibilidad
              continua. No nos hacemos responsables de pérdidas de datos
              derivadas de fallos técnicos ajenos a nuestra voluntad.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Tampoco somos responsables del contenido publicado por usuarios o
              de los enlaces a sitios externos que puedan aparecer en la
              plataforma.
            </p>
          </Column>
        </Row>
      </Section>

      {/* Contacto */}
      <Section
        className="bg-header"
        containerClassName="py-20 px-6 items-center text-center gap-6"
      >
        <h2 className="text-3xl font-bold text-white">¿Alguna pregunta?</h2>
        <p className="text-gray-400 max-w-md">
          Si tienes dudas sobre estos términos o quieres ejercer algún derecho,
          puedes escribirnos directamente.
        </p>
        <Row className="gap-3 items-center">
          <IconMail size={20} className="text-primary" />
          <span className="text-gray-300">hectorrdez@gmail.com</span>
        </Row>
      </Section>
    </Page>
  );
}
