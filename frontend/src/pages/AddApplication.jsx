import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createApplication } from "../services/api.js";

function AddApplication() {
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!companyName.trim() || !role.trim()) {
      setError("Company name and role are required.");
      return;
    }

    try {
      setLoading(true);
      await createApplication({ companyName: companyName.trim(), role: role.trim() });
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">CareerBoardAI</p>
            <h1 className="mt-2 text-2xl font-semibold">Add Application</h1>
          </div>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
            Phase 1
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-6 py-10">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
        >
          <div className="space-y-5">
            <div>
              <label className="text-sm text-slate-300">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 outline-none focus:border-emerald-400"
                placeholder="e.g. OpenAI"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Role</label>
              <input
                type="text"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-slate-100 outline-none focus:border-emerald-400"
                placeholder="e.g. Software Engineer"
              />
            </div>
          </div>

          {error && (
            <div className="mt-5 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Create Application"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default AddApplication;
