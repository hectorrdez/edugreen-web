import { IconEye, IconMedal, IconMedal2, IconTrophy } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "../../components/feedback/Skeleton";
import SearchBar from "../../components/inputs/SearchBar";
import Page from "../../components/layouts/Page";
import { useNotification } from "../../components/notifications/useNotification";
import useAuth from "../../contexts/AccessContext";
import useUser from "../../contexts/UserContext";
import ClassService, { type ClassData } from "../../services/ClassService";
import StatsService, {
  type RankingEntryData,
} from "../../services/StatsService";
import UserClassService from "../../services/UserClassService";

type RankingEntry = RankingEntryData & { id: string };

function initials(name: string, lastName: string) {
  return `${name[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

const PODIUM = {
  1: {
    blockH: "h-28",
    blockBg: "bg-yellow-400",
    blockText: "text-yellow-900",
    avatarBg: "bg-yellow-100",
    avatarText: "text-yellow-800",
    order: "order-2",
    icon: <IconTrophy size={22} className="text-yellow-500 mb-1" />,
  },
  2: {
    blockH: "h-20",
    blockBg: "bg-slate-300",
    blockText: "text-slate-700",
    avatarBg: "bg-slate-100",
    avatarText: "text-slate-600",
    order: "order-1",
    icon: <IconMedal size={20} className="text-slate-400 mb-1" />,
  },
  3: {
    blockH: "h-14",
    blockBg: "bg-orange-400",
    blockText: "text-orange-950",
    avatarBg: "bg-orange-100",
    avatarText: "text-orange-800",
    order: "order-3",
    icon: <IconMedal2 size={20} className="text-orange-400 mb-1" />,
  },
} as const;

const PODIUM_DELAY: Record<1 | 2 | 3, number> = { 1: 400, 2: 0, 3: 200 };

function PodiumSpot({ entry, isMe }: { entry: RankingEntry; isMe: boolean }) {
  const cfg = PODIUM[entry.rank as 1 | 2 | 3];
  const delay = PODIUM_DELAY[entry.rank as 1 | 2 | 3];
  return (
    <div
      className={`flex flex-col items-center ${cfg.order} animate-podium-rise`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {cfg.icon}
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center text-base font-bold shrink-0 ${cfg.avatarBg} ${cfg.avatarText} ${isMe ? "ring-4 ring-primary ring-offset-2" : ""}`}
      >
        {initials(entry.name, entry.lastName)}
      </div>
      <p className="mt-2 text-xs font-semibold text-center w-24 truncate leading-tight">
        {entry.name} {entry.lastName}
      </p>
      <p className="text-xs text-secondary mb-1">{entry.total_points} pts</p>
      <div
        className={`w-24 ${cfg.blockH} ${cfg.blockBg} rounded-t-xl flex items-center justify-center`}
      >
        <span className={`text-3xl font-black ${cfg.blockText}`}>
          {entry.rank}
        </span>
      </div>
    </div>
  );
}

function PodiumSpotSkeleton({
  blockH,
  order,
}: {
  blockH: string;
  order: string;
}) {
  return (
    <div className={`flex flex-col items-center ${order}`}>
      <Skeleton className="w-5 h-5 rounded-full mb-1" />
      <Skeleton className="w-14 h-14 rounded-full" />
      <Skeleton className="mt-2 w-20 h-3" />
      <Skeleton className="mt-1.5 w-12 h-3 mb-1" />
      <Skeleton className={`w-24 ${blockH} rounded-t-xl rounded-b-none`} />
    </div>
  );
}

function PodiumSkeleton() {
  return (
    <>
      <div className="flex justify-center items-end gap-3 sm:gap-6 mb-6">
        <PodiumSpotSkeleton blockH="h-20" order="order-1" />
        <PodiumSpotSkeleton blockH="h-28" order="order-2" />
        <PodiumSpotSkeleton blockH="h-14" order="order-3" />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto mb-8">
        <Skeleton className="h-14 flex-1 rounded-xl" />
        <Skeleton className="h-14 flex-1 rounded-xl" />
      </div>
      <div className="border-t border-gray-100 my-6" />
      <Skeleton className="h-9 w-48 mb-4" />
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex gap-4">
          <Skeleton className="h-4 w-6" />
          <Skeleton className="h-4 w-32" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 border-b last:border-0 border-gray-50"
          >
            <Skeleton className="w-5 h-4 shrink-0" />
            <Skeleton className="w-7 h-7 rounded-full shrink-0" />
            <Skeleton className="h-4 flex-1 max-w-[160px]" />
            <Skeleton className="h-4 w-12 ml-auto" />
          </div>
        ))}
      </div>
    </>
  );
}

export default function RankingPage() {
  const auth = useAuth();
  const { user } = useUser() ?? {};
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingRanking, setIsLoadingRanking] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const { id, sessionToken } = auth?.auth ?? {};
    if (!id || !sessionToken || !user) return;

    setIsLoadingClasses(true);

    const load = async () => {
      try {
        let loaded: ClassData[] = [];

        if (user.role === "teacher" || user.role === "admin") {
          const res = await ClassService.getByTutor(id, sessionToken);
          loaded = Array.isArray(res) ? res : [];
        } else {
          // GET /user-class/user/:user_id devuelve detalles completos de clase directamente
          const ucRes = await UserClassService.getClassesByUser(
            id,
            sessionToken,
          );
          loaded = ucRes.data ?? [];
        }

        setClasses(loaded);
        if (loaded.length > 0) setSelectedClassId(loaded[0].id);
      } catch {
        notify({
          variant: "error",
          title: "Error",
          message: "No se pudieron cargar tus clases.",
        });
      } finally {
        setIsLoadingClasses(false);
      }
    };

    load();
  }, [auth?.auth?.sessionToken, user?.role]);

  useEffect(() => {
    const { sessionToken } = auth?.auth ?? {};
    if (!selectedClassId || !sessionToken) return;

    setIsLoadingRanking(true);
    setSearch("");
    setRanking([]);

    const load = async () => {
      try {
        const res = await StatsService.getRanking(
          selectedClassId,
          sessionToken,
        );
        const entries: RankingEntry[] = (res.data ?? []).map((e) => ({
          ...e,
          id: e.user_id,
        }));
        setRanking(entries);
      } catch {
        notify({
          variant: "error",
          title: "Error",
          message: "No se pudo cargar el ranking.",
        });
      } finally {
        setIsLoadingRanking(false);
      }
    };

    load();
  }, [selectedClassId, auth?.auth?.sessionToken]);

  const myId = auth?.auth?.id;
  const podiumTop3 = ranking.slice(0, 3);
  const podiumRest = ranking.slice(3, 5);
  const selectedClass = classes.find((c) => c.id === selectedClassId);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ranking;
    return ranking.filter(
      (e) =>
        `${e.name} ${e.lastName}`.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q),
    );
  }, [ranking, search]);

  return (
    <Page>
      <div className="px-6 py-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Ranking</h1>
            {selectedClass && (
              <p className="text-secondary text-sm mt-0.5">
                {selectedClass.description}
              </p>
            )}
          </div>

          {isLoadingClasses ? (
            <Skeleton className="h-9 w-44" />
          ) : classes.length > 1 ? (
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="border border-gray-200 rounded-button px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : null}
        </div>

        {/* No classes */}
        {!isLoadingClasses && classes.length === 0 && (
          <p className="text-center text-secondary py-24">
            No perteneces a ninguna clase todavía.
          </p>
        )}

        {/* Podium loading */}
        {isLoadingRanking && <PodiumSkeleton />}

        {/* Podium + table */}
        {!isLoadingRanking && ranking.length > 0 && (
          <>
            {/* Top 3 podium */}
            <div className="flex justify-center items-end gap-3 sm:gap-6 mb-6">
              {podiumTop3.map((entry) => (
                <PodiumSpot
                  key={entry.id}
                  entry={entry}
                  isMe={entry.id === myId}
                />
              ))}
            </div>

            {/* Positions 4 & 5 */}
            {podiumRest.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto mb-8">
                {podiumRest.map((entry, i) => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-3 flex-1 border rounded-xl px-4 py-3 animate-fade-in-up ${entry.id === myId ? "border-primary ring-1 ring-primary" : "border-gray-100"}`}
                    style={{ animationDelay: `${600 + i * 100}ms` }}
                  >
                    <span className="w-5 text-center font-bold text-secondary text-sm shrink-0">
                      {entry.rank}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
                      {initials(entry.name, entry.lastName)}
                    </div>
                    <p className="text-sm font-medium flex-1 truncate">
                      {entry.name} {entry.lastName}
                    </p>
                    <span className="text-sm font-semibold shrink-0">
                      {entry.total_points} pts
                    </span>
                    <button
                      onClick={() => navigate(`/profile/${entry.id}`)}
                      className="ml-2 text-secondary hover:text-primary transition-colors shrink-0"
                    >
                      <IconEye size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-gray-100 my-6" />

            {/* Search */}
            <div className="mb-4">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Buscar alumno..."
                className="w-full"
              />
            </div>

            {/* Full ranking table */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 font-semibold text-secondary w-10">
                      #
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-secondary">
                      Alumno
                    </th>
                    <th className="text-right px-4 py-3 font-semibold text-secondary pr-5">
                      Puntos
                    </th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center text-secondary py-10"
                      >
                        No se encontraron alumnos.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((entry, i) => (
                      <tr
                        key={entry.id}
                        className={`border-b last:border-0 border-gray-50 transition-colors animate-fade-in-up ${entry.id === myId ? "bg-primary/5" : "hover:bg-gray-50/60"}`}
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        <td className="px-4 py-3">
                          <span
                            className={`font-bold text-sm ${
                              entry.rank === 1
                                ? "text-yellow-500"
                                : entry.rank === 2
                                  ? "text-slate-400"
                                  : entry.rank === 3
                                    ? "text-orange-400"
                                    : "text-secondary"
                            }`}
                          >
                            {entry.rank}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
                              {initials(entry.name, entry.lastName)}
                            </div>
                            <span
                              className={
                                entry.id === myId ? "font-semibold" : ""
                              }
                            >
                              {entry.name} {entry.lastName}
                            </span>
                            {entry.id === myId && (
                              <span className="text-xs text-primary font-medium">
                                (Tú)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right pr-5 font-semibold">
                          {entry.total_points}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => navigate(`/profile/${entry.id}`)}
                            className="text-secondary hover:text-primary transition-colors"
                          >
                            <IconEye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Empty class */}
        {!isLoadingRanking && classes.length > 0 && ranking.length === 0 && (
          <p className="text-center text-secondary py-24">
            Aún no hay alumnos en esta clase.
          </p>
        )}
      </div>
    </Page>
  );
}
