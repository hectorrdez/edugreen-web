import { useState, useEffect, type FormEvent, type ReactNode } from "react";
import {
  IconAlertCircle,
  IconBuilding,
  IconChartBar,
  IconCheck,
  IconPencil,
  IconPlus,
  IconTrash,
  IconTrophy,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
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
import useAuth from "@contexts/AccessContext";
import InstitutionService, { type InstitutionData } from "@services/InstitutionService";
import StatsService, { type PlatformStatsData } from "@services/StatsService";

export default function AdminPanelPage() {
  const { auth } = useAuth()!;
  const token = auth!.sessionToken;

  return (
    <Page>
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-10">
        <div>
          <h1 className="text-2xl font-bold">Panel de administración</h1>
          <p className="text-muted-foreground mt-1">Gestión global de la plataforma Edugreen</p>
        </div>
        <PlatformStats token={token} />
        <InstitutionManager token={token} />
      </div>
    </Page>
  );
}

// ── Shared ────────────────────────────────────────────────────────────────────

function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
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

// ── Platform KPI cards ────────────────────────────────────────────────────────

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  color: string;
};

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm flex-1 flex flex-col gap-2">
      <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
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

function PlatformStats({ token }: { token: string }) {
  const [stats, setStats] = useState<PlatformStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    StatsService.getPlatform(token)
      .then(setStats)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [token]);

  const fmt = (n: number | undefined) =>
    n !== undefined ? n.toLocaleString("es-ES") : "—";

  const barData = stats
    ? [
        { name: "Usuarios", value: stats.total_users },
        { name: "Instituciones", value: stats.total_institutions },
        { name: "Clases", value: stats.total_classes },
        { name: "Retos", value: stats.total_challenges },
      ]
    : [];

  const donutData = stats
    ? [
        { name: "Completadas", value: stats.completed_enrollments, color: "#22c55e" },
        {
          name: "En progreso",
          value: stats.total_enrollments - stats.completed_enrollments,
          color: "#e5e7eb",
        },
      ]
    : [];

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Resumen de la plataforma</h2>

      {error && <ErrorBanner message={error} onRetry={load} />}

      <Row className="gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              icon={<IconUsers size={20} />}
              label="Usuarios totales"
              value={fmt(stats?.total_users)}
              color="bg-blue-100 text-blue-600"
            />
            <StatCard
              icon={<IconBuilding size={20} />}
              label="Instituciones"
              value={fmt(stats?.total_institutions)}
              color="bg-green-100 text-green-600"
            />
            <StatCard
              icon={<IconTrophy size={20} />}
              label="Retos creados"
              value={fmt(stats?.total_challenges)}
              color="bg-yellow-100 text-yellow-600"
            />
            <StatCard
              icon={<IconChartBar size={20} />}
              label="Tasa de completado"
              value={stats ? `${stats.completion_rate.toFixed(1)}%` : "—"}
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
            <BarChart data={barData} title="Distribución de la plataforma" color="#22c55e" />
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

// ── Institution manager ───────────────────────────────────────────────────────

const EMPTY_FORM = { name: "", student_domain: "", teacher_domain: "" };

const TABLE_COLS = ["Nombre", "Dominio alumnos", "Dominio profesores", "Creada", ""];

function TableHeader() {
  return (
    <thead className="bg-muted/50 text-left">
      <tr>
        {TABLE_COLS.map((col) => (
          <th key={col} className="px-6 py-3 font-semibold text-muted-foreground text-sm">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4"><Skeleton className="h-4 w-36" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-44" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-44" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
      <td className="px-6 py-4"><div className="flex justify-end"><Skeleton className="h-6 w-6" /></div></td>
    </tr>
  );
}

const PAGE_SIZE = 10;

function InstitutionManager({ token }: { token: string }) {
  const [institutions, setInstitutions] = useState<InstitutionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = institutions.filter((inst) => {
    const q = search.toLowerCase();
    return (
      inst.name.toLowerCase().includes(q) ||
      inst.student_domain.toLowerCase().includes(q) ||
      inst.teacher_domain.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function load() {
    setLoading(true);
    setError(null);
    InstitutionService.getAll(token)
      .then((res) => setInstitutions(Array.isArray(res) ? res : []))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [token]);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const created = await InstitutionService.create(form, token);
      setInstitutions((prev) => [...prev, created]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      await InstitutionService.deleteOne(id, token);
      setInstitutions((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setConfirmDeleteId(null);
    }
  }

  function handleEditStart(inst: InstitutionData) {
    setEditingId(inst.id);
    setEditForm({ name: inst.name, student_domain: inst.student_domain, teacher_domain: inst.teacher_domain });
    setShowForm(false);
    setConfirmDeleteId(null);
    setError(null);
  }

  function handleEditCancel() {
    setEditingId(null);
    setEditForm(EMPTY_FORM);
  }

  async function handleEditSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    setError(null);
    try {
      await InstitutionService.updateOne(editingId, editForm, token);
      setInstitutions((prev) =>
        prev.map((i) => (i.id === editingId ? { ...i, ...editForm } : i))
      );
      setEditingId(null);
      setEditForm(EMPTY_FORM);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function toggleForm() {
    setShowForm((p) => !p);
    setForm(EMPTY_FORM);
    setEditingId(null);
    setEditForm(EMPTY_FORM);
    setError(null);
  }

  return (
    <section className="flex flex-col gap-4">
      <Row className="justify-between items-center">
        <h2 className="text-lg font-semibold">Instituciones</h2>
        <Button onClick={toggleForm}>
          {showForm ? (
            <Row className="items-center gap-1.5"><IconX size={16} />Cancelar</Row>
          ) : (
            <Row className="items-center gap-1.5"><IconPlus size={16} />Nueva institución</Row>
          )}
        </Button>
      </Row>

      <Row className="items-center gap-4">
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Buscar por nombre o dominio..."
          className="flex-1"
        />
        {!loading && (
          <span className="text-sm text-muted-foreground shrink-0">
            {filtered.length} {filtered.length === 1 ? "institución" : "instituciones"}
          </span>
        )}
      </Row>

      {error && <ErrorBanner message={error} onRetry={!loading ? load : undefined} />}

      {showForm && (
        <div className="bg-card rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <h3 className="font-semibold">Nueva institución</h3>
            <Row className="gap-4">
              <Column className="flex-1 gap-1.5">
                <label className="text-sm font-medium">Nombre</label>
                <Input
                  value={form.name}
                  onChange={(v) => setForm((p) => ({ ...p, name: v }))}
                  placeholder="Ej. IES María de Molina"
                />
              </Column>
              <Column className="flex-1 gap-1.5">
                <label className="text-sm font-medium">Dominio alumnos</label>
                <Input
                  value={form.student_domain}
                  onChange={(v) => setForm((p) => ({ ...p, student_domain: v }))}
                  placeholder="Ej. alumno.iesmariademolina.es"
                />
              </Column>
              <Column className="flex-1 gap-1.5">
                <label className="text-sm font-medium">Dominio profesores</label>
                <Input
                  value={form.teacher_domain}
                  onChange={(v) => setForm((p) => ({ ...p, teacher_domain: v }))}
                  placeholder="Ej. prof.iesmariademolina.es"
                />
              </Column>
            </Row>
            <Row className="justify-end">
              <Button type="submit" disabled={creating}>
                {creating ? "Creando..." : "Crear institución"}
              </Button>
            </Row>
          </form>
        </div>
      )}

      {editingId && (
        <div className="bg-card rounded-2xl p-6 shadow-sm ring-2 ring-primary/20">
          <form onSubmit={handleEditSave} className="flex flex-col gap-4">
            <h3 className="font-semibold">Editar institución</h3>
            <Row className="gap-4">
              <Column className="flex-1 gap-1.5">
                <label className="text-sm font-medium">Nombre</label>
                <Input
                  value={editForm.name}
                  onChange={(v) => setEditForm((p) => ({ ...p, name: v }))}
                  placeholder="Ej. IES María de Molina"
                />
              </Column>
              <Column className="flex-1 gap-1.5">
                <label className="text-sm font-medium">Dominio alumnos</label>
                <Input
                  value={editForm.student_domain}
                  onChange={(v) => setEditForm((p) => ({ ...p, student_domain: v }))}
                  placeholder="Ej. alumno.iesmariademolina.es"
                />
              </Column>
              <Column className="flex-1 gap-1.5">
                <label className="text-sm font-medium">Dominio profesores</label>
                <Input
                  value={editForm.teacher_domain}
                  onChange={(v) => setEditForm((p) => ({ ...p, teacher_domain: v }))}
                  placeholder="Ej. prof.iesmariademolina.es"
                />
              </Column>
            </Row>
            <Row className="justify-between items-center">
              <button
                type="button"
                onClick={handleEditCancel}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
              <Button type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </Row>
          </form>
        </div>
      )}

      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <table className="w-full text-sm">
            <TableHeader />
            <tbody className="divide-y divide-gray-100">
              {Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} />)}
            </tbody>
          </table>
        ) : paginated.length === 0 && !error ? (
          <p className="p-6 text-muted-foreground text-sm">
            {search ? "No hay instituciones que coincidan con la búsqueda." : "No hay instituciones registradas aún."}
          </p>
        ) : !error ? (
          <table className="w-full text-sm">
            <TableHeader />
            <tbody className="divide-y divide-gray-100">
              {paginated.map((inst) => (
                <tr
                  key={inst.id}
                  className={`transition-colors ${editingId === inst.id ? "bg-primary/5" : "hover:bg-muted/20"}`}
                >
                  <td className="px-6 py-4 font-medium">{inst.name}</td>
                  <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{inst.student_domain}</td>
                  <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{inst.teacher_domain}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(inst.created_at).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-6 py-4">
                    {confirmDeleteId === inst.id ? (
                      <Row className="gap-3 justify-end items-center">
                        <button
                          onClick={() => handleDelete(inst.id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
                        >
                          <IconCheck size={13} />Confirmar
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
                        <button
                          onClick={() => handleEditStart(inst)}
                          className={`transition-colors p-1 rounded ${editingId === inst.id ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                          title="Editar institución"
                        >
                          <IconPencil size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(inst.id)}
                          className="text-muted-foreground hover:text-red-600 transition-colors p-1 rounded"
                          title="Eliminar institución"
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

      <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
    </section>
  );
}
