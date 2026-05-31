import type { ReactElement } from "react";
import ChallengesPage from "./private/ChallengesPage";
import MediaPage from "./private/MediaPage";
import RankingPage from "./private/RankingPage";
import AboutPage from "./public/AboutPage";
import HowItWorksPage from "./public/HowItWorksPage";
import LandingPage from "./public/LandingPage";
import LoginPage from "./public/access/LoginPage";
import RegisterPage from "./public/access/RegisterPage";
import NotFoundPage from "./public/auxiliar/NotFoundPage";
import CookiesPage from "./public/policies/CookiesPage";
import PrivacyPage from "./public/policies/PrivacyPage";
import UseTermsPage from "./public/policies/UseTermsPage";
import ProfilePage from "./private/ProfilePage";
import AdminPanelPage from "./private/AdminPanelPage";
import TeacherPanelPage from "./private/TeacherPanelPage";
import ConfigurationPage from "./private/ConfigurationPage";
import ChallengeDetailPage from "./private/ChallengeDetailPage";
import ForgotPasswordPage from "./private/ForgotPasswordPage";

export type RouteConfig = {
  name: string;
  path: string;
  component: ReactElement;
  protected?: boolean;
  guestOnly?: boolean;
  roles?: string[];
};

const siteMap: RouteConfig[] = [
  { path: "/", name: "landing", component: <LandingPage /> },
  {
    path: "/about",
    name: "about",
    component: <AboutPage />,
  },
  {
    name: "how-it-works",
    path: "/how-it-works",
    component: <HowItWorksPage />,
  },
  {
    path: "/ranking",
    name: "ranking",
    component: <RankingPage />,
    protected: true,
  },
  {
    path: "/media",
    name: "media",
    component: <MediaPage />,
    protected: true,
  },
  {
    path: "/challenges",
    name: "challenges",
    component: <ChallengesPage />,
    protected: true,
  },
  {
    path: "/challenge/:id",
    name: "challenge-detail",
    component: <ChallengeDetailPage />,
    protected: true,
  },
  {
    path: "/profile",
    name: "my-profile",
    component: <ProfilePage />,
    protected: true,
  },
  {
    path: "/profile/:id",
    name: "user-profile",
    component: <ProfilePage />,
    protected: true,
  },
  {
    path: "/settings",
    name: "settings",
    component: <ConfigurationPage />,
    protected: true,
  },
  {
    path: "/admin",
    name: "admin",
    component: <AdminPanelPage />,
    protected: true,
    roles: ["admin"],
  },
  {
    path: "/panel",
    name: "teacher-panel",
    component: <TeacherPanelPage />,
    protected: true,
    roles: ["teacher", "admin"],
  },
  {
    path: "/access/register",
    name: "register",
    component: <RegisterPage />,
    guestOnly: true,
  },
  {
    path: "/access/login",
    name: "login",
    component: <LoginPage />,
    guestOnly: true,
  },
  {
    path: "/access/forgot-password",
    name: "forgot-password",
    component: <ForgotPasswordPage />,
    guestOnly: true,
  },
  { path: "/policies/privacy", name: "privacy", component: <PrivacyPage /> },
  {
    path: "/policies/use-terms",
    name: "use-terms",
    component: <UseTermsPage />,
  },
  { path: "/policies/cookies", name: "cookies", component: <CookiesPage /> },
  { path: "*", name: "", component: <NotFoundPage /> },
];

export default siteMap;
