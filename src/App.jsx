import { Route, Routes } from "react-router-dom";
import Home from "./pages/public/Home";
import Login from "./pages/public/access/Login";
import Register from "./pages/public/access/Register";
import Challenges from "./pages/private/Challenges";
import Rankings from "./pages/private/Rankings";
import Profile from "./pages/private/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/challenges" element={<Challenges />} />
      <Route path="/rankings" element={<Rankings />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
