import { useState } from "react";
import { useKanban } from "../context/KanbanContext";

export default function AddTaskForm({ columnId }) {
  const { addTask } = useKanban();

  // Controls whether the form is visible or collapse to a button
  // Default is collapsed -- keeps the UI clean.
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const trimmed = text.trim();

    // Bail early if empty -- don't add blank tasks
    if (!trimmed) return;

    addTask(columnId, trimmed);
    setText("");
    setIsOpen(false); // Collapse form after adding
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();

    // Escape closes the form without adding
    if (e.key === "Escape") {
      setText("");
      setIsOpen(false);
    }
  };

  // Collasped state -- just a button
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          width: "100%",
          marginTop: "8px",
          padding: "8px",
          background: "none",
          border: "1px dashed #ccc",
          borderRadius: "6px",
          cursor: "pointer",
          color: "#888",
          fontSize: "13px",
          textAlign: "left",
        }}
      >
        + Add a Task
      </button>
    );
  }

  // Expanded state -- textarea + actions

  return (
    <div style={{ marginTop: "8px" }}>
      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter task description... "
        rows={3}
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #4A90E2",
          borderRadius: "6px",
          outline: "none",
          resize: "none",
          boxSizing: "border-box",
        }}
      />
      <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
        <button
          onClick={handleSubmit}
          style={{
            padding: "6px 12px",
            backgroundColor: "#4A90E2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Add
        </button>

        {/* Cancel -- resets and collapses without saving */}
        <button
          onClick={() => {
            setText("");
            setIsOpen(false);
          }}
          style={{
            padding: "6px 12px",
            backgroundColor: "#eee",
            color: "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
