import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { KanbanProvider } from "./context/KanbanContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <KanbanProvider>
      <App />
    </KanbanProvider>
  </StrictMode>,
);
