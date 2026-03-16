"use client";
import { useState } from "react";
export default function LoginForm({
  onLogin,
}: {
  onLogin: (username: string, password: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div
      style={{ maxWidth: "300px", margin: "50px auto", textAlign: "center" }}
    >
      {" "}
      <h2>Login Form</h2>{" "}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />{" "}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />{" "}
      <button
        onClick={() => onLogin(username, password)}
        style={{ padding: "8px 16px", cursor: "pointer" }}
      >
        {" "}
        Login{" "}
      </button>{" "}
    </div>
  );
}
