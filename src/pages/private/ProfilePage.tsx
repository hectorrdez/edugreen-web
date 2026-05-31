import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IconLeafFilled,
  IconMail,
  IconSchool,
  IconShieldHalf,
  IconTrophy,
  IconCheckbox,
  IconLoader2,
} from "@tabler/icons-react";
import Page from "@components/layouts/Page";
import Section from "@components/placing/Section";
import Card from "@components/cards/Card";
import Row from "@components/placing/Row";
import Column from "@components/placing/Column";
import useUser from "@contexts/UserContext";
import useAuth from "@contexts/AccessContext";
import UserService, { type UserData, type UserChallengeData } from "@services/UserService";
import StatsService, { type UserStatsData } from "@services/StatsService";
import ClassService, { type ClassData } from "@services/ClassService";
import UserClassService from "@services/UserClassService";

const ROLE_LABEL: Record<string, string> = {
  student: "Estudiante",
  teacher: "Profesor",
  admin: "Administrador",
};

function getInitials(name: string, lastName: string) {
  return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProfilePage() {
  const { id: paramId } = useParams<{ id: string }>();
  const { user: ownUser, isLoading: ownUserLoading } = useUser()!;
  const auth = useAuth();
  const sessionToken = auth?.auth?.sessionToken ?? "";
  const ownId = auth?.auth?.id ?? "";

  const profileId = paramId ?? ownId;
  const isOwnProfile = !paramId || paramId === ownId;

  const [profileUser, setProfileUser] = useState<UserData | null>(null);
  const [profileUserLoading, setProfileUserLoading] = useState(!isOwnProfile);

  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [challenges, setChallenges] = useState<UserChallengeData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [classes, setClasses] = useState<(ClassData & { memberRole: "tutor" | "alumno" })[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);

  // Fetch target user data (only needed when viewing someone else's profile)
  useEffect(() => {
    if (isOwnProfile || !profileId || !sessionToken) {
      setProfileUserLoading(false);
      return;
    }
    setProfileUserLoading(true);
    UserService.getOne(profileId, sessionToken)
      .then(setProfileUser)
      .catch(() => setProfileUser(null))
      .finally(() => setProfileUserLoading(false));
  }, [profileId, sessionToken, isOwnProfile]);

  // Fetch stats + challenges
  useEffect(() => {
    if (!profileId || !sessionToken) return;
    setDataLoading(true);
    Promise.allSettled([
      StatsService.getByUser(profileId, sessionToken),
      UserService.getChallenges(profileId, sessionToken),
    ]).then(([statsResult, challengesResult]) => {
      if (statsResult.status === "fulfilled") setStats(statsResult.value);
      if (challengesResult.status === "fulfilled")
        setChallenges(challengesResult.value.data);
      setDataLoading(false);
    });
  }, [profileId, sessionToken]);

  // Fetch classes
  useEffect(() => {
    const targetRole = isOwnProfile ? ownUser?.role : profileUser?.role;
    if (!profileId || !sessionToken || (!isOwnProfile && !profileUser)) return;

    setClassesLoading(true);

    const load = async () => {
      const merged: (ClassData & { memberRole: "tutor" | "alumno" })[] = [];

      const memberRes = await UserClassService.getClassesByUser(profileId, sessionToken).catch(() => null);
      if (memberRes) {
        memberRes.data.forEach((c) => merged.push({ ...c, memberRole: "alumno" }));
      }

      if (targetRole === "teacher" || targetRole === "admin") {
        const tutorRes = await ClassService.getByTutor(profileId, sessionToken).catch(() => null);
        (tutorRes ?? []).forEach((c) => {
          if (!merged.find((m) => m.id === c.id))
            merged.push({ ...c, memberRole: "tutor" });
        });
      }

      setClasses(merged);
    };

    load().finally(() => setClassesLoading(false));
  }, [profileId, sessionToken, isOwnProfile ? ownUser?.role : profileUser?.role]);

  const displayUser = isOwnProfile ? ownUser : profileUser;
  const isLoading = isOwnProfile
    ? ownUserLoading || dataLoading
    : profileUserLoading || dataLoading;

  return (
    <Page>
      <Section className="py-12 px-4" containerClassName="gap-8">
        <ProfileHeader user={displayUser} isLoading={isLoading} />
        <Row className="gap-6 items-start">
          <Column className="flex-1 gap-6">
            <StatsCard stats={stats} isLoading={isLoading} />
            <ClassesCard classes={classes} isLoading={classesLoading} isOwnProfile={isOwnProfile} />
            <ChallengesCard challenges={challenges} isLoading={isLoading} isOwnProfile={isOwnProfile} />
          </Column>
        </Row>
      </Section>
    </Page>
  );
}

type ProfileHeaderProps = {
  user: UserData | null | undefined;
  isLoading: boolean;
};

function ProfileHeader({ user, isLoading }: ProfileHeaderProps) {
  if (isLoading || !user) {
    return (
      <Card className="flex flex-row gap-6 items-center animate-pulse">
        <div className="w-20 h-20 rounded-2xl bg-primary/20 shrink-0" />
        <Column className="gap-2">
          <div className="h-6 w-48 bg-gray-200 rounded-lg" />
          <div className="h-4 w-32 bg-gray-100 rounded-lg" />
        </Column>
      </Card>
    );
  }

  return (
    <Card className="flex flex-row gap-6 items-center">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-2xl font-bold text-primary">
          {getInitials(user.name, user.lastName)}
        </span>
      </div>
      <Column className="gap-1 flex-1">
        <h1 className="text-2xl font-bold">
          {user.name} {user.lastName}
        </h1>
        <Row className="gap-4 flex-wrap">
          <Row className="gap-1.5 items-center text-sm text-secondary">
            <IconMail size={14} />
            <span>{user.email}</span>
          </Row>
          <Row className="gap-1.5 items-center text-sm text-secondary">
            <IconShieldHalf size={14} />
            <span>{ROLE_LABEL[user.role] ?? user.role}</span>
          </Row>
        </Row>
        <span className="text-xs text-secondary mt-1">
          Miembro desde {formatDate(user.created_at)}
        </span>
      </Column>
      <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full self-start">
        {ROLE_LABEL[user.role] ?? user.role}
      </span>
    </Card>
  );
}

type StatsCardProps = {
  stats: UserStatsData | null;
  isLoading: boolean;
};

function StatsCard({ stats, isLoading }: StatsCardProps) {
  return (
    <Card className="gap-4">
      <h2 className="text-lg font-semibold">Estadísticas</h2>
      {isLoading ? (
        <Row className="gap-6">
          <div className="h-16 flex-1 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-16 flex-1 bg-gray-100 rounded-xl animate-pulse" />
        </Row>
      ) : (
        <Row className="gap-4">
          <StatItem
            icon={<IconTrophy size={20} className="text-primary" />}
            label="Puntos totales"
            value={stats?.total_points ?? 0}
          />
          <StatItem
            icon={<IconLeafFilled size={20} className="text-primary" />}
            label="Retos en historial"
            value={stats?.history.length ?? 0}
          />
        </Row>
      )}
    </Card>
  );
}

type StatItemProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
};

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <Column className="flex-1 bg-primary/5 rounded-xl p-4 gap-1">
      <Row className="gap-2 items-center">
        {icon}
        <span className="text-xs text-secondary font-medium">{label}</span>
      </Row>
      <span className="text-3xl font-bold tabular-nums">{value}</span>
    </Column>
  );
}

type ClassesCardProps = {
  classes: (ClassData & { memberRole: "tutor" | "alumno" })[];
  isLoading: boolean;
  isOwnProfile: boolean;
};

function ClassesCard({ classes, isLoading, isOwnProfile }: ClassesCardProps) {
  return (
    <Card className="gap-4">
      <Row className="justify-between items-center">
        <h2 className="text-lg font-semibold">{isOwnProfile ? "Mis clases" : "Clases"}</h2>
        {!isLoading && (
          <span className="text-sm text-secondary">{classes.length} clase{classes.length !== 1 ? "s" : ""}</span>
        )}
      </Row>

      {isLoading ? (
        <Column className="gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </Column>
      ) : classes.length === 0 ? (
        <Column className="items-center gap-2 py-8 text-secondary">
          <IconSchool size={32} className="opacity-30" />
          <span className="text-sm">
            {isOwnProfile ? "Aún no perteneces a ninguna clase" : "Sin clases asignadas"}
          </span>
        </Column>
      ) : (
        <Column className="gap-3">
          {classes.map((c) => (
            <Row key={c.id} className="gap-4 items-center p-4 rounded-xl bg-primary/5">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                <IconSchool size={16} className="text-primary" />
              </div>
              <Column className="flex-1 gap-0.5 min-w-0">
                <span className="text-sm font-semibold truncate">{c.name}</span>
                {c.description && (
                  <span className="text-xs text-secondary line-clamp-1">{c.description}</span>
                )}
              </Column>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                  c.memberRole === "tutor"
                    ? "bg-green-100 text-green-700"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {c.memberRole === "tutor" ? "Tutor" : "Alumno"}
              </span>
            </Row>
          ))}
        </Column>
      )}
    </Card>
  );
}

type ChallengesCardProps = {
  challenges: UserChallengeData[];
  isLoading: boolean;
  isOwnProfile: boolean;
};

function ChallengesCard({ challenges, isLoading, isOwnProfile }: ChallengesCardProps) {
  const completed = challenges.filter((c) => c.status === "completed");
  const inProgress = challenges.filter((c) => c.status === "in_progress");

  return (
    <Card className="gap-4">
      <Row className="justify-between items-center">
        <h2 className="text-lg font-semibold">{isOwnProfile ? "Mis retos" : "Retos"}</h2>
        <span className="text-sm text-secondary">
          {completed.length} completados · {inProgress.length} en progreso
        </span>
      </Row>

      {isLoading ? (
        <Column className="gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </Column>
      ) : challenges.length === 0 ? (
        <Column className="items-center gap-2 py-8 text-secondary">
          <IconLeafFilled size={32} className="opacity-30" />
          <span className="text-sm">
            {isOwnProfile ? "Aún no te has inscrito en ningún reto" : "Sin retos completados"}
          </span>
        </Column>
      ) : (
        <Column className="gap-3">
          {inProgress.map((c) => (
            <ChallengeRow key={c.challenge_id} challenge={c} />
          ))}
          {completed.map((c) => (
            <ChallengeRow key={c.challenge_id} challenge={c} />
          ))}
        </Column>
      )}
    </Card>
  );
}

type ChallengeRowProps = {
  challenge: UserChallengeData;
};

function ChallengeRow({ challenge }: ChallengeRowProps) {
  const isCompleted = challenge.status === "completed";

  return (
    <Row className="gap-4 items-center p-4 rounded-xl bg-primary/5">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          isCompleted ? "bg-primary/20 text-primary" : "bg-gray-200 text-gray-400"
        }`}
      >
        {isCompleted ? (
          <IconCheckbox size={16} />
        ) : (
          <IconLoader2 size={16} className="animate-spin" />
        )}
      </div>
      <Column className="flex-1 gap-0.5">
        <span className="text-sm font-semibold">{challenge.challenge_name}</span>
        <span className="text-xs text-secondary line-clamp-1">
          {challenge.description}
        </span>
      </Column>
      <Column className="items-end gap-0.5 shrink-0">
        <span className="text-sm font-bold text-primary">
          {challenge.points} pts
        </span>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            isCompleted
              ? "bg-primary/10 text-primary"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {isCompleted ? "Completado" : "En progreso"}
        </span>
      </Column>
    </Row>
  );
}
