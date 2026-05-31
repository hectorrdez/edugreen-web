import { IconFriends, IconStarFilled } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import StringUtils from "../../utils/StringUtils";
import Column from "../placing/Column";
import ProgressBarLabeled from "../progressBar/ProgressBarLabeled";
import Row from "../placing/Row";

type ChallengeCardProps = {
  imageSrc: string;
  typeOfChallenge: string;
  title: string;
  children: ReactNode;
  points: number;
  classProgress: number;
  participants: number;
  link?: string;
  className?: string;
  tag?: string;
};

export default function ChallengeCard({
  imageSrc,
  typeOfChallenge,
  title,
  children,
  points,
  classProgress,
  participants,
  link = "#",
  className = "",
  tag = "Reto del dia",
  ...props
}: ChallengeCardProps) {
  const newClassName = StringUtils.JoinClassName(
    "rounded-2xl bg-white w-full max-w-sm p-4 flex flex-col gap-3 h-[486px] justify-between shadow-md",
    className,
  );
  return (
    <article className={newClassName} {...props}>
      <ImageWithSkeleton src={imageSrc} alt={title + " image"} />
      <Column className="gap-3">
        <TitleSection tag={tag} points={points}>
          {title}
        </TitleSection>
        <DataCardSection max={100} currentProgress={classProgress}>
          {children}
        </DataCardSection>
      </Column>
      <BottomCardSection participants={participants} link={link} />
    </article>
  );
}

type TitleSectionProps = {
  tag: string;
  children: string;
  points: number;
};

function TitleSection({ tag, children, points }: TitleSectionProps) {
  const [displayedPoints, setDisplayedPoints] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    const from = startValueRef.current;
    const to = points;
    startTimeRef.current = null;

    function tick(now: number) {
      if (startTimeRef.current === null) startTimeRef.current = now;
      const t = Math.min((now - startTimeRef.current) / 700, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayedPoints(from + (to - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else startValueRef.current = to;
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [points]);

  return (
    <Row className="w-full justify-between">
      <Column className="gap-0">
        <span className="text-primary-dark font-bold text-xs">
          {tag.toLocaleUpperCase()}
        </span>
        <h3 className="font-bold text-lg leading-6">
          {children.toLocaleUpperCase()}
        </h3>
      </Column>
      <Row className="items-center">
        <Row className="flex justify-center items-center gap-2 bg-primary/20 px-4 py-2 rounded-full h-fit">
          <div className="p-1 flex justify-center items-center bg-primary rounded-full w-4 h-4">
            <IconStarFilled color="white" size={13} />
          </div>
          <span className="text-primary-dark font-semibold">
            +{Math.round(displayedPoints)}pts
          </span>
        </Row>
      </Row>
    </Row>
  );
}

type DataCardSectionProps = {
  children: ReactNode;
  max: number;
  currentProgress: number;
};

function DataCardSection({
  children,
  max,
  currentProgress,
}: DataCardSectionProps) {
  return (
    <>
      <p className="text-secondary text-sm">{children}</p>
      <ProgressBarLabeled max={max} currentProgress={currentProgress}>
        Progreso de la clase
      </ProgressBarLabeled>
    </>
  );
}

function ImageWithSkeleton({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="w-full h-56.25 rounded-2xl overflow-hidden relative">
      {!loaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-[transform,opacity] duration-500 ease-out hover:scale-110 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

type BottomCardSectionProps = {
  participants: number;
  link: string;
};

function BottomCardSection({ participants, link }: BottomCardSectionProps) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    const from = startValueRef.current;
    const to = participants;
    startTimeRef.current = null;

    function tick(now: number) {
      if (startTimeRef.current === null) startTimeRef.current = now;
      const t = Math.min((now - startTimeRef.current) / 700, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(from + (to - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else startValueRef.current = to;
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [participants]);

  return (
    <section className="flex flex-row justify-between border-t border-t-gray-300 pt-3">
      <Row className="gap-1 flex-1 items-center">
        <span className="text-primary">
          <IconFriends fill="currentColor" size={16} />
        </span>
        <span className="font-bold">{Math.round(displayed)}</span>
        <span className="text-sm text-secondary">participando</span>
      </Row>
      <Link
        className="flex flex-1 justify-end text-primary-dark font-semibold"
        to={link}
        target="_self"
      >
        Ver detalles
      </Link>
    </section>
  );
}

export function ChallengeCardSkeleton({
  className = "",
}: {
  className?: string;
}) {
  const newClassName = StringUtils.JoinClassName(
    "rounded-2xl bg-white w-full max-w-sm p-4 flex flex-col gap-3 h-[486px] justify-between shadow-md",
    className,
  );
  return (
    <article className={newClassName}>
      <div className="w-full h-56.25 rounded-md bg-muted animate-pulse" />
      <Column className="gap-3">
        <Row className="w-full justify-between items-center">
          <Column className="gap-1.5">
            <div className="h-3 w-20 rounded-full bg-muted animate-pulse" />
            <div className="h-5 w-40 rounded-full bg-muted animate-pulse" />
            <div className="h-5 w-32 rounded-full bg-muted animate-pulse" />
          </Column>
          <div className="h-8 w-20 rounded-full bg-muted animate-pulse" />
        </Row>
        <Column className="gap-2">
          <div className="h-3.5 w-full rounded-full bg-muted animate-pulse" />
          <div className="h-3.5 w-4/5 rounded-full bg-muted animate-pulse" />
          <div className="h-3.5 w-3/5 rounded-full bg-muted animate-pulse" />
          <div className="mt-1 h-2.5 w-full rounded-full bg-muted animate-pulse" />
        </Column>
      </Column>
      <div className="border-t border-t-gray-300 pt-3 flex justify-between items-center">
        <div className="h-4 w-28 rounded-full bg-muted animate-pulse" />
        <div className="h-4 w-20 rounded-full bg-muted animate-pulse" />
      </div>
    </article>
  );
}
