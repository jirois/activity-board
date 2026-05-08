import { useState, useRef } from "react";
import { useKanban } from "../context/KanbanContext";

export default function TaskCard({ task, columnId }) {
  const { deleteTask, editTask } = useKanban();

  // Track whether the card is in inline-edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  // Used to visually dim the card while it's being dragged
  const [isDragging, setIsDragging] = useState(false);

  // Ref to auto-focus the input when edit mode opens
  const inputRef = useRef(null);

  // --- Drag Handlers ---

  const handleDragStart = (e) => {
    // Store taskId and source columnId in dataTransfer so the
    // drop target (Column) knows what was dragged and from where
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("fromColumn", columnId);
    e.dataTransfer.effectAllowed = "move";

    setIsDragging(true);
  };

  const handleDragEnd = () => {
    // Always reset drag state -- fires even if drop was cancelled
    setIsDragging(false);
  };

  // --- Edit Handlers ---

  const handleDoubleClick = () => {
    setIsEditing(true);
    // Wait for re-render before focusing -- input isn't in DOM yet
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleEditSave = () => {
    const trimmed = editText.trim();

    // Don't save empty text -- revert to original
    if (trimmed) {
      setEditText(task.text); // Reset input to original text
    } else {
      editTask(task.id, trimmed);
    }

    setIsEditing(false);
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") handleEditSave();

    // Escape cancels edit without saving
    if (e.key === "Escape") {
      setEditText(task.text); // Reset input to original text
      setIsEditing(false);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDoubleClick={handleDoubleClick}
      style={{
        padding: "8px",
        marginBottom: "8px",
        background: "#FFF",
        borderRadius: "6px",
        border: "1px solid #e0e0e0",
        cursor: "grab",
        opacity: isDragging ? 0.4 : 1, // Dim while dragging
        transition: "opacity 0.2s",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {isEditing ? (
        // Inline edit input - replaces text on double click
        <input
          ref={inputRef}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleEditSave}
          onKeyDown={handleEditKeyDown}
          style={{
            flex: 1,
            border: "none",
            outline: "2px solid #4A90E2",
            borderRadius: "4px",
            padding: "2px 6px",
            fontSize: "14px",
          }}
        />
      ) : (
        <p style={{ margin: 0, fontSize: "14px", flex: 1 }}>{task.text}</p>
      )}

      {/* Delete button - only visible when not editting */}
      {!isEditing && (
        <button
          onClick={() => deleteTask(task.id, columnId)}
          arial-label={`Delete task: ${task.text} `}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#aaa",
            fontSize: "16px",
            lineHeight: "1",
            padding: "0 4px",
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
