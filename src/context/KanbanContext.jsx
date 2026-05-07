import { createContext, useContext, useReducer } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const KanbanContext = createContext();

// Normalized state shape -- tasks and columns are stored separately
// so we never duplicate task data across columns.
// columns hold taskIds (references), tasks hold the actual data.
// This mirrors how you'd structure a real database or Redux store.
const INITIAL_STATE = {
  columns: {
    todo: { id: "todo", title: "To Do", taskIds: [] },
    inprogress: { id: "inprogress", title: "In Progress", taskIds: [] },
    done: { id: "done", title: "Done", taskIds: [] },
  },
  tasks: {},
};

// Pure reducer -- no side effects, no API calls, no localStorage here
// Each case returns a new state object without mutating the original.

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TASK": {
      const { columnId, task } = action.payload;

      return {
        ...state,
        // Add new task to the tasks map by id
        tasks: {
          ...state.tasks,
          [task.id]: task,
        },
        columns: {
          ...state.columns,
          [columnId]: {
            ...state.columns[columnId],
            // Append to end of column -- newest task appears at bottom
            taskIds: [...state.columns[columnId].taskIds, task.id],
          },
        },
      };
    }

    case "DELETE_TASK": {
      const { columnId, taskId } = action.payload;

      // Destructure to remove the task by id without mutating state.
      // The _ variable is intentionally unused -- we just want remainingTask.
      const { ...remainingTasks } = state.tasks;

      return {
        ...state,
        tasks: remainingTasks,
        columns: {
          ...state.columns,
          [columnId]: {
            ...state.columns[columnId],

            taskIds: state.columns[columnId].taskIds.filter(
              (id) => id !== taskId,
            ),
          },
        },
      };
    }

    case "MOVE_TASK": {
      const { taskId, fromColumn, toColumn } = action.payload;

      // Early return if dropped in the same column -- no state change needed
      // Prevents unnecessary re-renders.

      if (fromColumn === toColumn) return state;

      return {
        ...state,
        columns: {
          ...state.columns,
          // Remove taskId from source column
          [fromColumn]: {
            ...state.columns[fromColumn],
            taskIds: state.columns[fromColumn].taskIds.filter(
              (id) => id !== taskId,
            ),
          },
          // Append taskId to destination column
          [toColumn]: {
            ...state.columns[toColumn],
            taskIds: [...state.columns[toColumn].taskIds, taskId],
          },
        },
      };
    }

    case "EDIT_TASK": {
      const { taskId, text } = action.payload;

      // Only update the text field -- preserves createdAt and other metadata.

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...state.tasks[taskId],
            text,
          },
        },
      };
    }

    default:
      return state;
  }
};

export function KanbanProvider({ children }) {
  const [saved, setSaved] = useLocalStorage("kanban", INITIAL_STATE);

  // Initialize from localStorage so state persists across page refreshes.
  // Fails back to INITIAL_STATE if nothing is saved yet.

  const [state, dispatch] = useReducer(reducer, saved);

  // Wraps dispatch to keep localStorage in sync after every action.
  // We call the reducer manually to get the next state before dispatching,
  // because dispatch is async and state won't be updated yet when setSaved

  const wrappedDispatch = (action) => {
    const next = reducer(state, action);
    dispatch(action);
    setSaved(next);
  };
  // Action creators - components call these instead of dispatching directly
  // Keeps action shape logic out of the UI layer

  const addTask = (columnId, text) => {
    wrappedDispatch({
      type: "ADD_TASK",
      payload: {
        columnId,
        task: {
          id: crypto.randomUUID(), // Browser-native UUID -- no library needed
          text,
          createdAt: new Date().toISOString(),
        },
      },
    });
  };

  const deleteTask = (taskId, columnId) => {
    // columnId is required so the reducer knows which column's taskId to update
    wrappedDispatch({ type: "DELETE_TASK", payload: { taskId, columnId } });
  };

  const moveTask = (taskId, fromColumn, toColumn) => {
    wrappedDispatch({
      type: "MOVE_TASK",
      payload: { taskId, fromColumn, toColumn },
    });
  };

  const editTask = (taskId, text) => {
    wrappedDispatch({ type: "EDIT_TASK", payload: { taskId, text } });
  };

  return (
    <KanbanContext.Provider
      value={{ state, addTask, deleteTask, moveTask, editTask }}
    >
      {children}
    </KanbanContext.Provider>
  );
}

// Custom hook -- enforces that this context is only used inside KanbanProvider
// Throws a clear error instead of silently returning undefined.
// eslint-disable-next-line react-refresh/only-export-components
export function useKanban() {
  const context = useContext(KanbanContext);
  if (!context) throw new Error("useKanban must be used inside KanbanProvider");
  return context;
}
