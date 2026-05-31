import { useEffect, useState } from "react";
import {
  IconBuilding,
  IconChalkboard,
  IconChartBar,
  IconCheck,
  IconEdit,
  IconMail,
  IconUsers,
  IconUserPlus,
} from "@tabler/icons-react";
import Card from "@/components/cards/Card";
import ButtonLink from "@/components/controls/ButtonLink";
import Skeleton from "@/components/feedback/Skeleton";
import Page from "@/components/layouts/Page";
import Column from "@/components/placing/Column";
import Row from "@/components/placing/Row";
import Section from "@/components/placing/Section";
import ApiClient from "@/services/ApiClient";
import { getRoute } from "@/utils/RouteUtils";

const steps = [
  {
    icon: <IconUserPlus size={28} className="text-primary" />,
    title: "Crea tu cuenta de profesor",
    description:
      "Regístrate con tu correo institucional y selecciona el rol de docente. Accederás al panel de gestión en segundos.",
  },
  {
    icon: <IconChalkboard size={28} className="text-primary" />,
    title: "Crea tu aula virtual",
    description:
      "Configura tu clase y comparte el código de acceso con tus alumnos para que puedan unirse al instante.",
  },
  {
    icon: <IconEdit size={28} className="text-primary" />,
    title: "Diseña retos personalizados",
    description:
      "Crea desafíos ecológicos adaptados a tu temario. Elige tipo de actividad, dificultad y fecha límite.",
  },
  {
    icon: <IconUsers size={28} className="text-primary" />,
    title: "Matricula a tus alumnos",
    description:
      "Añade alumnos a cada reto uno a uno o usa el auto-matriculado para inscribir a toda la clase de golpe.",
  },
  {
    icon: <IconCheck size={28} className="text-primary" />,
    title: "Gestiona el progreso",
    description:
      "Marca retos como completados, otorga puntos y edita cualquier desafío en cualquier momento.",
  },
  {
    icon: <IconChartBar size={28} className="text-primary" />,
    title: "Analiza los resultados",
    description:
      "Visualiza en tiempo real la participación y el rendimiento de cada alumno para detectar quién necesita apoyo.",
  },
];

type InstitutionName = { id: string; name: string };

function InstitutionsList() {
  const [institutions, setInstitutions] = useState<InstitutionName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    ApiClient.get<InstitutionName[]>("/institution/names")
      .then(setInstitutions)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Row className="gap-4 flex-wrap justify-center">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-48" />
        ))}
      </Row>
    );
  }

  if (error || institutions.length === 0) {
    return (
      <p className="text-gray-500 text-center">
        No se pudieron cargar las instituciones.
      </p>
    );
  }

  return (
    <Row className="gap-3 flex-wrap justify-center">
      {institutions.map((inst) => (
        <Row
          key={inst.id}
          className="items-center gap-2 bg-card border border-border rounded-xl px-4 py-3"
        >
          <IconBuilding size={18} className="text-primary shrink-0" />
          <span className="text-sm font-semibold text-secondary">
            {inst.name}
          </span>
        </Row>
      ))}
    </Row>
  );
}

export default function ForTeachers() {
  return (
    <Page>
      {/* Hero */}
      <Section
        className="bg-header"
        containerClassName="py-24 px-6 gap-5 items-center text-center"
      >
        <span className="text-sm font-semibold text-primary uppercase tracking-widest">
          Para docentes
        </span>
        <h1 className="text-4xl font-bold text-white max-w-2xl leading-tight">
          Enseña sostenibilidad con{" "}
          <span className="text-primary">EduGreen</span>
        </h1>
        <p className="text-gray-400 max-w-xl text-lg">
          Crea aulas virtuales, diseña retos ecológicos personalizados y
          monitoriza el progreso de cada alumno desde un panel centralizado.
        </p>
        <ButtonLink to={getRoute("register")}>Empieza gratis</ButtonLink>
      </Section>

      {/* Pasos */}
      <Section containerClassName="py-16 px-6 gap-10">
        <Column className="items-center text-center gap-2">
          <h2 className="text-3xl font-bold text-secondary">
            ¿Cómo funciona para profesores?
          </h2>
          <p className="text-gray-500 max-w-lg">
            En pocos pasos tendrás tu aula lista y tus alumnos compitiendo por
            un futuro más verde.
          </p>
        </Column>
        <Row className="gap-6 flex-wrap justify-center">
          {steps.map(({ icon, title, description }, i) => (
            <Card
              key={i}
              className="flex-1 min-w-55 max-w-72 flex flex-col gap-4"
            >
              <Row className="gap-3 items-center">
                {icon}
                <span className="text-2xl font-bold text-primary">{i + 1}</span>
              </Row>
              <h3 className="text-lg font-semibold text-secondary">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {description}
              </p>
            </Card>
          ))}
        </Row>
      </Section>

      {/* Instituciones */}
      <Section className="bg-card" containerClassName="py-16 px-6 gap-8">
        <Column className="items-center text-center gap-2">
          <IconBuilding size={32} className="text-primary" />
          <h2 className="text-3xl font-bold text-secondary">
            Instituciones compatibles
          </h2>
          <p className="text-gray-500 max-w-lg">
            Solo se pueden registrar correos de dominios institucionales
            autorizados. Esta lista se actualiza continuamente.
          </p>
        </Column>
        <InstitutionsList />
        <Row className="items-center gap-3 bg-header rounded-xl px-6 py-4 max-w-xl mx-auto">
          <IconMail size={22} className="text-primary shrink-0" />
          <p className="text-gray-400 text-sm">
            ¿Tu institución no aparece? Escríbenos a{" "}
            <a
              href="mailto:hecrodtov@alu.edu.gva.es"
              className="text-primary hover:underline"
            >
              hecrodtov@alu.edu.gva.es
            </a>{" "}
            y la añadimos.
          </p>
        </Row>
      </Section>

      {/* CTA */}
      <Section containerClassName="py-20 px-6 items-center text-center gap-6">
        <h2 className="text-3xl font-bold text-secondary">
          ¿Listo para empezar?
        </h2>
        <p className="text-gray-500 max-w-md">
          Únete a EduGreen y transforma tus clases en una experiencia de
          aprendizaje sostenible.
        </p>
        <ButtonLink to={getRoute("register")}>
          Crear cuenta de profesor
        </ButtonLink>
      </Section>
    </Page>
  );
}
