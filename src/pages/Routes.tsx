import type { ReactElement } from "react";
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

export type RouteConfig = {
  name: string;
  path: string;
  component: ReactElement;
  protected?: boolean;
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
  { path: "/access/register", name: "register", component: <RegisterPage /> },
  { path: "/access/login", name: "login", component: <LoginPage /> },
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
