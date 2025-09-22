"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showSignupLink, setShowSignupLink] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setShowSignupLink(false);

    try {
      await axios.post("/api/auth/login", { email, password });
      setMessage("Login successful!");
      setEmail("");
      setPassword("");
      // Redirect to Kanban board
      router.push("/kanbanBoard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.error || "Login failed");
        if (error.response?.data?.suggestSignup) {
          setShowSignupLink(true);
        }
      } else if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Login failed");
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-64 mx-auto mt-20">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>

      {message && <p className="text-sm text-red-500">{message}</p>}

      {showSignupLink && (
        <p className="text-sm mt-2">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-500 underline">
            Sign up
          </Link>
        </p>
      )}
    </div>
  );
}
