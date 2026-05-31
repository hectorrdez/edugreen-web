import { useState } from "react";
import {
  IconExternalLink,
  IconLeaf,
  IconPlayerPlay,
} from "@tabler/icons-react";
import Page from "../../components/layouts/Page";

// Lightweight YouTube embed — loads thumbnail only; iframe injected on click
type LiteYouTubeProps = {
  videoId: string;
  title: string;
};

function LiteYouTube({ videoId, title }: LiteYouTubeProps) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        className="w-full aspect-video rounded-xl"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      onClick={() => setActive(true)}
      className="relative w-full aspect-video rounded-xl overflow-hidden group bg-black"
      aria-label={`Reproducir: ${title}`}
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition-opacity duration-200"
        loading="lazy"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
          <IconPlayerPlay size={24} className="text-white ml-1" />
        </div>
      </div>
    </button>
  );
}

type VideoCardProps = {
  videoId: string;
  title: string;
  description: string;
  tag: string;
};

function VideoCard({ videoId, title, description, tag }: VideoCardProps) {
  return (
    <div className="flex flex-col gap-3 bg-white border border-gray-200 rounded-2xl overflow-hidden p-4">
      <LiteYouTube videoId={videoId} title={title} />
      <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full self-start">
        {tag}
      </span>
      <h3 className="font-semibold text-sm leading-snug">{title}</h3>
      <p className="text-xs text-secondary leading-relaxed">{description}</p>
    </div>
  );
}

type LinkCardProps = {
  href: string;
  title: string;
  description: string;
  domain: string;
};

function LinkCard({ href, title, description, domain }: LinkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-2xl hover:border-primary hover:shadow-sm transition-all duration-200 group"
    >
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <IconLeaf size={18} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold group-hover:text-primary transition-colors leading-snug">
            {title}
          </h3>
          <IconExternalLink size={14} className="text-secondary shrink-0 mt-0.5" />
        </div>
        <p className="text-xs text-secondary mt-1 leading-relaxed line-clamp-2">
          {description}
        </p>
        <span className="text-xs text-secondary/60 mt-1.5 block">{domain}</span>
      </div>
    </a>
  );
}

const VIDEOS: VideoCardProps[] = [
  {
    videoId: "EhAemz1v7dQ",
    title: "¿Qué es el cambio climático? Explicado fácil",
    description:
      "Una introducción clara y accesible al cambio climático: causas, consecuencias y qué podemos hacer cada uno de nosotros para frenarlo.",
    tag: "Cambio climático",
  },
  {
    videoId: "WN_kOHFLDlo",
    title: "Energías renovables: el futuro de nuestro planeta",
    description:
      "Descubre cómo la energía solar, eólica e hidráulica están transformando la manera en que generamos electricidad de forma limpia y sostenible.",
    tag: "Energías limpias",
  },
  {
    videoId: "2VqUEcvPsLo",
    title: "La biodiversidad y por qué debemos protegerla",
    description:
      "Exploración de los ecosistemas más ricos del planeta y la importancia de conservar cada especie para mantener el equilibrio de la vida.",
    tag: "Biodiversidad",
  },
  {
    videoId: "VH30q7WPOVE",
    title: "Economía circular: residuo cero en la práctica",
    description:
      "Aprende qué es la economía circular, cómo reduce residuos y de qué forma empresas y ciudadanos pueden aplicarla en su día a día.",
    tag: "Sostenibilidad",
  },
  {
    videoId: "jAa58N4Jlos",
    title: "Los océanos en peligro: plásticos y contaminación",
    description:
      "Un recorrido por el impacto de los residuos plásticos en los mares y océanos, y las iniciativas globales para limpiar y proteger el ecosistema marino.",
    tag: "Océanos",
  },
  {
    videoId: "8nzDQeI5Xhw",
    title: "Consumo responsable: compra mejor, vive mejor",
    description:
      "Guía práctica sobre consumo consciente: cómo tomar decisiones de compra más éticas, reducir la huella de carbono y apoyar productos sostenibles.",
    tag: "Consumo consciente",
  },
];

const LINKS: LinkCardProps[] = [
  {
    href: "https://www.wwf.es/nuestro_trabajo/",
    title: "WWF España — Proyectos de conservación",
    description:
      "Iniciativas de WWF para proteger la naturaleza en España: bosques, mares, especies amenazadas y lucha contra el cambio climático.",
    domain: "wwf.es",
  },
  {
    href: "https://es.greenpeace.org/es/trabajamos-en/",
    title: "Greenpeace España — Campañas activas",
    description:
      "Conoce las campañas en curso de Greenpeace: energía, bosques, océanos, agricultura y mucho más.",
    domain: "greenpeace.es",
  },
  {
    href: "https://www.miteco.gob.es/es/cambio-climatico/",
    title: "Ministerio para la Transición Ecológica — Cambio Climático",
    description:
      "Portal oficial del Gobierno de España con información, normativa y planes de acción frente al cambio climático.",
    domain: "miteco.gob.es",
  },
  {
    href: "https://www.ecologiaverde.com/",
    title: "Ecología Verde — Guías y artículos educativos",
    description:
      "Artículos, guías y recursos didácticos sobre medio ambiente, ecología, reciclaje y vida sostenible en español.",
    domain: "ecologiaverde.com",
  },
  {
    href: "https://www.nationalgeographic.es/medio-ambiente",
    title: "National Geographic España — Medio Ambiente",
    description:
      "Reportajes, fotografías y documentales sobre los ecosistemas del planeta, fauna en peligro y retos medioambientales globales.",
    domain: "nationalgeographic.es",
  },
  {
    href: "https://www.un.org/es/climatechange",
    title: "ONU — Acción por el Clima",
    description:
      "Recursos de las Naciones Unidas sobre el Acuerdo de París, los Objetivos de Desarrollo Sostenible y la agenda climática internacional.",
    domain: "un.org",
  },
];

export default function MediaPage() {
  return (
    <Page>
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Recursos educativos</h1>
          <p className="text-secondary text-sm mt-1">
            Vídeos y guías sobre ecología, sostenibilidad y educación ambiental.
          </p>
        </div>

        {/* Videos */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">Vídeos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VIDEOS.map((v) => (
              <VideoCard key={v.videoId} {...v} />
            ))}
          </div>
        </section>

        {/* Links */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Guías y enlaces</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LINKS.map((l) => (
              <LinkCard key={l.href} {...l} />
            ))}
          </div>
        </section>
      </div>
    </Page>
  );
}
