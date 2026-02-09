import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getApplications } from "../services/api.js";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const getStatusBadge = (status) => {
  const normalized = (status || "").toLowerCase();
  if (normalized === "offered") {
    return "bg-emerald-500/15 text-emerald-200 border-emerald-500/40";
  }
  if (normalized === "rejected") {
    return "bg-rose-500/15 text-rose-200 border-rose-500/40";
  }
  if (normalized === "interviewing" || normalized === "in progress") {
    return "bg-sky-500/15 text-sky-200 border-sky-500/40";
  }
  return "bg-slate-500/15 text-slate-200 border-slate-500/40";
};

const getStage = (rounds = []) => {
  const activeRound = rounds.find((round) =>
    ["pending", "in progress", "scheduled"].includes((round?.status || "").toLowerCase())
  );
  return activeRound?.name || "Applied";
};

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadApplications = async () => {
      try {
        setLoading(true);
        const response = await getApplications();
        if (isMounted) {
          setApplications(response.data || []);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message || "Failed to load applications.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadApplications();

    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const total = applications.length;
    const offers = applications.filter(
      (app) => (app.status || "").toLowerCase() === "offered"
    ).length;

    const interviews = applications.filter((app) =>
      (app.rounds || []).some((round) => {
        const roundStatus = (round?.status || "").toLowerCase();
        return roundStatus === "pending" || roundStatus === "in progress" || roundStatus === "scheduled";
      })
    ).length;

    return { total, interviews, offers };
  }, [applications]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
              CB
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">CareerBoardAI</p>
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
            >
              Logout
            </button>
            <Link
              to="/add"
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
            >
              + New Application
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-10">
        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-900/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Total Applications</p>
                <p className="mt-4 text-3xl font-semibold text-slate-100">{metrics.total}</p>
                <p className="mt-2 text-sm text-slate-400">+0 this week</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                ?
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-900/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Active Interviews</p>
                <p className="mt-4 text-3xl font-semibold text-slate-100">{metrics.interviews}</p>
                <p className="mt-2 text-sm text-slate-400">0 scheduled</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-300">
                ?
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-900/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Offers Received</p>
                <p className="mt-4 text-3xl font-semibold text-slate-100">{metrics.offers}</p>
                <p className="mt-2 text-sm text-slate-400">0% success rate</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-300">
                ?
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg shadow-slate-900/30">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold">Recent Applications</h2>
              <p className="mt-1 text-sm text-slate-300">Latest updates from your pipeline.</p>
            </div>
            <div className="text-sm text-slate-400">{applications.length} total</div>
          </div>

          {loading ? (
            <div className="px-6 py-8 text-sm text-slate-300">Loading applications...</div>
          ) : error ? (
            <div className="px-6 py-8 text-sm text-rose-100">{error}</div>
          ) : applications.length === 0 ? (
            <div className="px-6 py-8 text-sm text-slate-300">
              No applications yet. Add your first one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-900/80 text-xs uppercase tracking-[0.25em] text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Stage</th>
                    <th className="px-6 py-4">Applied Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {applications.map((app) => (
                    <tr
                      key={app._id || `${app.companyName}-${app.role}`}
                      className="transition hover:bg-slate-900/60"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-100">{app.companyName}</td>
                      <td className="px-6 py-4 text-slate-200">{app.role}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {app.status || "Applied"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{getStage(app.rounds)}</td>
                      <td className="px-6 py-4 text-slate-300">{formatDate(app.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
