import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import api from "../services/api";
import { login } from "../store/authSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password
      });

      dispatch(
        login({
          token: response.data.token,
          user: response.data.user
        })
      );

      navigate("/dashboard");

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Login failed."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white">
            JobFlow
          </h1>

          <p className="text-gray-400 mt-2">
            Welcome back
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="bg-[#111827] border border-[#1f2937] rounded-2xl p-8"
        >

          <h2 className="text-2xl font-semibold text-white mb-6">
            Sign in
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <div className="mb-5">

            <label className="block text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-[#090d16] border border-[#1f2937] rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
            />

          </div>

          <div className="mb-6">

            <label className="block text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#090d16] border border-[#1f2937] rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;