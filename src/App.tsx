import { Route, Routes } from "react-router-dom";
import siteMap from "./pages/Routes";
import { buildRoutes } from "./utils/RouteUtils";
import PruebasPage from "./pages/Pruebas";

export default function App() {
  return (
    <Routes>
      {buildRoutes(siteMap)}
      <Route path="/pruebas" element={<PruebasPage />}></Route>
    </Routes>
  );
}
