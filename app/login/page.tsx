"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function submit() {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) router.push("/dashboard");
    else alert("Login failed");
  }

  return (
    <main className="max-w-sm mx-auto p-6 space-y-3">
      <h1 className="text-xl font-semibold">Login</h1>

      <input
        className="border w-full p-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="border w-full p-2"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={submit} className="bg-blue-600 text-white px-4 py-2">
        Login
      </button>
    </main>
  );
}
