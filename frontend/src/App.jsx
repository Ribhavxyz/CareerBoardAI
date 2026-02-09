const stats = [
  { label: "Applications", value: "0" },
  { label: "Interviews", value: "0" },
  { label: "Offers", value: "0" },
];

const tasks = [
  "Add your first application",
  "Track interview rounds",
  "Attach resumes and notes",
];

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <div className="text-lg font-semibold tracking-wide">CareerBoardAI</div>
          <button className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 hover:border-slate-500">
            New Application
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <section className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Phase 1</p>
            <h1 className="mt-3 text-3xl font-semibold">Placement tracker, simplified.</h1>
            <p className="mt-4 text-slate-300">
              Organize applications, interviews, and outcomes in one place. Build clarity while you apply.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                MongoDB
              </span>
              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                Express
              </span>
              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                React
              </span>
              <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                Tailwind
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
            <h2 className="text-lg font-semibold">Next up</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {tasks.map((task) => (
                <li key={task} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {task}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-100">{item.value}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
