import React, { useState } from "react";

type Props = {
  onLogin?: () => void;
};

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  // Demo credentials
  const demoUser = "admin";
  const demoPass = "password123";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (username === demoUser && password === demoPass) {
      setMessage("Login successful. Redirecting...");
      localStorage.setItem("demo_logged_in", "true");
      setTimeout(() => {
        onLogin?.();
      }, 300);
    } else {
      setMessage("Invalid username or password.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 px-4">
      <div className="bg-black/60 backdrop-blur-sm rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <div className="text-sm text-gray-200 mb-1">Username</div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
              placeholder="Username"
              autoComplete="username"
            />
          </label>

          <label className="block">
            <div className="text-sm text-gray-200 mb-1">Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
              placeholder="Password"
              autoComplete="current-password"
            />
          </label>

          <button type="submit" className="w-full py-2 bg-green-600 rounded text-white font-medium">
            Sign In
          </button>
        </form>

        {message && <div className="mt-4 text-sm text-yellow-300">{message}</div>}
      </div>
    </div>
  );
}
