import {
  IconCheck,
  IconFilter,
  IconFilterFilled,
  IconPlus,
} from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ChallengeCard, {
  ChallengeCardSkeleton,
} from "../../components/cards/ChallengeCard";
import CreateChallengeModal from "../../components/challenges/CreateChallengeModal";
import { useNotification } from "../../components/notifications/useNotification";
import SearchBar from "../../components/inputs/SearchBar";
import Page from "../../components/layouts/Page";
import useAuth from "../../contexts/AccessContext";
import useUser from "../../contexts/UserContext";
import ChallengeService, {
  type ChallengeData,
} from "../../services/ChallengeService";
import ClassService from "../../services/ClassService";
import UserClassService from "../../services/UserClassService";
import type { ClassWithJoinDate } from "../../services/UserClassService";
import UserService from "../../services/UserService";

type StatusFilter = "all" | "available" | "in_progress" | "completed" | "ended";

const FILTER_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "Todos", value: "all" },
  { label: "Disponibles", value: "available" },
  { label: "En curso", value: "in_progress" },
  { label: "Completados", value: "completed" },
  { label: "Finalizados", value: "ended" },
];

type DisplayChallenge = {
  challenge_id: string;
  challenge_name: string;
  description: string | null;
  image: string | null;
  points: number;
  class_id: string;
  status: "available" | "in_progress" | "completed";
  participants: number;
  progress: number;
  end_date: string | null;
};

export default function ChallengesPage() {
  const auth = useAuth();
  const { user } = useUser() ?? {};
  const { notify } = useNotification();

  const [challenges, setChallenges] = useState<DisplayChallenge[]>([]);
  const [teacherClassId, setTeacherClassId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const { id, sessionToken } = auth?.auth ?? {};
    if (!id || !sessionToken) return;

    setIsLoading(true);

    const load = async () => {
      try {
        const [classesRes, enrollmentsRes] = await Promise.all([
          UserClassService.getClassesByUser(id, sessionToken).catch(() => ({
            data: [] as ClassWithJoinDate[],
          })),
          UserService.getChallenges(id, sessionToken).catch(() => ({
            data: [],
          })),
        ]);

        let classes = classesRes.data ?? [];

        if (user?.role === "teacher" || user?.role === "admin") {
          const tutorClasses = await ClassService.getByTutor(
            id,
            sessionToken,
          ).catch(() => []);
          const existingIds = new Set(classes.map((c) => c.id));
          const tutorAsJoin: ClassWithJoinDate[] = (tutorClasses ?? [])
            .filter((c) => !existingIds.has(c.id))
            .map((c) => ({ ...c, joined_at: c.created_at }));
          classes = [...classes, ...tutorAsJoin];
        }

        const enrollments = enrollmentsRes.data ?? [];

        if (classes.length > 0) {
          const stored = localStorage.getItem(`teacher_active_${id}`);
          setTeacherClassId(
            stored && classes.some((c) => c.id === stored)
              ? stored
              : classes[0].id,
          );
        }

        const challengeResults = await Promise.all(
          classes.map((cls) =>
            ChallengeService.getByClass(cls.id, sessionToken).catch(() => []),
          ),
        );
        const allChallenges = challengeResults.flatMap((res) => res ?? []);

        const merged: DisplayChallenge[] = allChallenges.map((ch) => {
          const enrollment = enrollments.find((e) => e.challenge_id === ch.id);
          return {
            challenge_id: ch.id,
            challenge_name: ch.name,
            description: ch.description,
            image: ch.image,
            points: ch.points,
            class_id: ch.class_id,
            status: enrollment?.status ?? "available",
            participants: ch.participants,
            progress: ch.progress,
            end_date: ch.end_date,
          };
        });

        setChallenges(merged);
      } catch {
        setChallenges([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [auth?.auth?.sessionToken, user?.role]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const now = new Date();
    return challenges.filter((c) => {
      const ended = c.end_date !== null && new Date(c.end_date) < now;
      if (filter === "ended" && !ended) return false;
      if (filter !== "all" && filter !== "ended" && c.status !== filter)
        return false;
      if (
        q &&
        !c.challenge_name.toLowerCase().includes(q) &&
        !(c.description ?? "").toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [challenges, filter, search]);

  const now = new Date();
  const isEnded = (c: DisplayChallenge) =>
    c.end_date !== null && new Date(c.end_date) < now;
  const endedChallenges = filtered.filter(isEnded);
  const enrolledChallenges = filtered.filter(
    (c) => c.status !== "available" && !isEnded(c),
  );
  const availableChallenges = filtered.filter(
    (c) => c.status === "available" && !isEnded(c),
  );

  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  function handleChallengeCreated(challenge: ChallengeData) {
    setModalOpen(false);
    setChallenges((prev) => [
      {
        challenge_id: challenge.id,
        challenge_name: challenge.name,
        description: challenge.description,
        image: challenge.image,
        points: challenge.points,
        class_id: challenge.class_id,
        status: "available",
        participants: 0,
        progress: 0,
        end_date: challenge.end_date,
      },
      ...prev,
    ]);
    notify({
      variant: "success",
      title: "Reto creado",
      message: "El reto se ha añadido a tu clase correctamente.",
    });
  }

  return (
    <Page>
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mis retos</h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar retos..."
            className="w-full sm:max-w-sm"
          />
          <div className="relative flex items-center" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors h-full cursor-pointer ${
                filter !== "all"
                  ? "bg-primary border-primary text-black"
                  : "bg-white border-gray-200 text-secondary hover:border-primary hover:text-primary"
              }`}
            >
              {filter !== "all" ? (
                <IconFilterFilled size={16} />
              ) : (
                <IconFilter size={16} />
              )}
              {filter !== "all"
                ? (FILTER_OPTIONS.find((o) => o.value === filter)?.label ??
                  "Filtrar")
                : "Filtrar"}
            </button>
            {dropdownOpen && (
              <div className="absolute top-full mt-1 left-0 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[160px]">
                <p className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Estado
                </p>
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFilter(opt.value);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between gap-2 transition-colors hover:bg-gray-50 ${
                      filter === opt.value
                        ? "font-semibold text-primary"
                        : "text-gray-700"
                    }`}
                  >
                    {opt.label}
                    {filter === opt.value && <IconCheck size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center min-h-64">
            <ChallengeCardSkeleton />
            <ChallengeCardSkeleton />
          </div>
        ) : challenges.length === 0 ? (
          <p className="text-center text-secondary py-16">
            No tienes retos asignados todavía.
          </p>
        ) : endedChallenges.length === 0 &&
          enrolledChallenges.length === 0 &&
          availableChallenges.length === 0 ? (
          <p className="text-center text-secondary py-16">
            No se encontraron retos con esos criterios.
          </p>
        ) : (
          <div className="flex flex-col gap-10">
            {endedChallenges.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4 text-gray-500">
                  Finalizados
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center opacity-70">
                  {endedChallenges.map((c) => (
                    <ChallengeCard
                      key={c.challenge_id}
                      imageSrc={
                        c.image
                          ? `${import.meta.env.VITE_API_IMAGE}${c.image}`
                          : `https://picsum.photos/seed/${c.challenge_id}/400/225`
                      }
                      typeOfChallenge="Reto"
                      title={c.challenge_name}
                      points={c.points}
                      classProgress={c.progress}
                      participants={c.participants}
                      link={`/challenge/${c.challenge_id}`}
                      tag="Finalizado"
                    >
                      {c.description}
                    </ChallengeCard>
                  ))}
                </div>
              </section>
            )}
            {enrolledChallenges.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4">
                  Mis inscripciones
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                  {enrolledChallenges.map((c) => (
                    <ChallengeCard
                      key={c.challenge_id}
                      imageSrc={
                        c.image
                          ? `${import.meta.env.VITE_API_IMAGE}${c.image}`
                          : `https://picsum.photos/seed/${c.challenge_id}/400/225`
                      }
                      typeOfChallenge="Reto"
                      title={c.challenge_name}
                      points={c.points}
                      classProgress={c.progress}
                      participants={c.participants}
                      link={`/challenge/${c.challenge_id}`}
                      tag={
                        c.status === "completed" ? "Completado" : "En progreso"
                      }
                    >
                      {c.description}
                    </ChallengeCard>
                  ))}
                </div>
              </section>
            )}

            {availableChallenges.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4">
                  Disponibles en tu clase
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                  {availableChallenges.map((c) => (
                    <ChallengeCard
                      key={c.challenge_id}
                      imageSrc={
                        c.image
                          ? `${import.meta.env.VITE_API_IMAGE}${c.image}`
                          : `https://picsum.photos/seed/${c.challenge_id}/400/225`
                      }
                      typeOfChallenge="Reto"
                      title={c.challenge_name}
                      points={c.points}
                      classProgress={c.progress}
                      participants={c.participants}
                      link={`/challenge/${c.challenge_id}`}
                      tag="Disponible"
                    >
                      {c.description}
                    </ChallengeCard>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {isTeacher && teacherClassId && (
        <>
          <button
            className="fixed bottom-8 right-8 flex items-center gap-2 bg-primary text-black font-semibold px-5 py-3 rounded-full shadow-lg hover:brightness-90 transition-[filter] duration-200"
            onClick={() => setModalOpen(true)}
          >
            <IconPlus size={20} />
            Nuevo reto
          </button>
          <CreateChallengeModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onCreated={handleChallengeCreated}
            classId={teacherClassId}
          />
        </>
      )}
    </Page>
  );
}
