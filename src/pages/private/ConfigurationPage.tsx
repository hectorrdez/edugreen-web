import { useEffect, useState } from "react";
import {
  IconUser,
  IconMail,
  IconDeviceFloppy,
  IconCheck,
  IconAlertTriangle,
  IconBuilding,
  IconLoader2,
  IconLock,
  IconTrash,
  IconChevronDown,
  IconChevronUp,
  IconAlertCircle,
} from "@tabler/icons-react";
import Page from "@components/layouts/Page";
import Section from "@components/placing/Section";
import Card from "@components/cards/Card";
import Row from "@components/placing/Row";
import Column from "@components/placing/Column";
import InputField from "@components/inputs/InputField";
import useUser from "@contexts/UserContext";
import useAuth from "@contexts/AccessContext";
import UserService from "@services/UserService";
import AccessService from "@services/AccessService";
import InstitutionService, {
  type InstitutionData,
} from "@services/InstitutionService";

type FormState = {
  name: string;
  lastName: string;
  email: string;
};

type SaveStatus = "idle" | "loading" | "success" | "error";

function getEmailDomain(email: string) {
  return email.split("@")[1] ?? "";
}

export default function ConfigurationPage() {
  const { user, isLoading: userLoading, refresh } = useUser()!;
  const auth = useAuth();
  const sessionToken = auth?.auth?.sessionToken ?? "";
  const userId = auth?.auth?.id ?? "";

  const [form, setForm] = useState<FormState>({
    name: "",
    lastName: "",
    email: "",
  });
  const [institution, setInstitution] = useState<InstitutionData | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name, lastName: user.lastName, email: user.email });
  }, [user]);

  useEffect(() => {
    if (!user?.institution_id || !sessionToken) return;
    InstitutionService.getOne(user.institution_id, sessionToken)
      .then(setInstitution)
      .catch(() => {});
  }, [user?.institution_id, sessionToken]);

  function validateEmailDomain(email: string): string {
    if (!institution) return "";
    const domain = getEmailDomain(email);
    if (!domain) return "";
    const allowed = [institution.student_domain, institution.teacher_domain];
    if (!allowed.includes(domain)) {
      return `El dominio @${domain} no está asociado a ${institution.name}. Dominios válidos: @${institution.student_domain}, @${institution.teacher_domain}`;
    }
    return "";
  }

  function handleEmailChange(email: string) {
    setForm((p) => ({ ...p, email }));
    setEmailError(validateEmailDomain(email));
  }

  async function handleSave() {
    if (!user) return;

    const finalEmailError = validateEmailDomain(form.email);
    if (finalEmailError) {
      setEmailError(finalEmailError);
      return;
    }

    const payload: { name?: string; lastName?: string; email?: string } = {};
    if (form.name.trim() !== user.name) payload.name = form.name.trim();
    if (form.lastName.trim() !== user.lastName)
      payload.lastName = form.lastName.trim();
    if (form.email.trim() !== user.email) payload.email = form.email.trim();

    if (Object.keys(payload).length === 0) return;

    setSaveStatus("loading");
    setErrorMessage("");

    try {
      await UserService.updateOne(userId, payload, sessionToken);
      await refresh();
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err: unknown) {
      setSaveStatus("error");
      const msg = err instanceof Error ? err.message : "";
      if (msg.toLowerCase().includes("email")) {
        setErrorMessage("El email ya está en uso por otro usuario.");
      } else {
        setErrorMessage("Error al guardar los cambios. Inténtalo de nuevo.");
      }
    }
  }

  // ── Change password ──────────────────────────────────────────────
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<SaveStatus>("idle");
  const [passwordError, setPasswordError] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  function validatePasswords(np: string, cp: string): string {
    if (!np) return "La nueva contraseña no puede estar vacía.";
    if (np.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (np !== cp) return "Las contraseñas no coinciden.";
    return "";
  }

  async function handleChangePassword() {
    const err = validatePasswords(newPassword, confirmPassword);
    if (err) {
      setPasswordError(err);
      return;
    }
    setPasswordError("");
    setPasswordStatus("loading");
    setPasswordErrorMessage("");

    try {
      const { token } = await AccessService.forgotPassword(user!.email);
      await AccessService.changePassword(token, newPassword);
      setPasswordStatus("success");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setPasswordStatus("idle");
        setShowPasswordForm(false);
      }, 2500);
    } catch (err: unknown) {
      setPasswordStatus("error");
      const msg = err instanceof Error ? err.message : "";
      setPasswordErrorMessage(
        msg || "Error al cambiar la contraseña. Inténtalo de nuevo.",
      );
    }
  }

  function handleTogglePasswordForm() {
    setShowPasswordForm((v) => !v);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordStatus("idle");
    setPasswordErrorMessage("");
  }

  // ── Delete account ────────────────────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");

  async function handleDeleteAccount() {
    setDeleteStatus("loading");
    setDeleteErrorMessage("");

    try {
      await UserService.deleteOne(userId, sessionToken);
      auth!.setAuth(null);
    } catch (err: unknown) {
      setDeleteStatus("error");
      const msg = err instanceof Error ? err.message : "";
      setDeleteErrorMessage(
        msg || "Error al eliminar la cuenta. Inténtalo de nuevo.",
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────
  const hasChanges =
    !!user &&
    (form.name.trim() !== user.name ||
      form.lastName.trim() !== user.lastName ||
      form.email.trim() !== user.email);

  const canSave = hasChanges && saveStatus !== "loading" && !emailError;

  if (userLoading) {
    return (
      <Page>
        <Section className="py-12 px-4" containerClassName="gap-6">
          <div className="h-10 w-64 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        </Section>
      </Page>
    );
  }

  return (
    <Page>
      <Section className="py-12 px-4" containerClassName="gap-6">
        <Column className="gap-1">
          <h1 className="text-2xl font-bold">Configuración de cuenta</h1>
          <p className="text-sm text-secondary">
            Actualiza tu información personal
          </p>
        </Column>

        {institution && (
          <Card className="flex flex-row gap-4 items-center py-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <IconBuilding size={20} className="text-primary" />
            </div>
            <Column className="gap-0.5">
              <span className="text-sm font-semibold">{institution.name}</span>
              <span className="text-xs text-secondary">
                Dominios válidos: @{institution.student_domain} · @
                {institution.teacher_domain}
              </span>
            </Column>
          </Card>
        )}

        <Card className="gap-6">
          <h2 className="text-lg font-semibold">Información personal</h2>

          <Row className="gap-4">
            <InputField
              id="name"
              type="text"
              placeholder="Nombre"
              icon={<IconUser size={16} className="text-secondary" />}
              value={form.name}
              onChange={(v) => setForm((p) => ({ ...p, name: v }))}
              className="flex-1"
            >
              Nombre
            </InputField>

            <InputField
              id="lastName"
              type="text"
              placeholder="Apellido"
              icon={<IconUser size={16} className="text-secondary" />}
              value={form.lastName}
              onChange={(v) => setForm((p) => ({ ...p, lastName: v }))}
              className="flex-1"
            >
              Apellido
            </InputField>
          </Row>

          <Column className="gap-1.5">
            <InputField
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              icon={<IconMail size={16} className="text-secondary" />}
              value={form.email}
              onChange={handleEmailChange}
            >
              Correo electrónico
            </InputField>
            {emailError && (
              <Row className="gap-1.5 items-start">
                <IconAlertTriangle
                  size={14}
                  className="text-amber-500 shrink-0 mt-0.5"
                />
                <span className="text-xs text-amber-600">{emailError}</span>
              </Row>
            )}
            {institution && !emailError && (
              <span className="text-xs text-secondary">
                El email debe usar un dominio de{" "}
                <span className="font-medium">{institution.name}</span>
              </span>
            )}
          </Column>

          {saveStatus === "error" && (
            <Row className="gap-2 items-center bg-red-50 text-red-700 rounded-xl px-4 py-3">
              <IconAlertTriangle size={16} className="shrink-0" />
              <span className="text-sm">{errorMessage}</span>
            </Row>
          )}

          <Row className="justify-end items-center gap-4 pt-2 border-t border-gray-100">
            {saveStatus === "success" && (
              <Row className="gap-1.5 items-center text-sm text-green-600">
                <IconCheck size={16} />
                <span>Cambios guardados</span>
              </Row>
            )}
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors cursor-pointer"
            >
              {saveStatus === "loading" ? (
                <>
                  <IconLoader2 size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <IconDeviceFloppy size={16} />
                  Guardar cambios
                </>
              )}
            </button>
          </Row>
        </Card>

        <Card className="py-4 flex flex-row gap-3 items-start bg-primary/5 shadow-none">
          <IconAlertTriangle
            size={16}
            className="text-primary shrink-0 mt-0.5"
          />
          <p className="text-sm text-secondary">
            Modificar tu nombre, apellido o correo electrónico{" "}
            <span className="font-medium text-foreground">
              no te elimina de ninguna clase ni reto
            </span>{" "}
            en el que estés inscrito.
          </p>
        </Card>

        {/* Danger zone */}
        <Card className="gap-0 border border-red-200 shadow-none">
          <Row className="gap-2 items-center pb-4 mb-2 border-b border-red-100">
            <IconAlertCircle size={18} className="text-red-500 shrink-0" />
            <h2 className="text-lg font-semibold text-red-600">
              Zona de peligro
            </h2>
          </Row>

          {/* Change password */}
          <div className="py-4 border-b border-gray-100">
            <Row className="justify-between items-center gap-4">
              <Column className="gap-0.5">
                <span className="text-sm font-semibold">
                  Cambiar contraseña
                </span>
                <span className="text-xs text-secondary">
                  Elige una nueva contraseña para tu cuenta
                </span>
              </Column>
              <button
                onClick={handleTogglePasswordForm}
                className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
              >
                <IconLock size={14} />
                {showPasswordForm ? (
                  <>
                    Cancelar <IconChevronUp size={14} />
                  </>
                ) : (
                  <>
                    Cambiar <IconChevronDown size={14} />
                  </>
                )}
              </button>
            </Row>

            {showPasswordForm && (
              <Column className="gap-4 mt-5 pt-4 border-t border-gray-100">
                <Row className="gap-4">
                  <InputField
                    id="newPassword"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    icon={<IconLock size={16} className="text-secondary" />}
                    value={newPassword}
                    onChange={(v) => {
                      setNewPassword(v);
                      setPasswordError("");
                    }}
                    className="flex-1"
                  >
                    Nueva contraseña
                  </InputField>
                  <InputField
                    id="confirmPassword"
                    type="password"
                    placeholder="Repite la contraseña"
                    icon={<IconLock size={16} className="text-secondary" />}
                    value={confirmPassword}
                    onChange={(v) => {
                      setConfirmPassword(v);
                      setPasswordError("");
                    }}
                    className="flex-1"
                  >
                    Confirmar contraseña
                  </InputField>
                </Row>

                {passwordError && (
                  <Row className="gap-1.5 items-start">
                    <IconAlertTriangle
                      size={14}
                      className="text-amber-500 shrink-0 mt-0.5"
                    />
                    <span className="text-xs text-amber-600">
                      {passwordError}
                    </span>
                  </Row>
                )}

                {passwordStatus === "error" && (
                  <Row className="gap-2 items-center bg-red-50 text-red-700 rounded-xl px-4 py-3">
                    <IconAlertTriangle size={16} className="shrink-0" />
                    <span className="text-sm">{passwordErrorMessage}</span>
                  </Row>
                )}

                <Row className="justify-end items-center gap-3">
                  {passwordStatus === "success" && (
                    <Row className="gap-1.5 items-center text-sm text-green-600">
                      <IconCheck size={16} />
                      <span>Contraseña actualizada</span>
                    </Row>
                  )}
                  <button
                    onClick={handleChangePassword}
                    disabled={passwordStatus === "loading"}
                    className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    {passwordStatus === "loading" ? (
                      <>
                        <IconLoader2 size={16} className="animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <IconDeviceFloppy size={16} />
                        Guardar contraseña
                      </>
                    )}
                  </button>
                </Row>
              </Column>
            )}
          </div>

          {/* Delete account */}
          <div className="pt-4">
            <Row className="justify-between items-center gap-4">
              <Column className="gap-0.5">
                <span className="text-sm font-semibold text-red-600">
                  Eliminar cuenta
                </span>
                <span className="text-xs text-secondary">
                  Elimina permanentemente tu cuenta y todos tus datos
                </span>
              </Column>
              {!deleteConfirm && (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-600 px-4 py-2 rounded-xl border border-red-200 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                >
                  <IconTrash size={14} />
                  Eliminar cuenta
                </button>
              )}
            </Row>

            {deleteConfirm && (
              <Column className="gap-3 mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
                <Row className="gap-2 items-start">
                  <IconAlertCircle
                    size={16}
                    className="text-red-600 shrink-0 mt-0.5"
                  />
                  <p className="text-sm text-red-700">
                    <span className="font-semibold">
                      Esta acción es irreversible.
                    </span>{" "}
                    Se eliminarán todos tus datos, matrículas e historial de
                    puntos.
                  </p>
                </Row>

                {deleteStatus === "error" && (
                  <Row className="gap-2 items-center bg-red-100 text-red-800 rounded-xl px-4 py-3">
                    <IconAlertTriangle size={16} className="shrink-0" />
                    <span className="text-sm">{deleteErrorMessage}</span>
                  </Row>
                )}

                <Row className="gap-3 justify-end">
                  <button
                    onClick={() => {
                      setDeleteConfirm(false);
                      setDeleteStatus("idle");
                      setDeleteErrorMessage("");
                    }}
                    disabled={deleteStatus === "loading"}
                    className="text-sm font-medium px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-40"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteStatus === "loading"}
                    className="flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    {deleteStatus === "loading" ? (
                      <>
                        <IconLoader2 size={16} className="animate-spin" />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <IconTrash size={16} />
                        Sí, eliminar mi cuenta
                      </>
                    )}
                  </button>
                </Row>
              </Column>
            )}
          </div>
        </Card>
      </Section>
    </Page>
  );
}
