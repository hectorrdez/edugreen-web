import {
  IconChalkboard,
  IconChartBar,
  IconDoor,
  IconEdit,
  IconSchool,
  IconStar,
  IconTargetArrow,
  IconTrophy,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";
import Card from "../../components/cards/Card";
import ButtonLink from "../../components/controls/ButtonLink";
import Page from "../../components/layouts/Page";
import Column from "../../components/placing/Column";
import Row from "../../components/placing/Row";
import Section from "../../components/placing/Section";
import { getRoute } from "../../utils/RouteUtils";

const studentSteps = [
  {
    step: 1,
    icon: <IconUserPlus size={28} className="text-primary" />,
    title: "Crea tu cuenta",
    description:
      "Regístrate con tu correo y contraseña eligiendo el rol de estudiante. En menos de un minuto estarás dentro.",
  },
  {
    step: 2,
    icon: <IconDoor size={28} className="text-primary" />,
    title: "Únete a una clase",
    description:
      "Introduce el código que te facilite tu profesor para acceder a tu aula virtual y ver los retos de tu grupo.",
  },
  {
    step: 3,
    icon: <IconTargetArrow size={28} className="text-primary" />,
    title: "Acepta los retos",
    description:
      "Cada semana encontrarás nuevos desafíos medioambientales: cuestionarios, mini-juegos y recursos multimedia.",
  },
  {
    step: 4,
    icon: <IconStar size={28} className="text-primary" />,
    title: "Completa y gana puntos",
    description:
      "Cada reto completado te suma puntos. Cuanto más participas, más crece tu puntuación y tu nivel.",
  },
  {
    step: 5,
    icon: <IconTrophy size={28} className="text-primary" />,
    title: "Sube en el ranking",
    description:
      "Compite con tus compañeros de clase y demuestra tu compromiso con el planeta escalando posiciones.",
  },
];

const teacherSteps = [
  {
    step: 1,
    icon: <IconUserPlus size={28} className="text-primary" />,
    title: "Crea tu cuenta de profesor",
    description:
      "Regístrate seleccionando el rol de docente. Tendrás acceso inmediato al panel de gestión de clases.",
  },
  {
    step: 2,
    icon: <IconChalkboard size={28} className="text-primary" />,
    title: "Crea tu aula virtual",
    description:
      "Configura tu clase y comparte el código de acceso con tus alumnos para que puedan unirse al instante.",
  },
  {
    step: 3,
    icon: <IconEdit size={28} className="text-primary" />,
    title: "Diseña retos personalizados",
    description:
      "Crea desafíos ecológicos adaptados a tu temario: elige el tipo de actividad, la dificultad y la duración.",
  },
  {
    step: 4,
    icon: <IconUsers size={28} className="text-primary" />,
    title: "Gestiona tu clase",
    description:
      "Visualiza en tiempo real qué alumnos han aceptado y completado cada reto, e identifica quién necesita apoyo.",
  },
  {
    step: 5,
    icon: <IconChartBar size={28} className="text-primary" />,
    title: "Analiza los resultados",
    description:
      "Accede a estadísticas detalladas de participación y rendimiento para evaluar el impacto de cada actividad.",
  },
];

export default function HowItWorksPage() {
  return (
    <Page>
      {/* Hero */}
      <Section
        className="bg-header"
        containerClassName="py-24 px-6 gap-5 items-center text-center"
      >
        <span className="text-sm font-semibold text-primary uppercase tracking-widest">
          La plataforma
        </span>
        <h1 className="text-4xl font-bold text-white max-w-2xl leading-tight">
          ¿Cómo funciona <span className="text-primary">EduGreen</span>?
        </h1>
        <p className="text-gray-400 max-w-xl text-lg">
          Una plataforma pensada para estudiantes y profesores. Cada rol tiene
          su propio recorrido hacia un aprendizaje más sostenible.
        </p>
      </Section>

      {/* Introducción de roles */}
      <Section containerClassName="py-16 px-6 gap-8">
        <Row className="gap-12 flex-wrap items-start">
          <Column className="flex-1 min-w-70 gap-4">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              Estudiantes
            </span>
            <h2 className="text-3xl font-bold text-secondary leading-tight">
              Aprende jugando
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Los estudiantes completan retos medioambientales semanales para
              ganar puntos y subir en el ranking de su clase. Aprender sobre
              sostenibilidad nunca había sido tan motivador.
            </p>
          </Column>
          <Column className="flex-1 min-w-70 gap-4">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              Profesores
            </span>
            <h2 className="text-3xl font-bold text-secondary leading-tight">
              Enseña con impacto
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Los docentes crean aulas virtuales, diseñan retos personalizados y
              hacen seguimiento del progreso de cada alumno desde un panel
              centralizado.
            </p>
          </Column>
        </Row>
      </Section>

      {/* Pasos para estudiantes */}
      <Section className="bg-card" containerClassName="py-16 px-6 gap-10">
        <Column className="items-center text-center gap-2">
          <IconSchool size={32} className="text-primary" />
          <h2 className="text-3xl font-bold text-secondary">
            Pasos para estudiantes
          </h2>
          <p className="text-gray-500 max-w-lg">
            Desde el registro hasta lo alto del ranking, tu camino hacia un
            futuro más verde empieza aquí.
          </p>
        </Column>
        <Row className="gap-6 flex-wrap justify-center">
          {studentSteps.map(({ step, icon, title, description }) => (
            <Card
              key={step}
              className="flex-1 min-w-55 max-w-70 flex flex-col gap-4"
            >
              <Row className="gap-3 items-center">
                {icon}
                <span className="text-2xl font-bold text-primary">{step}</span>
              </Row>
              <h3 className="text-lg font-semibold text-secondary">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {description}
              </p>
            </Card>
          ))}
        </Row>
      </Section>

      {/* Pasos para profesores */}
      <Section containerClassName="py-16 px-6 gap-10">
        <Column className="items-center text-center gap-2">
          <IconChalkboard size={32} className="text-primary" />
          <h2 className="text-3xl font-bold text-secondary">
            Pasos para profesores
          </h2>
          <p className="text-gray-500 max-w-lg">
            Configura tu aula, crea retos y observa cómo tus alumnos se implican
            con el medio ambiente.
          </p>
        </Column>
        <Row className="gap-6 flex-wrap justify-center">
          {teacherSteps.map(({ step, icon, title, description }) => (
            <Card
              key={step}
              className="flex-1 min-w-55 max-w-70 flex flex-col gap-4"
            >
              <Row className="gap-3 items-center">
                {icon}
                <span className="text-2xl font-bold text-primary">{step}</span>
              </Row>
              <h3 className="text-lg font-semibold text-secondary">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {description}
              </p>
            </Card>
          ))}
        </Row>
      </Section>

      {/* CTA */}
      <Section
        className="bg-header"
        containerClassName="py-20 px-6 items-center text-center gap-6"
      >
        <h2 className="text-3xl font-bold text-white">¿Listo para empezar?</h2>
        <p className="text-gray-400 max-w-md">
          Únete a la comunidad EduGreen y comienza tu camino hacia un futuro más
          verde hoy mismo.
        </p>
        <ButtonLink to={getRoute("register")}>Crear cuenta gratis</ButtonLink>
      </Section>
    </Page>
  );
}
