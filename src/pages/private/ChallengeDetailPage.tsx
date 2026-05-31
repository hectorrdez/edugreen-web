import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  IconCheck,
  IconEye,
  IconMedal,
  IconMedal2,
  IconStar,
  IconTrophy,
  IconUserMinus,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";
import Modal from "@/components/feedback/Modal";
import Skeleton from "@/components/feedback/Skeleton";
import Page from "@/components/layouts/Page";
import useAuth from "@/contexts/AccessContext";
import ChallengeService from "@/services/ChallengeService";
import type { ChallengeData } from "@/services/ChallengeService";
import ClassService from "@/services/ClassService";
import EnrollmentService from "@/services/EnrollmentService";
import StatsService from "@/services/StatsService";
import UserService, { type UserData } from "@/services/UserService";
import type {
  ChallengeStatsData,
  RankingEntryData,
} from "@/services/StatsService";

type MemberRow = {
  user_id: string;
  name: string;
  points: number | null;
  completed_at: string | null;
};

const PODIUM_CONFIG = {
  1: {
    icon: <IconTrophy size={18} />,
    bg: "bg-yellow-400",
    text: "text-yellow-900",
    avatarBg: "bg-yellow-100",
    avatarText: "text-yellow-800",
    order: "order-2",
    barH: "h-16",
    barDelay: 400,
    fadeDelay: 500,
  },
  2: {
    icon: <IconMedal size={17} />,
    bg: "bg-slate-300",
    text: "text-slate-700",
    avatarBg: "bg-slate-100",
    avatarText: "text-slate-600",
    order: "order-1",
    barH: "h-10",
    barDelay: 0,
    fadeDelay: 100,
  },
  3: {
    icon: <IconMedal2 size={17} />,
    bg: "bg-orange-300",
    text: "text-orange-950",
    avatarBg: "bg-orange-100",
    avatarText: "text-orange-800",
    order: "order-3",
    barH: "h-6",
    barDelay: 200,
    fadeDelay: 300,
  },
} as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

type MiniRankingProps = { members: MemberRow[]; isLoading: boolean };

function MiniRanking({ members, isLoading }: MiniRankingProps) {
  const top = members.filter((m) => m.points !== null).slice(0, 3);
  const [mounted, setMounted] = useState(false);
  const prevTopRef = useRef<string>("");

  useEffect(() => {
    if (top.length === 0) return;
    const key = top.map((m) => m.user_id).join(",");
    if (key === prevTopRef.current) return;
    prevTopRef.current = key;
    setMounted(false);
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, [top.map((m) => m.user_id).join(",")]);

  if (isLoading) {
    return (
      <div className="flex items-end justify-center gap-4 mb-6">
        {[80, 96, 64].map((h, i) => (
          <div key={i} className="flex flex-col items-center gap-2 w-24">
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
            <div
              className="w-full rounded-t-xl bg-gray-100 animate-pulse"
              style={{ height: h }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (top.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-end justify-center gap-3">
        {top.map((m, idx) => {
          const rank = (idx + 1) as 1 | 2 | 3;
          const cfg = PODIUM_CONFIG[rank];
          return (
            <div
              key={m.user_id}
              className={`flex flex-col items-center gap-1.5 ${cfg.order}`}
            >
              {/* Avatar + label: fade + slide up */}
              <div
                className="flex flex-col items-center gap-1.5 transition-[opacity,transform] duration-500 ease-out"
                style={{
                  transitionDelay: `${cfg.fadeDelay}ms`,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(12px)",
                }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${cfg.avatarBg} ${cfg.avatarText}`}
                >
                  {initials(m.name)}
                </div>
                <span className="text-xs font-medium text-center max-w-20 truncate">
                  {m.name.split(" ")[0]}
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary">
                  <IconStar size={11} />
                  {m.points}
                </span>
              </div>

              {/* Bar: grows from bottom */}
              <div
                className={`w-20 rounded-t-xl flex flex-col items-center justify-start pt-2 gap-0.5 origin-bottom transition-transform duration-700 ease-out ${cfg.bg} ${cfg.text} ${cfg.barH}`}
                style={{
                  transitionDelay: `${cfg.barDelay}ms`,
                  transform: mounted ? "scaleY(1)" : "scaleY(0)",
                }}
              >
                {cfg.icon}
                <span className="text-xs font-bold">{rank}º</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();

  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [stats, setStats] = useState<ChallengeStatsData | null>(null);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {},
  );
  const [pendingRemove, setPendingRemove] = useState<MemberRow | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addQuery, setAddQuery] = useState("");
  const [addFoundUsers, setAddFoundUsers] = useState<UserData[]>([]);
  const [addSearching, setAddSearching] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    const { sessionToken } = auth?.auth ?? {};
    if (!id || !sessionToken) return;

    setIsLoading(true);

    const load = async () => {
      try {
        const ch = await ChallengeService.getOne(id, sessionToken);
        setChallenge(ch);

        const [challengeStats, enrollmentsRes, rankingRes, classData] =
          await Promise.all([
            StatsService.getByChallenge(id, sessionToken).catch(() => null),
            EnrollmentService.getByChallenge(id, sessionToken).catch(() => ({
              data: [],
            })),
            StatsService.getRanking(ch.class_id, sessionToken).catch(() => ({
              data: [],
            })),
            ClassService.getOne(ch.class_id, sessionToken).catch(() => null),
          ]);

        setStats(challengeStats);
        setTutorId(classData?.tutor_id ?? null);
        console.log("classData", classData);
        console.log("enrollmentsRes", enrollmentsRes);
        console.log("rankingRes", rankingRes);

        const enrollments = enrollmentsRes ?? [];
        const ranking: RankingEntryData[] = rankingRes.data ?? [];
        const completions = challengeStats?.completions ?? [];

        console.log("enrollments", enrollments);
        console.log("ranking", ranking);
        console.log("completions", completions);

        // Users absent from class ranking (no points yet) need a direct profile fetch
        const rankingIds = new Set(ranking.map((r) => r.user_id));
        const missingIds = enrollments
          .map((e) => e.user_id)
          .filter((uid) => !rankingIds.has(uid));
        const profiles = await Promise.all(
          missingIds.map((uid) =>
            UserService.getOne(uid, sessionToken).catch(() => null),
          ),
        );
        const profileMap = new Map(
          profiles
            .filter(Boolean)
            .map((p) => [p!.id, `${p!.name} ${p!.lastName}`]),
        );

        const rows: MemberRow[] = enrollments.map((e) => {
          const rankUser = ranking.find((r) => r.user_id === e.user_id);
          const completion = completions.find((c) => c.user_id === e.user_id);
          return {
            user_id: e.user_id,
            name: rankUser
              ? `${rankUser.name} ${rankUser.lastName}`
              : (profileMap.get(e.user_id) ?? e.user_id),
            points: completion?.points ?? null,
            completed_at: e.completed_at,
          };
        });

        rows.sort((a, b) => (b.points ?? -1) - (a.points ?? -1));
        setMembers(rows);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error al cargar el reto.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id, auth?.auth?.sessionToken]);

  const currentId = auth?.auth?.id;
  const currentRole = auth?.auth?.role;
  const isOwner =
    currentRole === "admin" || (!!tutorId && currentId === tutorId);
  const isEnrolled = members.some((m) => m.user_id === currentId);

  async function handleJoin() {
    if (!id || !currentId || !auth?.auth?.sessionToken) return;
    setEnrolling(true);
    try {
      await EnrollmentService.enroll(currentId, id, auth.auth.sessionToken);
      setMembers((prev) => [
        ...prev,
        { user_id: currentId, name: "Tú", points: null, completed_at: null },
      ]);
    } catch {
      // silently fail — server will reject if already enrolled
    } finally {
      setEnrolling(false);
    }
  }

  function closeAddModal() {
    setAddModalOpen(false);
    setAddQuery("");
    setAddFoundUsers([]);
    setAddError(null);
  }

  async function handleSearchParticipant(e: FormEvent) {
    e.preventDefault();
    if (!addQuery.trim() || !auth?.auth?.sessionToken) return;
    setAddSearching(true);
    setAddError(null);
    setAddFoundUsers([]);
    try {
      const results = (await UserService.searchStudents(addQuery.trim(), auth.auth.sessionToken)).data ?? [];
      const notEnrolled = results.filter((u) => !members.some((m) => m.user_id === u.id));
      if (notEnrolled.length === 0) {
        setAddError(
          results.length === 0
            ? "No se encontraron alumnos con ese criterio."
            : "Todos los alumnos encontrados ya están en el reto.",
        );
      } else {
        setAddFoundUsers(notEnrolled);
      }
    } catch (err) {
      setAddError((err as Error).message);
    } finally {
      setAddSearching(false);
    }
  }

  async function handleAddParticipant(user: UserData) {
    if (!id || !auth?.auth?.sessionToken) return;
    setAddingId(user.id);
    setAddError(null);
    try {
      await EnrollmentService.enroll(user.id, id, auth.auth.sessionToken);
      setMembers((prev) => [
        ...prev,
        { user_id: user.id, name: `${user.name} ${user.lastName}`, points: null, completed_at: null },
      ]);
      setChallenge((prev) =>
        prev ? { ...prev, participants: prev.participants + 1 } : prev,
      );
      setAddFoundUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      setAddError((err as Error).message);
    } finally {
      setAddingId(null);
    }
  }

  function setMemberLoading(userId: string, val: boolean) {
    setActionLoading((prev) => ({ ...prev, [userId]: val }));
  }

  async function handleToggleComplete(m: MemberRow) {
    if (!id || !auth?.auth?.sessionToken) return;
    const { sessionToken } = auth.auth;
    setMemberLoading(m.user_id, true);
    const wasCompleted = m.completed_at !== null;
    const pts = challenge?.points ?? 0;

    // Optimistic update — members
    setMembers((prev) =>
      prev.map((r) =>
        r.user_id === m.user_id
          ? {
              ...r,
              completed_at: wasCompleted ? null : new Date().toISOString(),
              points: wasCompleted ? null : pts,
            }
          : r,
      ),
    );
    // Optimistic update — aside stats
    setStats((prev) =>
      prev
        ? {
            ...prev,
            total_completions: prev.total_completions + (wasCompleted ? -1 : 1),
            completions: wasCompleted
              ? prev.completions.filter((c) => c.user_id !== m.user_id)
              : [
                  ...prev.completions,
                  { user_id: m.user_id, points: pts, earned_at: new Date().toISOString() },
                ],
          }
        : prev,
    );

    try {
      if (wasCompleted) {
        await EnrollmentService.uncomplete(m.user_id, id, sessionToken);
      } else {
        await EnrollmentService.complete(m.user_id, id, sessionToken);
      }
    } catch {
      // Revert both on failure
      setMembers((prev) => prev.map((r) => (r.user_id === m.user_id ? m : r)));
      setStats((prev) =>
        prev
          ? {
              ...prev,
              total_completions: prev.total_completions + (wasCompleted ? 1 : -1),
              completions: wasCompleted
                ? [
                    ...prev.completions,
                    { user_id: m.user_id, points: pts, earned_at: m.completed_at ?? "" },
                  ]
                : prev.completions.filter((c) => c.user_id !== m.user_id),
            }
          : prev,
      );
    } finally {
      setMemberLoading(m.user_id, false);
    }
  }

  async function handleRemove(m: MemberRow) {
    if (!id || !auth?.auth?.sessionToken) return;
    setMemberLoading(m.user_id, true);
    const wasCompleted = m.completed_at !== null;

    // Optimistic update — members
    setMembers((prev) => prev.filter((r) => r.user_id !== m.user_id));
    // Optimistic update — aside stats
    setChallenge((prev) =>
      prev ? { ...prev, participants: Math.max(0, prev.participants - 1) } : prev,
    );
    if (wasCompleted) {
      setStats((prev) =>
        prev
          ? {
              ...prev,
              total_completions: Math.max(0, prev.total_completions - 1),
              completions: prev.completions.filter((c) => c.user_id !== m.user_id),
            }
          : prev,
      );
    }

    try {
      await EnrollmentService.unenroll(m.user_id, id, auth.auth.sessionToken);
    } catch {
      // Revert all on failure
      setMembers((prev) => [...prev, m]);
      setChallenge((prev) =>
        prev ? { ...prev, participants: prev.participants + 1 } : prev,
      );
      if (wasCompleted) {
        setStats((prev) =>
          prev
            ? {
                ...prev,
                total_completions: prev.total_completions + 1,
                completions: [
                  ...prev.completions,
                  { user_id: m.user_id, points: m.points ?? 0, earned_at: m.completed_at ?? "" },
                ],
              }
            : prev,
        );
      }
    } finally {
      setMemberLoading(m.user_id, false);
    }
  }

  if (error) {
    return (
      <Page>
        <div className="flex items-center justify-center py-32 text-secondary">
          {error}
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Aside */}
          <aside className="w-full lg:w-80 lg:sticky lg:top-8 shrink-0">
            {isLoading ? (
              <div className="rounded-2xl border border-gray-200 overflow-hidden">
                <Skeleton className="w-full h-44" />
                <div className="p-5 flex flex-col gap-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-8 w-24 mt-2" />
                </div>
              </div>
            ) : challenge ? (
              <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
                <img
                  src={
                    challenge.image
                      ? `${import.meta.env.VITE_API_IMAGE}${challenge.image}`
                      : `https://picsum.photos/seed/${challenge.id}/640/360`
                  }
                  alt={challenge.name}
                  className="w-full h-44 object-cover"
                />
                <div className="p-5 flex flex-col gap-3">
                  <h1 className="text-xl font-bold leading-tight">
                    {challenge.name}
                  </h1>
                  {challenge.description && (
                    <p className="text-secondary text-sm leading-relaxed">
                      {challenge.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-semibold text-sm px-3 py-1.5 rounded-full">
                      <IconStar size={14} />
                      {challenge.points} pts
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 mt-1 flex flex-col gap-1.5 text-sm text-secondary">
                    <div className="flex items-center gap-2">
                      <IconUsers size={15} />
                      <span>
                        {challenge.participants} participante
                        {challenge.participants !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconCheck size={15} />
                      <span>
                        {stats?.total_completions ?? 0} completado
                        {(stats?.total_completions ?? 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <span>Creado: {formatDate(challenge.created_at)}</span>
                    <span>
                      Cierre:{" "}
                      {challenge.end_date
                        ? formatDate(challenge.end_date)
                        : "Sin fecha límite"}
                    </span>
                  </div>
                  {!isOwner && !isEnrolled && !isLoading && (
                    <button
                      onClick={handleJoin}
                      disabled={enrolling}
                      className="mt-2 w-full flex items-center justify-center gap-2 bg-primary text-black font-semibold px-4 py-2.5 rounded-xl hover:brightness-90 transition-[filter] duration-200 disabled:opacity-50"
                    >
                      <IconUserPlus size={17} />
                      {enrolling ? "Uniéndose…" : "Unirse al reto"}
                    </button>
                  )}
                  {!isOwner && isEnrolled && !isLoading && (
                    <div className="mt-2 w-full flex items-center justify-center gap-2 bg-green-100 text-green-700 font-semibold px-4 py-2.5 rounded-xl text-sm">
                      <IconCheck size={17} />
                      Ya participas en este reto
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </aside>

          {/* Members table */}
          <section className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Participantes</h2>
              {isOwner && (
                <button
                  onClick={() => setAddModalOpen(true)}
                  className="flex items-center gap-1.5 text-sm font-semibold bg-primary text-black px-3 py-1.5 rounded-xl hover:brightness-90 transition-[filter] duration-200"
                >
                  <IconUserPlus size={14} />
                  Añadir
                </button>
              )}
            </div>

            <MiniRanking members={members} isLoading={isLoading} />

            {isLoading ? (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            ) : members.length === 0 ? (
              <p className="text-secondary text-center py-16">
                Ningún miembro inscrito todavía.
              </p>
            ) : (
              <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-secondary text-left">
                      <th className="px-4 py-3 font-medium w-10">#</th>
                      <th className="px-4 py-3 font-medium">Nombre</th>
                      <th className="px-4 py-3 font-medium text-right">
                        Puntos
                      </th>
                      <th className="px-4 py-3 font-medium">Estado</th>
                      <th className="px-4 py-3 font-medium hidden sm:table-cell">
                        Completado
                      </th>
                      {isOwner && (
                        <th className="px-4 py-3 font-medium w-28 text-right">
                          Acciones
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m, i) => {
                      const busy = !!actionLoading[m.user_id];
                      const completed = m.completed_at !== null;
                      return (
                        <tr
                          key={m.user_id}
                          className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-secondary">{i + 1}</td>
                          <td className="px-4 py-3 font-medium">{m.name}</td>
                          <td className="px-4 py-3 text-right">
                            {m.points !== null ? (
                              <span className="inline-flex items-center gap-1 text-primary font-semibold">
                                <IconStar size={13} />
                                {m.points}
                              </span>
                            ) : (
                              <span className="text-secondary">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {completed ? (
                              <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                Completado
                              </span>
                            ) : (
                              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                En curso
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-secondary hidden sm:table-cell">
                            {formatDate(m.completed_at)}
                          </td>
                          {isOwner && (
                            <td className="px-4 py-3">
                              <ActionsMenu
                                member={m}
                                busy={busy}
                                completed={completed}
                                onToggleComplete={handleToggleComplete}
                                onRemove={setPendingRemove}
                              />
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
      <Modal
        open={addModalOpen}
        onClose={closeAddModal}
        title="Añadir participante"
      >
        <form onSubmit={handleSearchParticipant} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="search"
              value={addQuery}
              onChange={(e) => setAddQuery(e.target.value)}
              placeholder="Buscar por email o nombre…"
              className="flex-1 text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={addSearching || !addQuery.trim()}
              className="text-sm font-semibold bg-primary text-black px-3 py-2 rounded-xl hover:brightness-90 transition-[filter] disabled:opacity-50"
            >
              {addSearching ? "Buscando…" : "Buscar"}
            </button>
          </div>
          {addError && (
            <p className="text-sm text-red-600">{addError}</p>
          )}
          {addFoundUsers.length > 0 && (
            <div className="flex flex-col gap-2 mt-1">
              {addFoundUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-3 py-2.5"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {user.name} {user.lastName}
                    </span>
                    <span className="text-xs text-secondary">{user.email}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddParticipant(user)}
                    disabled={addingId === user.id}
                    className="flex items-center gap-1 text-xs font-semibold bg-primary text-black px-2.5 py-1.5 rounded-lg hover:brightness-90 transition-[filter] disabled:opacity-50"
                  >
                    <IconUserPlus size={12} />
                    {addingId === user.id ? "Añadiendo…" : "Añadir"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </form>
      </Modal>
      <Modal
        open={!!pendingRemove}
        onClose={() => setPendingRemove(null)}
        title="Eliminar participante"
      >
        <p className="text-sm text-secondary mb-6">
          ¿Eliminar a{" "}
          <span className="font-semibold text-foreground">
            {pendingRemove?.name}
          </span>{" "}
          del reto? Perderá su progreso y puntos.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setPendingRemove(null)}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              if (!pendingRemove) return;
              const target = pendingRemove;
              setPendingRemove(null);
              await handleRemove(target);
            }}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </Page>
  );
}

type ActionsOptionProps = { children: React.ReactNode };

function ActionsOption({ children }: ActionsOptionProps) {
  return (
    <span className="min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer">
      {children}
    </span>
  );
}

type ActionsMenuProps = {
  member: MemberRow;
  busy: boolean;
  completed: boolean;
  onToggleComplete: (m: MemberRow) => void;
  onRemove: (m: MemberRow) => void;
};

function ActionsMenu({
  member,
  busy,
  completed,
  onToggleComplete,
  onRemove,
}: ActionsMenuProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <ActionsOption>
        <Link
          to={`/profile/${member.user_id}`}
          className="p-1.5 rounded-lg text-secondary hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex justify-center items-center"
          title="Ver perfil"
        >
          <IconEye size={15} />
        </Link>
      </ActionsOption>
      <ActionsOption>
        <button
          onClick={() => onToggleComplete(member)}
          disabled={busy}
          title={
            completed ? "Marcar como no completado" : "Marcar como completado"
          }
          className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 cursor-pointer min-w-[44px] min-h-[44px] flex justify-center items-center ${
            completed
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "text-secondary hover:bg-gray-100 hover:text-green-700"
          }`}
        >
          <IconCheck size={15} />
        </button>
      </ActionsOption>
      <ActionsOption>
        <button
          onClick={() => onRemove(member)}
          disabled={busy}
          title="Eliminar del reto"
          className="p-1.5 rounded-lg text-secondary hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40 cursor-pointer min-w-[44px] min-h-[44px] flex justify-center items-center"
        >
          <IconUserMinus size={15} />
        </button>
      </ActionsOption>
    </div>
  );
}
