import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuthToken, registerUser, setAuth } from "../services/api.js";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Name, email, and password are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      setAuth({ token: response.data.token, user: response.data.user });
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-md flex-col px-6 py-16">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-900/30">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">CareerBoardAI</p>
            <h1 className="mt-2 text-2xl font-semibold">Create your account</h1>
            <p className="mt-2 text-sm text-slate-300">Start tracking your applications in minutes.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-slate-300">Name</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 outline-none focus:border-emerald-400"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 outline-none focus:border-emerald-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 outline-none focus:border-emerald-400"
                placeholder="Create a password"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-300 hover:text-emerald-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
