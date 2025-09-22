"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post("/api/auth/signup", { name, email, password });
      setMessage("Signup successful!");
      setName("");
      setEmail("");
      setPassword("");
      // Redirect to Kanban board after signup
      router.push("/kanbanBoard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.error || "Signup failed");
      } else if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Signup failed");
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-64 mx-auto mt-20">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="p-2 border rounded"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-2 border rounded"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Signup
        </button>
      </form>

      {message && <p className="text-sm text-red-500">{message}</p>}

      <p className="text-sm mt-2">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500 underline">
          Login
        </Link>
      </p>
    </div>
  );
}
