import { useState } from "react";
import { useKanban } from "../context/KanbanContext";
import AddTaskForm from "./AddTaskForm";
import TaskCard from "./TaskCard";

export default function Column({ columnId }) {
  const { state, moveTask } = useKanban();
  const column = state.columns[columnId];
  const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

  // Highlight column when a dragged card is hovering over it
  const [isDragOver, setIsDragOver] = useState(false);

  // --- Drop Handlers ---

  const handleDragOver = (e) => {
    // Must prevent default to allow drop - browser blocks it otherwise
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    // NOTE: dragLeave fires when hovering over a child element too.
    // For now this is acceptable -- a full fix needs pointer coordinates.
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    // Read the taskId and source column set during dragStart  on TaskCard
    const taskId = e.dataTransfer.getData("taskId");
    const fromColumn = e.dataTransfer.getData("fromColumn");

    // Guard -- if dataTransfer is empty, ignore the drop
    if (!taskId || !fromColumn) return;

    moveTask(taskId, fromColumn, columnId);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        flex: "1",
        minWidth: "260px",
        padding: "16px",
        background: isDragOver ? "#f0f0f0" : "#e2e4e6",
        borderRadius: "8px",
        transition: "background 0.2s",
        border: isDragOver ? "2px dashed #4A90E2" : "2px solid transparent",
      }}
    >
      {/* Column header with task count */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "600" }}>
          {column.title}
        </h3>
        <span
          style={{
            background: "#ddd",
            borderRadius: "12px",
            padding: "2px 8px",
            fontSize: "12px",
            fontWeight: "500",
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Task cards */}
      <div>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} columnId={columnId} />
        ))}

        {/* Empty state  */}
        {tasks.length === 0 && (
          <p
            style={{
              color: "#aaa",
              marginTop: "2rem",
              fontSize: "13px",
              textAlign: "center",
            }}
          >
            No tasks yet
          </p>
        )}

        {/* Add task form sits at the bottom of each column */}
        <AddTaskForm columnId={columnId} />
      </div>
    </div>
  );
}
