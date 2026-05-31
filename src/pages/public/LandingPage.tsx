import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChallengeCard, { ChallengeCardSkeleton } from "../../components/cards/ChallengeCard";
import ButtonLink from "../../components/controls/ButtonLink";
import Page from "../../components/layouts/Page";
import { LogoWithTextColored } from "../../components/Logo";
import Column from "../../components/placing/Column";
import Row from "../../components/placing/Row";
import Section from "../../components/placing/Section";
import useAuth from "@contexts/AccessContext";
import { UserMenu } from "../../components/auth/UserMenu";
import ChallengeService, { type ChallengeData } from "../../services/ChallengeService";
import UserClassService from "../../services/UserClassService";
import { getRoute } from "../../utils/RouteUtils";

export default function LandingPage() {
  return (
    <Page header={LandingHeader()}>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ChallengesPreviewSection />
      <CtaSection />
    </Page>
  );
}

type LandingNavHeaderOptionProps = {
  to: string;
  children: string;
};

function LandingNavHeaderOption({ to, children }: LandingNavHeaderOptionProps) {
  return (
    <Link to={getRoute(to)} className="hover:text-primary transition-colors">
      {children}
    </Link>
  );
}

function LandingNavHeader() {
  return (
    <nav className="flex flex-1">
      <ul className="flex flex-row justify-center gap-8">
        <LandingNavHeaderOption to="landing">Inicio</LandingNavHeaderOption>
        <LandingNavHeaderOption to="challenges">Retos</LandingNavHeaderOption>
        <LandingNavHeaderOption to="ranking">Clasificación</LandingNavHeaderOption>
        <LandingNavHeaderOption to="media">Recursos</LandingNavHeaderOption>
      </ul>
    </nav>
  );
}

function LandingAuthArea() {
  const auth = useAuth();
  if (auth?.auth) return <UserMenu variant="light" />;
  return (
    <Row className="gap-2 items-center">
      <Link to={getRoute("login")} className="hover:text-primary transition-colors">
        Entrar
      </Link>
      <ButtonLink to={getRoute("register")}>Unirse</ButtonLink>
    </Row>
  );
}

function LandingHeader() {
  return (
    <header className="w-full flex justify-center">
      <Row className="justify-center items-center max-w-7xl w-full px-4 py-4">
        <LogoWithTextColored className="flex-1 justify-start" />
        <LandingNavHeader />
        <div className="flex flex-1 justify-end">
          <LandingAuthArea />
        </div>
      </Row>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0a1f0d]">
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-16 w-64 h-64 rounded-full bg-primary/8 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
        <div
          className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-8 border border-primary/20 animate-fade-in-up"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Educación sostenible para el futuro
        </div>

        <h1
          className="text-6xl sm:text-7xl font-black leading-[1.05] text-white mb-6 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          Aprende, compite y
          <br />
          <span className="text-primary">construye un mundo</span>
          <br />
          más verde
        </h1>

        <p
          className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          La plataforma donde estudiantes resuelven retos reales de
          sostenibilidad, aprenden juntos y compiten por hacer el mayor impacto.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <ButtonLink to={getRoute("register")}>
            Unirse a la comunidad
          </ButtonLink>
          <Link
            to={getRoute("challenges")}
            className="flex items-center justify-center gap-2 text-white/70 hover:text-primary transition-colors border border-white/20 hover:border-primary/40 px-6 py-2 rounded-button"
          >
            Explorar retos →
          </Link>
        </div>

        <div
          className="flex flex-wrap gap-6 justify-center mt-14 text-white/35 text-sm animate-fade-in-up"
          style={{ animationDelay: "400ms" }}
        >
          <span>✓ Gratis para estudiantes</span>
          <span>✓ Sin tarjeta de crédito</span>
          <span>✓ Acceso inmediato</span>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: "1,200+", label: "Estudiantes activos" },
    { value: "50+", label: "Retos disponibles" },
    { value: "30+", label: "Instituciones" },
    { value: "95%", label: "Satisfacción" },
  ];

  return (
    <section className="border-y border-gray-100 bg-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 divide-x divide-gray-100">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center px-4 animate-fade-in-up">
              <p className="text-3xl font-black text-primary">{stat.value}</p>
              <p className="text-sm text-secondary mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type FeatureCardProps = {
  icon: string;
  title: string;
  description: string;
  iconBg: string;
};

function FeatureCard({ icon, title, description, iconBg }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function FeaturesSection() {
  return (
    <Section className="py-24 bg-[#f6f8f6]" containerClassName="gap-16">
      <Column className="items-center gap-3 text-center">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          Por qué elegirnos
        </span>
        <h2 className="text-4xl font-bold">¿Por qué Edugreen?</h2>
        <p className="text-muted-foreground max-w-xl">
          Una plataforma pensada para que aprender sobre sostenibilidad sea
          práctico, social y motivador.
        </p>
      </Column>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <FeatureCard
          icon="🌱"
          title="Retos reales"
          description="Participa en desafíos diseñados junto a empresas e instituciones para resolver problemas medioambientales reales."
          iconBg="bg-green-50"
        />
        <FeatureCard
          icon="🏆"
          title="Clasificación global"
          description="Compite con estudiantes de todo el mundo, gana puntos y escala posiciones en el ranking de impacto."
          iconBg="bg-yellow-50"
        />
        <FeatureCard
          icon="📚"
          title="Recursos de calidad"
          description="Accede a material educativo curado: artículos, vídeos y guías sobre sostenibilidad y medio ambiente."
          iconBg="bg-blue-50"
        />
        <FeatureCard
          icon="🤝"
          title="Comunidad activa"
          description="Conecta con otros estudiantes, forma equipos y colabora para conseguir un mayor impacto colectivo."
          iconBg="bg-purple-50"
        />
      </div>
    </Section>
  );
}

type StepProps = {
  number: string;
  title: string;
  description: string;
};

function Step({ number, title, description }: StepProps) {
  return (
    <Column className="items-center gap-3 text-center flex-1">
      <div className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20 shrink-0">
        {number}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </Column>
  );
}

function HowItWorksSection() {
  return (
    <Section className="py-24" containerClassName="gap-16">
      <Column className="items-center gap-3 text-center">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          Proceso
        </span>
        <h2 className="text-4xl font-bold">¿Cómo funciona?</h2>
        <p className="text-muted-foreground max-w-xl">
          Tres pasos para empezar a marcar la diferencia desde hoy.
        </p>
      </Column>
      <div className="relative flex flex-col sm:flex-row gap-8 items-start w-full">
        <div className="hidden sm:block absolute top-[22px] left-[20%] right-[20%] border-t-2 border-dashed border-primary/25" />
        <Step
          number="1"
          title="Crea tu cuenta"
          description="Regístrate gratis en menos de un minuto y personaliza tu perfil con tus intereses de sostenibilidad."
        />
        <Step
          number="2"
          title="Elige un reto"
          description="Explora los retos disponibles, filtra por categoría o dificultad y únete al que más te motive."
        />
        <Step
          number="3"
          title="Aprende y compite"
          description="Completa los retos, acumula puntos de impacto y compara tu progreso con el de la comunidad."
        />
      </div>
    </Section>
  );
}

function ChallengesPreviewSection() {
  const auth = useAuth();
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { id, sessionToken } = auth?.auth ?? {};
    if (!id || !sessionToken) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const classesRes = await UserClassService.getClassesByUser(id, sessionToken);
        const classes = classesRes.data ?? [];
        if (classes.length === 0) return;

        const items = await ChallengeService.getByClass(classes[0].id, sessionToken);
        setChallenges((Array.isArray(items) ? items : []).slice(0, 3));
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [auth?.auth?.sessionToken]);

  return (
    <Section className="py-24 bg-[#f6f8f6]" containerClassName="gap-12">
      <Row className="justify-between items-end w-full">
        <Column className="gap-1">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            En tendencia
          </span>
          <h2 className="text-4xl font-bold">Retos destacados</h2>
          <p className="text-muted-foreground">
            Los retos más activos de esta semana.
          </p>
        </Column>
        <Link
          to={getRoute("challenges")}
          className="text-primary font-semibold hover:underline shrink-0"
        >
          Ver todos →
        </Link>
      </Row>
      <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
        {isLoading || challenges.length === 0 ? (
          <>
            <ChallengeCardSkeleton />
            <ChallengeCardSkeleton />
            <ChallengeCardSkeleton />
          </>
        ) : (
          challenges.map((c) => (
            <ChallengeCard
              key={c.id}
              imageSrc={
                c.image
                  ? `${import.meta.env.VITE_API_IMAGE}${c.image}`
                  : `https://picsum.photos/seed/${c.id}/400/225`
              }
              typeOfChallenge="Reto"
              title={c.name}
              points={c.points}
              classProgress={0}
              participants={c.participants}
              link={`/challenge/${c.id}`}
              tag="Reto destacado"
            >
              {c.description ?? "Completa este reto y suma puntos a tu clase."}
            </ChallengeCard>
          ))
        )}
      </div>
    </Section>
  );
}

function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#0a1f0d] py-32">
      <div className="absolute top-0 left-1/3 w-[400px] h-[400px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-72 h-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-8 border border-primary/20">
          ¡Empieza hoy mismo!
        </span>
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
          ¿Listo para marcar
          <br />
          <span className="text-primary">la diferencia?</span>
        </h2>
        <p className="text-white/60 text-xl mb-10 max-w-xl mx-auto">
          Únete a miles de estudiantes que ya están aprendiendo y actuando por
          un futuro más sostenible.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ButtonLink
            to={getRoute("register")}
            className="bg-white text-primary hover:bg-white/90"
          >
            Crear cuenta gratis
          </ButtonLink>
          <Link
            to={getRoute("challenges")}
            className="flex items-center justify-center gap-2 text-white/70 hover:text-primary transition-colors border border-white/20 hover:border-primary/40 px-6 py-2 rounded-button"
          >
            Explorar retos
          </Link>
        </div>
      </div>
    </section>
  );
}
