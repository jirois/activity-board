# 📋 Activity Board

> A drag-and-drop task management board with inline editing and persistent storage

---

## What It Does

- Add tasks to any column — To Do, In Progress, Done
- Drag and drop tasks between columns with visual drop feedback
- Double click any task to edit it inline
- Task count badge per column updates in real time
- Data persists across sessions via `localStorage` — no backend needed

---

## Tech Stack

| Layer       | Tool                           |
| ----------- | ------------------------------ |
| UI          | React (Vite)                   |
| State       | `useReducer` + Context API     |
| Drag & Drop | Native HTML5 Drag and Drop API |
| Persistence | `localStorage` via custom hook |

---

## Project Structure

```
kanban-board/
├── src/
│   ├── components/
│   │   ├── Board.jsx           # Renders all columns side by side
│   │   ├── Column.jsx          # Drop target, drag highlight, task list
│   │   ├── TaskCard.jsx        # Draggable card, inline edit, delete
│   │   └── AddTaskForm.jsx     # Collapsed/expanded form per column
│   ├── context/
│   │   └── KanbanContext.jsx   # Global state, reducer, action creators
│   ├── hooks/
│   │   └── useLocalStorage.js  # Syncs state to localStorage
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── index.html
```

---

## Getting Started

```bash
git clone https://github.com/yourusername/kanban-board.git
cd kanban-board
npm install
npm run dev
```

---

## How Drag and Drop Works

No library used — built entirely with the native HTML5 Drag and Drop API.

1. `TaskCard` sets `draggable` and stores `taskId` + `fromColumn` in `dataTransfer` on `dragstart`
2. `Column` listens for `dragover` (must call `preventDefault` to allow drop) and highlights on hover
3. On `drop`, `Column` reads from `dataTransfer` and dispatches `MOVE_TASK` to context
4. Reducer removes `taskId` from source column and appends it to destination column

---

## State Shape

Tasks and columns are stored separately — tasks by id, columns holding arrays of taskIds.
This mirrors a normalized database structure and avoids duplicating data.

```js
{
  columns: {
    todo:       { id, title, taskIds: [] },
    inprogress: { id, title, taskIds: [] },
    done:       { id, title, taskIds: [] }
  },
  tasks: {
    'uuid-1': { id, text, createdAt },
    'uuid-2': { id, text, createdAt }
  }
}
```

---

## Key Concepts Practiced

- Normalized state shape — tasks and columns decoupled
- Complex `useReducer` with `ADD_TASK`, `DELETE_TASK`, `MOVE_TASK`, `EDIT_TASK`
- Native HTML5 drag-and-drop with `dataTransfer` API
- `useRef` for auto-focusing inline edit input
- Immutable nested state updates
- Team-style code comments — why, not what

---

## Roadmap

- [ ] Drag to reorder tasks within a column
- [ ] Task priority labels (High / Medium / Low)
- [ ] Due dates with overdue highlighting
- [ ] Board reset button

---
