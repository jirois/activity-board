import { useKanban } from "../context/KanbanContext";
import Column from "./Column";

export default function Board() {
  const { state } = useKanban();

  // Derive column order from state -- keeps render order
  // consistent with how columns are defined in INITIAL_STATE

  const columnIds = Object.keys(state.columns);

  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "flex-start",
        padding: "2rem",
        overflowX: "auto", // Allow horizontally on small screens
        minHeight: "100vh",
      }}
    >
      {columnIds.map((columnId) => (
        <Column key={columnId} columnId={columnId} />
      ))}
    </div>
  );
}
