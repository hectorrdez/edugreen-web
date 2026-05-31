import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { NotificationProvider } from "./components/notifications/NotificationProvider.tsx";
import { AccessProvider } from "./contexts/AccessContext.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AccessProvider>
        <UserProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </UserProvider>
      </AccessProvider>
    </BrowserRouter>
  </StrictMode>,
);
