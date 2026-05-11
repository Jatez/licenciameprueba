import { useState } from "react";

const PASSWORD = "licenciame$";
const SESSION_KEY = "licenciame_gate_ok";

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1"
  );
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
    } else {
      setError(true);
      setInput("");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#141414",
          border: "1px solid #262626",
          borderRadius: 16,
          padding: "40px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          minWidth: 320,
          boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 4 }}>
          <img
            src="/favicon.ico"
            alt="Licenciame"
            style={{ width: 40, height: 40, marginBottom: 12 }}
          />
          <div style={{ color: "#fff", fontSize: 18, fontWeight: 600 }}>
            Acceso privado
          </div>
          <div style={{ color: "#666", fontSize: 13, marginTop: 4 }}>
            Este demo es de acceso restringido
          </div>
        </div>

        <input
          type="password"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(false);
          }}
          placeholder="Contraseña"
          autoFocus
          style={{
            background: "#1c1c1c",
            border: error ? "1px solid #ef4444" : "1px solid #333",
            borderRadius: 8,
            color: "#fff",
            padding: "10px 14px",
            fontSize: 14,
            outline: "none",
          }}
        />

        {error && (
          <div style={{ color: "#ef4444", fontSize: 12, marginTop: -12 }}>
            Contraseña incorrecta
          </div>
        )}

        <button
          type="submit"
          style={{
            background: "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 0",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
