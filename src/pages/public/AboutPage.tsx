import Page from "../../components/layouts/Page";
import Section from "../../components/placing/Section";
import Row from "../../components/placing/Row";
import Column from "../../components/placing/Column";
import Card from "../../components/cards/Card";
import ButtonLink from "../../components/controls/ButtonLink";
import { LogoWithText } from "../../components/Logo";
import {
  IconCode,
  IconLeaf,
  IconSchool,
  IconBrandReact,
  IconBrandTypescript,
  IconDatabase,
  IconMail,
  IconBolt,
  IconPalette,
} from "@tabler/icons-react";

const motivations = [
  {
    icon: <IconSchool size={28} className="text-primary" />,
    title: "Aprendizaje continuo",
    description:
      "Este proyecto nació del deseo de aplicar todo lo aprendido en el ciclo y seguir creciendo como desarrollador.",
  },
  {
    icon: <IconLeaf size={28} className="text-primary" />,
    title: "Propósito real",
    description:
      "Elegí la sostenibilidad como temática porque creo que la tecnología debe servir para algo más que entretener.",
  },
  {
    icon: <IconCode size={28} className="text-primary" />,
    title: "Código con cuidado",
    description:
      "Cada decisión técnica tiene una razón: componentes reutilizables, tipado estricto y una arquitectura pensada para crecer.",
  },
];

const stack = [
  {
    icon: <IconBrandReact size={24} className="text-primary" />,
    name: "React 19",
  },
  {
    icon: <IconBrandTypescript size={24} className="text-primary" />,
    name: "TypeScript",
  },
  { icon: <IconBolt size={24} className="text-primary" />, name: "Vite" },
  {
    icon: <IconPalette size={24} className="text-primary" />,
    name: "Tailwind CSS",
  },
  { icon: <IconDatabase size={24} className="text-primary" />, name: "SQL" },
];

export default function AboutPage() {
  return (
    <Page>
      {/* Hero */}
      <Section
        className="bg-header"
        containerClassName="py-24 px-6 gap-5 items-center text-center"
      >
        <LogoWithText
          textClassName="text-white text-3xl"
          iconClassName="text-primary"
        />
        <h1 className="text-4xl font-bold text-white max-w-2xl leading-tight mt-4">
          Hola, soy <span className="text-primary">Héctor Rodríguez</span>
        </h1>
        <p className="text-gray-400 max-w-xl text-lg">
          Desarrollador web en formación. EduGreen es mi Proyecto de Fin de
          Ciclo del Grado Superior en Desarrollo de Aplicaciones Web.
        </p>
      </Section>

      {/* El proyecto + El contexto */}
      <Section containerClassName="py-16 px-6 gap-8">
        <Row className="gap-12 flex-wrap items-start">
          <Column className="flex-1 min-w-70 gap-4">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              El proyecto
            </span>
            <h2 className="text-3xl font-bold text-secondary leading-tight">
              ¿Qué es EduGreen?
            </h2>
            <p className="text-gray-500 leading-relaxed">
              EduGreen es una plataforma web educativa centrada en la
              concienciación medioambiental. Permite a profesores crear clases y
              retos ecológicos, y a estudiantes completarlos para ganar puntos y
              escalar en un ranking.
            </p>
            <p className="text-gray-500 leading-relaxed">
              La idea surgió de querer combinar dos temas que me importan: la
              educación y el medio ambiente. La gamificación fue la pieza que
              encajó para hacer el aprendizaje más motivador.
            </p>
          </Column>
          <Column className="flex-1 min-w-70 gap-4">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              El contexto
            </span>
            <h2 className="text-3xl font-bold text-secondary leading-tight">
              Proyecto de Fin de Ciclo
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Este proyecto representa el trabajo final del Ciclo Formativo de
              Grado Superior en{" "}
              <strong>Desarrollo de Aplicaciones Web (DAW)</strong>. Es el
              resultado de dos años aprendiendo a diseñar, desarrollar y
              desplegar aplicaciones web completas.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Desde el modelado de la base de datos hasta la interfaz de
              usuario, todo ha sido diseñado y desarrollado de forma individual.
            </p>
          </Column>
        </Row>
      </Section>

      {/* Motivaciones */}
      <Section className="bg-card" containerClassName="py-16 px-6 gap-10">
        <Column className="items-center text-center gap-2">
          <h2 className="text-3xl font-bold text-secondary">
            ¿Por qué este proyecto?
          </h2>
          <p className="text-gray-500 max-w-lg">
            Tres ideas que guiaron cada decisión de diseño y desarrollo.
          </p>
        </Column>
        <Row className="gap-6 flex-wrap justify-center">
          {motivations.map(({ icon, title, description }) => (
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

      {/* Stack */}
      <Section containerClassName="py-16 px-6 gap-10">
        <Column className="items-center text-center gap-2">
          <h2 className="text-3xl font-bold text-secondary">
            Stack tecnológico
          </h2>
          <p className="text-gray-500 max-w-lg">
            Tecnologías elegidas por su robustez, ecosistema y relevancia en el
            mercado laboral actual.
          </p>
        </Column>
        <Row className="gap-4 flex-wrap justify-center">
          {stack.map(({ icon, name }) => (
            <Card
              key={name}
              className="flex flex-row gap-3 items-center px-6 py-4"
            >
              {icon}
              <span className="font-semibold text-secondary">{name}</span>
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
          ¿Tienes alguna pregunta?
        </h2>
        <p className="text-gray-400 max-w-md">
          Si eres evaluador, profesor o simplemente tienes curiosidad por el
          proyecto, puedes contactarme directamente.
        </p>
        <Row className="gap-3 items-center">
          <IconMail size={20} className="text-primary" />
          <span className="text-gray-300">hectorrdez@gmail.com</span>
        </Row>
        <ButtonLink to="/access/register">Ver la plataforma</ButtonLink>
      </Section>
    </Page>
  );
}
