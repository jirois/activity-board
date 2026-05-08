import Board from "./components/Board";

export default function App() {
  return (
    <div>
      <header
        style={{
          padding: "1rem 2rem",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "20px" }}>Kanban Board</h1>
      </header>
      <Board />
    </div>
  );
}
