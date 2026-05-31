import {
  useState,
  useEffect,
  useMemo,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  IconAlertCircle,
  IconBook,
  IconChartBar,
  IconCheck,
  IconEye,
  IconLayoutDashboard,
  IconMail,
  IconPencil,
  IconPlus,
  IconSettings,
  IconStar,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import Page from "@components/layouts/Page";
import Button from "@components/controls/Button";
import Input from "@components/inputs/Input";
import SearchBar from "@components/inputs/SearchBar";
import Pagination from "@components/controls/Pagination";
import Row from "@components/placing/Row";
import Column from "@components/placing/Column";
import Skeleton from "@components/feedback/Skeleton";
import BarChart from "@components/charts/BarChart";
import DonutChart from "@components/charts/DonutChart";
import CreateChallengeModal from "@components/challenges/CreateChallengeModal";
import useAuth from "@contexts/AccessContext";
import ClassService, { type ClassData } from "@services/ClassService";
import UserClassService from "@services/UserClassService";
import UserService, { type UserData } from "@services/UserService";
import StatsService, { type ClassStatsData } from "@services/StatsService";
import ChallengeService, {
  type ChallengeData,
} from "@services/ChallengeService";

const PAGE_SIZE = 8;

type ClassEntry = { id: string; name: string };

const classesKey = (tid: string) => `teacher_classes_${tid}`;
const activeKey = (tid: string) => `teacher_active_${tid}`;

function readClasses(tid: string): ClassEntry[] {
  try {
    const raw = localStorage.getItem(classesKey(tid));
    if (raw) return JSON.parse(raw);
    const legacy = localStorage.getItem(`teacher_class_${tid}`);
    if (legacy) {
      const migrated: ClassEntry[] = [{ id: legacy, name: "Clase" }];
      localStorage.setItem(classesKey(tid), JSON.stringify(migrated));
      localStorage.setItem(activeKey(tid), legacy);
      return migrated;
    }
    return [];
  } catch {
    return [];
  }
}

function persistClasses(tid: string, classes: ClassEntry[]) {
  localStorage.setItem(classesKey(tid), JSON.stringify(classes));
}

function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700">
      <IconAlertCircle size={18} className="shrink-0" />
      <span className="text-sm flex-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-semibold underline hover:no-underline shrink-0"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  color: string;
};

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm flex-1 flex flex-col gap-2">
      <span
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
      >
        {icon}
      </span>
      <p className="text-muted-foreground text-sm mt-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm flex-1 flex flex-col gap-3">
      <Skeleton className="w-10 h-10" />
      <Skeleton className="w-28 h-4 mt-1" />
      <Skeleton className="w-16 h-8" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm flex-1 flex flex-col gap-4">
      <Skeleton className="w-40 h-4" />
      <Skeleton className="w-full h-44" />
    </div>
  );
}

type Tab = "principal" | "retos" | "alumnos" | "ajustes";

const NAV_ITEMS: { key: Tab; label: string; icon: ReactNode }[] = [
  {
    key: "principal",
    label: "Principal",
    icon: <IconLayoutDashboard size={18} />,
  },
  { key: "retos", label: "Retos", icon: <IconBook size={18} /> },
  { key: "alumnos", label: "Alumnos", icon: <IconUsers size={18} /> },
  { key: "ajustes", label: "Ajustes", icon: <IconSettings size={18} /> },
];

export default function TeacherPanelPage() {
  const { auth } = useAuth()!;
  const token = auth!.sessionToken;
  const teacherId = auth!.id;

  const [classes, setClasses] = useState<ClassEntry[]>(() =>
    readClasses(teacherId),
  );
  const [classId, setClassId] = useState<string | null>(() => {
    const stored = readClasses(teacherId);
    const active = localStorage.getItem(activeKey(teacherId));
    if (active && stored.some((c) => c.id === active)) return active;
    return stored[0]?.id ?? null;
  });
  const [tab, setTab] = useState<Tab>("principal");
  const [creatingNew, setCreatingNew] = useState(false);
  const [syncingClasses, setSyncingClasses] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    setSyncingClasses(true);
    setSyncError(null);
    const localSnapshot = readClasses(teacherId);

    ClassService.getByTutor(teacherId, token)
      .then((apiClasses) => {
        const entries: ClassEntry[] = (apiClasses ?? []).map((c) => ({
          id: c.id,
          name: c.name,
        }));

        if (entries.length > 0 || localSnapshot.length === 0) {
          persistClasses(teacherId, entries);
          setClasses(entries);

          if (entries.length > 0) {
            const currentActive = localStorage.getItem(activeKey(teacherId));
            if (currentActive && entries.some((c) => c.id === currentActive)) {
              setClassId(currentActive);
            } else {
              localStorage.setItem(activeKey(teacherId), entries[0].id);
              setClassId(entries[0].id);
            }
          } else {
            localStorage.removeItem(activeKey(teacherId));
            setClassId(null);
          }
        }
      })
      .catch((e: Error) => setSyncError(e.message))
      .finally(() => setSyncingClasses(false));
  }, [teacherId, token]);

  function handleClassCreated(id: string, name: string) {
    setClasses((prev) => {
      const next = [...prev, { id, name }];
      persistClasses(teacherId, next);
      return next;
    });
    localStorage.setItem(activeKey(teacherId), id);
    setClassId(id);
    setCreatingNew(false);
    setTab("principal");
  }

  function handleSwitchClass(id: string) {
    localStorage.setItem(activeKey(teacherId), id);
    setClassId(id);
    setTab("principal");
  }

  function handleClassRenamed(id: string, name: string) {
    setClasses((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, name } : c));
      persistClasses(teacherId, next);
      return next;
    });
  }

  function handleClassDeleted(id: string) {
    setClasses((prev) => {
      const next = prev.filter((c) => c.id !== id);
      persistClasses(teacherId, next);
      const nextActive = next[0]?.id ?? null;
      if (nextActive) localStorage.setItem(activeKey(teacherId), nextActive);
      else localStorage.removeItem(activeKey(teacherId));
      setClassId(nextActive);
      return next;
    });
    setTab("principal");
  }

  const showCreate =
    (classes.length === 0 && !syncingClasses && !syncError) || creatingNew;

  if (syncingClasses && classes.length === 0) {
    return (
      <Page>
        <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
          <div className="w-52 shrink-0 flex flex-col gap-5">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-9 w-full rounded-xl" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <Skeleton className="h-6 w-48" />
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 flex-1 rounded-2xl" />
              ))}
            </div>
            <div className="flex gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-52 flex-1 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </Page>
    );
  }

  if (!syncingClasses && syncError && classes.length === 0) {
    return (
      <Page>
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-4 max-w-lg">
          <h1 className="text-lg font-bold">Panel del profesor</h1>
          <ErrorBanner
            message={`No se pudieron cargar tus clases: ${syncError}`}
            onRetry={() => {
              setSyncError(null);
              setSyncingClasses(true);
              ClassService.getByTutor(teacherId, token)
                .then((apiClasses) => {
                  const entries: ClassEntry[] = (apiClasses ?? []).map((c) => ({
                    id: c.id,
                    name: c.name,
                  }));
                  persistClasses(teacherId, entries);
                  setClasses(entries);
                  if (entries.length > 0) {
                    localStorage.setItem(activeKey(teacherId), entries[0].id);
                    setClassId(entries[0].id);
                  }
                })
                .catch((e: Error) => setSyncError(e.message))
                .finally(() => setSyncingClasses(false));
            }}
          />
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {showCreate ? (
          <CreateClass
            token={token}
            teacherId={teacherId}
            onCreated={handleClassCreated}
            onCancel={
              classes.length > 0 ? () => setCreatingNew(false) : undefined
            }
          />
        ) : (
          <div className="flex gap-8 items-start">
            <aside className="w-52 shrink-0 sticky top-8 flex flex-col gap-5">
              <h1 className="text-lg font-bold">Panel del profesor</h1>

              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-muted-foreground px-1">
                  Clase activa
                </p>
                {syncingClasses ? (
                  <Skeleton className="h-9 w-full rounded-xl" />
                ) : (
                  <select
                    value={classId ?? ""}
                    onChange={(e) => handleSwitchClass(e.target.value)}
                    className="w-full text-sm rounded-xl border border-gray-200 bg-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <nav className="flex flex-col gap-0.5">
                {NAV_ITEMS.map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                      tab === key
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </nav>
            </aside>

            {classId && token && (
              <main className="flex-1 min-w-0 flex flex-col gap-6">
                {tab === "principal" && (
                  <ClassStats classId={classId} token={token} />
                )}
                {tab === "retos" && (
                  <ChallengeManager classId={classId} token={token} />
                )}
                {tab === "alumnos" && (
                  <StudentManager classId={classId} token={token} />
                )}
                {tab === "ajustes" && (
                  <ClassSettings
                    classId={classId}
                    token={token}
                    onRenamed={handleClassRenamed}
                    onDeleted={handleClassDeleted}
                    onCreateNew={() => setCreatingNew(true)}
                  />
                )}
              </main>
            )}
          </div>
        )}
      </div>
    </Page>
  );
}

// ── Create class ──────────────────────────────────────────────────────────────

function CreateClass({
  token,
  teacherId,
  onCreated,
  onCancel,
}: {
  token: string;
  teacherId: string;
  onCreated: (id: string, name: string) => void;
  onCancel?: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const created = await ClassService.create(
        {
          name: name.trim(),
          tutor_id: teacherId,
          description: description.trim() || undefined,
        },
        token,
      );
      onCreated(created.id, created.name);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-16">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <IconBook size={32} className="text-primary" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold">Crea una nueva clase</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Asigna un nombre y descripción para empezar a gestionar alumnos y
          retos.
        </p>
      </div>
      <div className="bg-card rounded-2xl p-8 shadow-sm w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <ErrorBanner message={error} />}
          <Column className="gap-1.5">
            <label className="text-sm font-medium">Nombre de la clase *</label>
            <Input
              value={name}
              onChange={setName}
              placeholder="Ej. 2º Bachillerato A"
            />
          </Column>
          <Column className="gap-1.5">
            <label className="text-sm font-medium">Descripción</label>
            <Input
              value={description}
              onChange={setDescription}
              placeholder="Ej. Biología — curso 2025-2026"
            />
          </Column>
          <Button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full"
          >
            {loading ? "Creando..." : "Crear clase"}
          </Button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
            >
              Cancelar
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

// ── Class stats ───────────────────────────────────────────────────────────────

function ClassStats({ classId, token }: { classId: string; token: string }) {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [stats, setStats] = useState<ClassStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    setError(null);
    Promise.all([
      ClassService.getOne(classId, token),
      StatsService.getByClass(classId, token),
    ])
      .then(([cls, s]) => {
        setClassData(cls);
        setStats(s);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [classId, token]);

  function startEdit() {
    if (!classData) return;
    setEditName(classData.name);
    setEditDesc(classData.description ?? "");
    setEditing(true);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await ClassService.updateOne(
        classId,
        { name: editName.trim(), description: editDesc.trim() || undefined },
        token,
      );
      setClassData((p) =>
        p
          ? {
              ...p,
              name: editName.trim(),
              description: editDesc.trim() || null,
            }
          : p,
      );
      setEditing(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const fmt = (n: number | undefined) =>
    n !== undefined ? n.toLocaleString("es-ES") : "—";

  const barData = stats
    ? [
        { name: "Completadas", value: stats.completed_enrollments },
        {
          name: "En progreso",
          value: stats.total_enrollments - stats.completed_enrollments,
        },
        { name: "Alumnos", value: stats.total_students },
        { name: "Retos", value: stats.total_challenges },
      ]
    : [];

  const donutData = stats
    ? [
        {
          name: "Completadas",
          value: stats.completed_enrollments,
          color: "#22c55e",
        },
        {
          name: "En progreso",
          value: Math.max(
            0,
            stats.total_enrollments - stats.completed_enrollments,
          ),
          color: "#e5e7eb",
        },
      ]
    : [];

  return (
    <section className="flex flex-col gap-4">
      {loading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
      ) : editing ? (
        <div className="bg-card rounded-2xl p-6 shadow-sm ring-2 ring-primary/20">
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <h3 className="font-semibold">Editar clase</h3>
            <Row className="gap-4">
              <Column className="flex-1 gap-1.5">
                <label className="text-sm font-medium">Nombre</label>
                <Input
                  value={editName}
                  onChange={setEditName}
                  placeholder="Nombre de la clase"
                />
              </Column>
              <Column className="flex-1 gap-1.5">
                <label className="text-sm font-medium">Descripción</label>
                <Input
                  value={editDesc}
                  onChange={setEditDesc}
                  placeholder="Descripción (opcional)"
                />
              </Column>
            </Row>
            <Row className="justify-between items-center">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
              <Button type="submit" disabled={saving || !editName.trim()}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </Row>
          </form>
        </div>
      ) : (
        <Row className="items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">{classData?.name ?? "—"}</h2>
            {classData?.description && (
              <p className="text-muted-foreground text-sm mt-0.5">
                {classData.description}
              </p>
            )}
          </div>
          <button
            onClick={startEdit}
            className="text-muted-foreground hover:text-primary transition-colors p-1 rounded mt-0.5 shrink-0"
            title="Editar clase"
          >
            <IconPencil size={16} />
          </button>
        </Row>
      )}

      {error && <ErrorBanner message={error} onRetry={load} />}

      <Row className="gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              icon={<IconUsers size={20} />}
              label="Alumnos"
              value={fmt(stats?.total_students)}
              color="bg-blue-100 text-blue-600"
            />
            <StatCard
              icon={<IconBook size={20} />}
              label="Retos activos"
              value={fmt(stats?.total_challenges)}
              color="bg-yellow-100 text-yellow-600"
            />
            <StatCard
              icon={<IconChartBar size={20} />}
              label="Tasa de completado"
              value={stats ? `${stats.completion_rate.toFixed(1)}%` : "—"}
              color="bg-green-100 text-green-600"
            />
            <StatCard
              icon={<IconStar size={20} />}
              label="Puntos otorgados"
              value={fmt(stats?.total_points_awarded)}
              color="bg-purple-100 text-purple-600"
            />
          </>
        )}
      </Row>

      <Row className="gap-4">
        {loading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : stats ? (
          <>
            <BarChart data={barData} title="Actividad de la clase" />
            <DonutChart
              data={donutData}
              centerLabel={`${stats.completion_rate.toFixed(0)}%`}
              title="Estado de matrículas"
            />
          </>
        ) : null}
      </Row>
    </section>
  );
}

// ── Challenge manager ─────────────────────────────────────────────────────────

const CHALLENGE_COLS = ["Reto", "Descripción", "Puntos", ""];

function ChallengeTableHeader() {
  return (
    <thead className="bg-muted/50 text-left">
      <tr>
        {CHALLENGE_COLS.map((col) => (
          <th
            key={col}
            className="px-6 py-3 font-semibold text-muted-foreground text-sm"
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function ChallengeRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-40" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-56" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-10" />
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end gap-2">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-6" />
        </div>
      </td>
    </tr>
  );
}

function ChallengeManager({
  classId,
  token,
}: {
  classId: string;
  token: string;
}) {
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] =
    useState<ChallengeData | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    ChallengeService.getByClass(classId, token)
      .then((res) => setChallenges(res ?? []))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [classId, token]);

  async function handleDelete(id: string) {
    setError(null);
    try {
      await ChallengeService.deleteOne(id, token);
      setChallenges((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setConfirmDeleteId(null);
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <Row className="items-center justify-between">
        <h2 className="text-lg font-semibold">Retos</h2>
        <Button onClick={() => setCreateOpen(true)}>
          <Row className="items-center gap-1.5">
            <IconPlus size={14} />
            Nuevo reto
          </Row>
        </Button>
      </Row>

      {error && <ErrorBanner message={error} onRetry={load} />}

      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <table className="w-full text-sm">
            <ChallengeTableHeader />
            <tbody className="divide-y divide-gray-100">
              {Array.from({ length: 3 }).map((_, i) => (
                <ChallengeRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        ) : challenges.length === 0 && !error ? (
          <p className="p-6 text-muted-foreground text-sm">
            No hay retos aún. Crea el primero con el botón de arriba.
          </p>
        ) : !error ? (
          <table className="w-full text-sm">
            <ChallengeTableHeader />
            <tbody className="divide-y divide-gray-100">
              {challenges.map((challenge) => (
                <tr
                  key={challenge.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{challenge.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {challenge.description ?? <span className="italic">—</span>}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {challenge.points}
                  </td>
                  <td className="px-6 py-4">
                    {confirmDeleteId === challenge.id ? (
                      <Row className="gap-3 justify-end items-center">
                        <button
                          onClick={() => handleDelete(challenge.id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
                        >
                          <IconCheck size={13} />
                          Confirmar
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Cancelar
                        </button>
                      </Row>
                    ) : (
                      <Row className="justify-end gap-1">
                        <Link
                          to={`/challenge/${challenge.id}`}
                          className="text-muted-foreground hover:text-primary transition-colors p-1 rounded"
                          title="Ver reto"
                        >
                          <IconEye size={16} />
                        </Link>
                        <button
                          onClick={() => setEditingChallenge(challenge)}
                          className="text-muted-foreground hover:text-primary transition-colors p-1 rounded"
                          title="Editar reto"
                        >
                          <IconPencil size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(challenge.id)}
                          className="text-muted-foreground hover:text-red-600 transition-colors p-1 rounded"
                          title="Eliminar reto"
                        >
                          <IconTrash size={16} />
                        </button>
                      </Row>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>

      <CreateChallengeModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(c) => {
          setChallenges((prev) => [c, ...prev]);
          setCreateOpen(false);
        }}
        classId={classId}
      />

      <CreateChallengeModal
        open={!!editingChallenge}
        onClose={() => setEditingChallenge(null)}
        challenge={editingChallenge ?? undefined}
        onUpdated={(updated) => {
          setChallenges((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c)),
          );
          setEditingChallenge(null);
        }}
      />
    </section>
  );
}

// ── Class settings ────────────────────────────────────────────────────────────

function ClassSettings({
  classId,
  token,
  onRenamed,
  onDeleted,
  onCreateNew,
}: {
  classId: string;
  token: string;
  onRenamed: (id: string, name: string) => void;
  onDeleted: (id: string) => void;
  onCreateNew: () => void;
}) {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setConfirmDelete(false);
    ClassService.getOne(classId, token)
      .then((cls) => {
        setClassData(cls);
        setName(cls.name);
        setDescription(cls.description ?? "");
        onRenamed(classId, cls.name);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [classId, token]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await ClassService.updateOne(
        classId,
        { name: name.trim(), description: description.trim() || undefined },
        token,
      );
      setClassData((p) =>
        p
          ? { ...p, name: name.trim(), description: description.trim() || null }
          : p,
      );
      onRenamed(classId, name.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await ClassService.deleteOne(classId, token);
      onDeleted(classId);
    } catch (err) {
      setError((err as Error).message);
      setDeleting(false);
    }
  }

  const dirty =
    name.trim() !== (classData?.name ?? "") ||
    description.trim() !== (classData?.description ?? "");

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-semibold">Ajustes de la clase</h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Modifica el nombre y la descripción de tu clase.
        </p>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Edit name / description */}
      <div className="bg-card rounded-2xl p-6 shadow-sm max-w-lg">
        {loading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Column className="gap-1.5">
              <label className="text-sm font-medium">Nombre *</label>
              <Input
                value={name}
                onChange={setName}
                placeholder="Ej. 2º Bachillerato A"
              />
            </Column>
            <Column className="gap-1.5">
              <label className="text-sm font-medium">Descripción</label>
              <Input
                value={description}
                onChange={setDescription}
                placeholder="Ej. Biología — curso 2025-2026"
              />
            </Column>
            <Row className="items-center justify-between pt-1">
              {saved ? (
                <span className="text-sm text-green-600 flex items-center gap-1.5 font-medium">
                  <IconCheck size={15} />
                  Guardado
                </span>
              ) : (
                <span />
              )}
              <Button type="submit" disabled={saving || !name.trim() || !dirty}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </Row>
          </form>
        )}
      </div>

      {/* Create new class */}
      <div className="bg-card rounded-2xl p-6 shadow-sm max-w-lg flex flex-col gap-3">
        <div>
          <h3 className="font-semibold">Nueva clase</h3>
          <p className="text-muted-foreground text-sm mt-0.5">
            Crea una clase adicional para gestionar otro grupo de alumnos.
          </p>
        </div>
        <div>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 text-sm font-medium border border-gray-200 hover:border-primary hover:text-primary px-4 py-2 rounded-xl transition-colors"
          >
            <IconPlus size={15} />
            Crear nueva clase
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-card rounded-2xl p-6 shadow-sm max-w-lg flex flex-col gap-3 border border-red-100">
        <div>
          <h3 className="font-semibold text-red-700">Zona de peligro</h3>
          <p className="text-muted-foreground text-sm mt-0.5">
            Eliminar la clase borrará permanentemente todos sus alumnos, retos y
            estadísticas.
          </p>
        </div>
        {confirmDelete ? (
          <Row className="gap-3 items-center">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              {deleting ? "Eliminando..." : "Sí, eliminar clase"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
          </Row>
        ) : (
          <div>
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
            >
              Eliminar clase
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Student manager ───────────────────────────────────────────────────────────

const STUDENT_COLS = ["Alumno", "Correo electrónico", ""];

function StudentTableHeader() {
  return (
    <thead className="bg-muted/50 text-left">
      <tr>
        {STUDENT_COLS.map((col) => (
          <th
            key={col}
            className="px-6 py-3 font-semibold text-muted-foreground text-sm"
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function StudentRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4">
        <Row className="items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </Row>
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-44" />
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end">
          <Skeleton className="h-6 w-6" />
        </div>
      </td>
    </tr>
  );
}

function StudentAvatar({ name, lastName }: { name: string; lastName: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
      {name[0]}
      {lastName[0]}
    </div>
  );
}

function StudentManager({
  classId,
  token,
}: {
  classId: string;
  token: string;
}) {
  const { auth } = useAuth()!;
  const [students, setStudents] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);

  const [addEmail, setAddEmail] = useState("");
  const [foundUsers, setFoundUsers] = useState<UserData[]>([]);
  const [searchingUser, setSearchingUser] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    UserClassService.getUsersByClass(classId, token)
      .then(async (res) => {
        const memberships = res ?? [];
        const profiles = await Promise.all(
          memberships.map((m) =>
            UserService.getOne(m.user_id, token).catch(() => null),
          ),
        );
        setStudents(profiles.filter(Boolean) as UserData[]);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [classId, token]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q),
    );
  }, [students, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
  }

  async function handleFindUser(e: FormEvent) {
    e.preventDefault();
    if (!addEmail.trim()) return;
    setSearchingUser(true);
    setAddError(null);
    setFoundUsers([]);
    try {
      const results = (await UserService.searchStudents(addEmail.trim(), token)).data ?? [];
      const notInClass = results.filter((u) => !students.some((s) => s.id === u.id));
      if (notInClass.length === 0) {
        setAddError(
          results.length === 0
            ? "No se encontraron alumnos con ese criterio."
            : "Todos los alumnos encontrados ya están en la clase.",
        );
      } else {
        setFoundUsers(notInClass);
      }
    } catch (err) {
      setAddError((err as Error).message);
    } finally {
      setSearchingUser(false);
    }
  }

  async function handleAddStudent(user: UserData) {
    setAddingId(user.id);
    setAddError(null);
    try {
      await UserClassService.addUserToClass(user.id, classId, token);
      setStudents((prev) => [...prev, user]);
      setFoundUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      setAddError((err as Error).message);
    } finally {
      setAddingId(null);
    }
  }

  async function handleRemove(userId: string) {
    setError(null);
    try {
      await UserClassService.removeUserFromClass(userId, classId, token);
      setStudents((prev) => prev.filter((s) => s.id !== userId));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setConfirmRemoveId(null);
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Alumnos</h2>

      <div className="bg-card rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <Row className="items-center gap-2">
          <IconMail size={16} className="text-muted-foreground shrink-0" />
          <h3 className="font-semibold text-sm">Buscar y añadir alumno</h3>
        </Row>
        <form onSubmit={handleFindUser} className="flex flex-col gap-3">
          <Row className="gap-3">
            <Input
              type="search"
              value={addEmail}
              onChange={setAddEmail}
              placeholder="Buscar por email..."
              className="flex-1"
            />
            <Button type="submit" disabled={searchingUser || !addEmail.trim()}>
              {searchingUser ? "Buscando..." : "Buscar"}
            </Button>
          </Row>
          {addError && <ErrorBanner message={addError} />}
          {foundUsers.length > 0 && (
            <div className="flex flex-col gap-2">
              {foundUsers.map((user) => (
                <Row
                  key={user.id}
                  className="items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-3"
                >
                  <Row className="items-center gap-3">
                    <StudentAvatar name={user.name} lastName={user.lastName} />
                    <Column className="gap-0">
                      <span className="font-medium text-sm">
                        {user.name} {user.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </Column>
                  </Row>
                  <Button
                    onClick={() => handleAddStudent(user)}
                    disabled={addingId === user.id}
                  >
                    {addingId === user.id ? (
                      "Añadiendo..."
                    ) : (
                      <Row className="items-center gap-1.5">
                        <IconPlus size={14} />
                        Añadir
                      </Row>
                    )}
                  </Button>
                </Row>
              ))}
            </div>
          )}
        </form>
      </div>

      <Row className="items-center gap-4">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Buscar alumno por nombre o correo..."
          className="flex-1"
        />
        {!loading && (
          <span className="text-sm text-muted-foreground shrink-0">
            {filtered.length} {filtered.length === 1 ? "alumno" : "alumnos"}
          </span>
        )}
      </Row>

      {error && <ErrorBanner message={error} onRetry={load} />}

      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <table className="w-full text-sm">
            <StudentTableHeader />
            <tbody className="divide-y divide-gray-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <StudentRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        ) : paginated.length === 0 && !error ? (
          <p className="p-6 text-muted-foreground text-sm">
            {search
              ? "No hay alumnos que coincidan con la búsqueda."
              : "No hay alumnos en tu clase aún. Añade el primero usando el formulario de arriba."}
          </p>
        ) : !error ? (
          <table className="w-full text-sm">
            <StudentTableHeader />
            <tbody className="divide-y divide-gray-100">
              {paginated.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Row className="items-center gap-3">
                      <StudentAvatar
                        name={student.name}
                        lastName={student.lastName}
                      />
                      <span className="font-medium">
                        {student.name} {student.lastName}
                      </span>
                      {student.id === auth!.id && (
                        <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary">
                          Tú
                        </span>
                      )}
                    </Row>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {student.email}
                  </td>
                  <td className="px-6 py-4">
                    {confirmRemoveId === student.id ? (
                      <Row className="gap-3 justify-end items-center">
                        <button
                          onClick={() => handleRemove(student.id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
                        >
                          <IconCheck size={13} />
                          Confirmar
                        </button>
                        <button
                          onClick={() => setConfirmRemoveId(null)}
                          className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Cancelar
                        </button>
                      </Row>
                    ) : (
                      <Row className="justify-end">
                        <button
                          onClick={() => setConfirmRemoveId(student.id)}
                          className="text-muted-foreground hover:text-red-600 transition-colors p-1 rounded"
                          title="Eliminar alumno de la clase"
                        >
                          <IconTrash size={16} />
                        </button>
                      </Row>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>

      {!loading && filtered.length > PAGE_SIZE && (
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </section>
  );
}
