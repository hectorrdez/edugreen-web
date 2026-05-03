import { Routes } from "react-router-dom";
import siteMap from "./pages/Routes";
import { buildRoutes } from "./utils/RouteUtils";

export default function App() {
  return <Routes>{buildRoutes(siteMap)}</Routes>;
}
