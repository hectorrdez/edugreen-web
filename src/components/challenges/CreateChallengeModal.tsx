import { useState, useRef, useEffect, type FormEvent, type ChangeEvent, type DragEvent } from "react";
import { IconAlertCircle, IconPhoto, IconX } from "@tabler/icons-react";
import Modal from "@components/feedback/Modal";
import Button from "@components/controls/Button";
import Input from "@components/inputs/Input";
import Column from "@components/placing/Column";
import Row from "@components/placing/Row";
import useAuth from "@contexts/AccessContext";
import ChallengeService, { type ChallengeData } from "@services/ChallengeService";
import EnrollmentService from "@services/EnrollmentService";
import UserClassService from "@services/UserClassService";

type CreateChallengeModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated?: (challenge: ChallengeData) => void;
  onUpdated?: (challenge: ChallengeData) => void;
  classId?: string;
  challenge?: ChallengeData;
};

export default function CreateChallengeModal({
  open,
  onClose,
  onCreated,
  onUpdated,
  classId,
  challenge,
}: CreateChallengeModalProps) {
  const { auth } = useAuth()!;

  const isEdit = !!challenge;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState<number | "">(100);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageExplicitlyRemoved, setImageExplicitlyRemoved] = useState(false);
  const [autoEnroll, setAutoEnroll] = useState(false);
  const [autoEnrollConfirmOpen, setAutoEnrollConfirmOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || !challenge) return;
    setName(challenge.name);
    setDescription(challenge.description ?? "");
    setPoints(challenge.points);
    setImagePreview(null);
    setImageFile(null);
    setImageExplicitlyRemoved(false);
    setError(null);
  }, [open, challenge?.id]);

  function readFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) readFile(file);
    e.target.value = "";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  }

  function removeImage() {
    setImagePreview(null);
    setImageFile(null);
    setImageExplicitlyRemoved(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);

    try {
      if (isEdit) {
        await ChallengeService.updateOne(
          challenge.id,
          {
            name: name.trim(),
            description: description.trim() || undefined,
            points: points !== "" ? points : undefined,
            ...(imageExplicitlyRemoved && !imageFile ? { image: null } : {}),
          },
          auth!.sessionToken,
          imageFile ?? undefined,
        );
        const updated = await ChallengeService.getOne(challenge.id, auth!.sessionToken);
        onUpdated?.(updated);
        setImagePreview(null);
        setImageFile(null);
        setImageExplicitlyRemoved(false);
      } else {
        const effectiveClassId = classId ?? "";
        if (!effectiveClassId) return;
        const created = await ChallengeService.create(
          {
            name: name.trim(),
            class_id: effectiveClassId,
            description: description.trim() || undefined,
            points: points !== "" ? points : undefined,
          },
          auth!.sessionToken,
          imageFile ?? undefined,
        );
        if (autoEnroll) {
          const members = (await UserClassService.getUsersByClass(effectiveClassId, auth!.sessionToken)) ?? [];
          await Promise.allSettled(
            members.map((m) => EnrollmentService.enroll(m.user_id, created.id, auth!.sessionToken)),
          );
        }
        onCreated?.(created);
        setName("");
        setDescription("");
        setPoints(100);
        setAutoEnroll(false);
        setImagePreview(null);
        setImageFile(null);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    setName("");
    setDescription("");
    setPoints(100);
    setAutoEnroll(false);
    setAutoEnrollConfirmOpen(false);
    setImagePreview(null);
    setImageFile(null);
    setImageExplicitlyRemoved(false);
    setError(null);
    onClose();
  }

  const effectiveClassId = classId ?? "";
  const disabled = loading || (!isEdit && !effectiveClassId);

  const existingImage =
    !imageFile && !imageExplicitlyRemoved && challenge?.image
      ? `${import.meta.env.VITE_API_IMAGE}${challenge.image}`
      : null;

  return (
    <>
    <Modal open={open} onClose={handleClose} title={isEdit ? "Editar reto" : "Nuevo reto"}>
      {!isEdit && !effectiveClassId && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 mb-4">
          <IconAlertCircle size={18} className="shrink-0" />
          <span className="text-sm">
            Primero debes crear una clase en el Panel del Profesor.
          </span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Column className="gap-1.5">
          <label className="text-sm font-medium">Nombre *</label>
          <Input
            value={name}
            onChange={setName}
            placeholder="Ej. Reto de reciclaje"
            disabled={disabled}
          />
        </Column>

        <Column className="gap-1.5">
          <label className="text-sm font-medium">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe en qué consiste el reto..."
            disabled={disabled}
            rows={3}
            className="min-w-input rounded-button px-3 py-2 text-sm bg-input text-gray-900 border border-gray-200 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none disabled:opacity-50"
          />
        </Column>

        <Column className="gap-1.5">
          <label className="text-sm font-medium">Puntos</label>
          <input
            type="number"
            min={1}
            value={points}
            onChange={(e) => setPoints(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="100"
            disabled={disabled}
            className="min-w-input rounded-button px-3 py-2 text-sm bg-input text-gray-900 border border-gray-200 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
          />
        </Column>

        <Column className="gap-1.5">
          <label className="text-sm font-medium">Imagen</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={disabled}
          />
          {imageFile ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={imagePreview!}
                alt="Vista previa"
                className="w-full h-40 object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                disabled={loading}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <IconX size={14} />
              </button>
            </div>
          ) : existingImage ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={existingImage}
                alt="Imagen actual"
                className="w-full h-40 object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                disabled={loading}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <IconX size={14} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => !disabled && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed transition-colors cursor-pointer select-none
                ${dragging ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"}
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <IconPhoto size={24} className="text-gray-400" />
              <p className="text-sm text-secondary text-center leading-tight">
                <span className="font-medium text-foreground">Haz clic para subir</span>{" "}
                o arrastra una imagen aquí
              </p>
              <p className="text-xs text-gray-400">PNG, JPG, WEBP…</p>
            </div>
          )}
        </Column>

        {!isEdit && (
          <Row className="items-center justify-between gap-3 py-1">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">Matricular automáticamente</span>
              <span className="text-xs text-secondary">Inscribe a todos los alumnos de la clase al crear el reto</span>
            </div>
            <button
              type="button"
              onClick={() => autoEnroll ? setAutoEnroll(false) : setAutoEnrollConfirmOpen(true)}
              disabled={disabled}
              className={`relative shrink-0 w-10 h-6 rounded-full transition-colors disabled:opacity-50 ${autoEnroll ? "bg-primary" : "bg-gray-200"}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-[left] duration-200 ${autoEnroll ? "left-5" : "left-1"}`}
              />
            </button>
          </Row>
        )}

        {error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700">
            <IconAlertCircle size={18} className="shrink-0" />
            <span className="text-sm flex-1">{error}</span>
          </div>
        )}
        <Row className="justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <Button
            type="submit"
            disabled={loading || !name.trim() || (!isEdit && !effectiveClassId)}
          >
            {loading
              ? isEdit ? "Guardando..." : "Creando..."
              : isEdit ? "Guardar cambios" : "Crear reto"}
          </Button>
        </Row>
      </form>
    </Modal>

    <Modal
      open={autoEnrollConfirmOpen}
      onClose={() => setAutoEnrollConfirmOpen(false)}
      title="Matriculación automática"
    >
      <p className="text-sm text-secondary mb-2">
        Al activar esta opción, <span className="font-semibold text-foreground">todos los alumnos</span> actualmente en la clase quedarán inscritos en el reto en el momento de crearlo.
      </p>
      <p className="text-sm text-secondary mb-6">
        Los alumnos que se incorporen a la clase después no serán matriculados automáticamente.
      </p>
      <Row className="justify-end gap-3">
        <button
          type="button"
          onClick={() => setAutoEnrollConfirmOpen(false)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancelar
        </button>
        <Button
          type="button"
          onClick={() => { setAutoEnroll(true); setAutoEnrollConfirmOpen(false); }}
        >
          Activar
        </Button>
      </Row>
    </Modal>
    </>
  );
}
