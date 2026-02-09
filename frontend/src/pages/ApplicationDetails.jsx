import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, {
  addRound,
  clearAuth,
  deleteAttachment,
  deleteRound,
  updateApplication,
  updateRoundStatus,
  uploadAttachment,
} from "../services/api.js";

const ROUND_STATUS_OPTIONS = ["Pending", "Passed", "Failed"];
const DEFAULT_ROUND_ORDER = ["Screening", "OA", "Technical", "HR", "Offer"];

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
  if (normalized === "interviewing" || normalized === "in process") {
    return "bg-sky-500/15 text-sky-200 border-sky-500/40";
  }
  return "bg-slate-500/15 text-slate-200 border-slate-500/40";
};

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roundUpdating, setRoundUpdating] = useState({});
  const [roundDeleting, setRoundDeleting] = useState({});
  const [roundAdding, setRoundAdding] = useState(false);
  const [roundInput, setRoundInput] = useState("");
  const [uploading, setUploading] = useState({ resume: false, jd: false });
  const [uploadError, setUploadError] = useState("");
  const [activeUploadType, setActiveUploadType] = useState(null);
  const [showRounds, setShowRounds] = useState(true);
  const [notesValue, setNotesValue] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadApplication = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/applications/${id}`);
        if (isMounted) {
          setApplication(response.data);
          setNotesValue(response.data?.notes || "");
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message || "Failed to load application.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadApplication();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const orderedRounds = useMemo(() => {
    const rounds = application?.rounds || [];
    const byName = new Map(rounds.map((round) => [round.name, round]));
    const ordered = DEFAULT_ROUND_ORDER
      .filter((name) => byName.has(name))
      .map((name) => byName.get(name));

    const custom = rounds.filter((round) => !DEFAULT_ROUND_ORDER.includes(round.name));
    return [...ordered, ...custom];
  }, [application]);

  const attachments = application?.attachments || [];
  const resumeAttachment = attachments.find((item) => item.type === "resume");
  const jdAttachment = attachments.find((item) => item.type === "jd");

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const handleRoundStatusChange = async (roundId, nextStatus) => {
    if (!application) return;
    const key = `${application._id}:${roundId}`;
    setRoundUpdating((prev) => ({ ...prev, [key]: true }));

    try {
      const response = await updateRoundStatus(application._id, roundId, nextStatus);
      setApplication(response.data);
    } catch (err) {
      console.error("Failed to update round status", err);
    } finally {
      setRoundUpdating((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleAddRound = async () => {
    if (!application) return;
    const name = roundInput.trim();
    if (!name) return;

    setRoundAdding(true);
    try {
      const response = await addRound(application._id, name);
      setApplication(response.data);
      setRoundInput("");
    } catch (err) {
      console.error("Failed to add round", err);
    } finally {
      setRoundAdding(false);
    }
  };

  const handleDeleteRound = async (roundId) => {
    if (!application) return;
    const key = `${application._id}:${roundId}`;
    setRoundDeleting((prev) => ({ ...prev, [key]: true }));

    try {
      const response = await deleteRound(application._id, roundId);
      setApplication(response.data);
    } catch (err) {
      console.error("Failed to delete round", err);
    } finally {
      setRoundDeleting((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleUpload = async (type, file) => {
    if (!application || !file) return;
    setUploadError("");
    setUploading((prev) => ({ ...prev, [type]: true }));

    try {
      const response = await uploadAttachment(application._id, type, file);
      setApplication(response.data);
    } catch (err) {
      console.error("Failed to upload attachment", err);
      setUploadError(err?.response?.data?.message || "Failed to upload file.");
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleDeleteAttachment = async (attachment) => {
    if (!application || !attachment) return;
    const confirmed = window.confirm("Remove this attachment?");
    if (!confirmed) return;

    try {
      const response = await deleteAttachment(application._id, attachment._id);
      setApplication(response.data);
    } catch (err) {
      console.error("Failed to delete attachment", err);
    }
  };

  const handleSaveNotes = async () => {
    if (!application) return;
    setNotesSaving(true);

    try {
      const response = await updateApplication(application._id, { notes: notesValue });
      setApplication(response.data);
    } catch (err) {
      console.error("Failed to save notes", err);
    } finally {
      setNotesSaving(false);
    }
  };

  const closeModal = () => {
    setActiveUploadType(null);
    setUploadError("");
  };

  const renderAttachmentCard = (label, attachment, type) => (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-slate-200">{label}</p>
        {attachment ? (
          <p className="text-xs text-slate-400">{attachment.filename}</p>
        ) : (
          <p className="text-xs text-slate-500">No file uploaded</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {attachment ? (
          <>
            <button
              type="button"
              onClick={() => window.open(attachment.url, "_blank")}
              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Open
            </button>
            <button
              type="button"
              onClick={() => setActiveUploadType(type)}
              className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-slate-500"
              title="Replace"
            >
              ?
            </button>
            <button
              type="button"
              onClick={() => handleDeleteAttachment(attachment)}
              className="rounded-lg border border-slate-700 px-2 py-1 text-xs text-rose-300 hover:border-rose-400"
              title="Remove"
            >
              ?
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setActiveUploadType(type)}
            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Upload
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
              CB
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">CareerBoardAI</p>
              <h1 className="text-xl font-semibold">Application Details</h1>
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
              to="/"
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-6">
        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
            Loading application...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-5 text-sm text-rose-100">
            {error}
          </div>
        ) : !application ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
            Application not found.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Summary</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-100">
                      {application.companyName}
                    </h2>
                    <p className="mt-1 text-sm text-slate-300">{application.role}</p>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadge(
                        application.status
                      )}`}
                    >
                      {application.status || "Applied"}
                    </span>
                    <span className="text-xs text-slate-400">
                      Applied {formatDate(application.createdAt)}
                    </span>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">Interview Progress</h3>
                    <p className="mt-1 text-sm text-slate-300">Track round-by-round updates.</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 lg:hidden"
                    onClick={() => setShowRounds((prev) => !prev)}
                  >
                    {showRounds ? "Hide" : "Show"}
                  </button>
                </div>

                <div
                  className={`mt-4 space-y-4 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/40 p-3 ${
                    showRounds ? "max-h-72" : "max-h-0 p-0 border-transparent"
                  }`}
                >
                  {orderedRounds.length === 0 ? (
                    <p className="text-sm text-slate-400">No rounds yet. Add your first round below.</p>
                  ) : (
                    orderedRounds.map((round, index) => {
                      const key = `${application._id}:${round._id}`;
                      const isUpdating = Boolean(roundUpdating[key]);
                      const isDeleting = Boolean(roundDeleting[key]);

                      return (
                        <div key={round._id} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-300">
                              {index + 1}
                            </div>
                            {index < orderedRounds.length - 1 && (
                              <div className="h-full w-px flex-1 bg-slate-800" />
                            )}
                          </div>
                          <div className="flex-1 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-200">{round.name}</p>
                                <p className="text-xs text-slate-400">Round status</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <select
                                  value={round.status || "Pending"}
                                  disabled={isUpdating || isDeleting}
                                  onChange={(event) =>
                                    handleRoundStatusChange(round._id, event.target.value)
                                  }
                                  className="rounded-lg border border-slate-700 bg-transparent px-3 py-1 text-xs text-slate-200"
                                >
                                  {ROUND_STATUS_OPTIONS.map((option) => (
                                    <option key={option} value={option} className="text-slate-900">
                                      {option}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  disabled={isDeleting}
                                  onClick={() => handleDeleteRound(round._id)}
                                  className="text-xs text-rose-300 hover:text-rose-200"
                                >
                                  {isDeleting ? "Removing..." : "Remove"}
                                </button>
                                {isUpdating && (
                                  <span className="text-xs text-slate-400">Saving...</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    value={roundInput}
                    onChange={(event) => setRoundInput(event.target.value)}
                    className="w-full max-w-xs rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200"
                    placeholder="Add round (e.g. System Design)"
                  />
                  <button
                    type="button"
                    disabled={roundAdding}
                    onClick={handleAddRound}
                    className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {roundAdding ? "Adding..." : "Add Round"}
                  </button>
                </div>
              </section>
            </div>

            <div className="space-y-4">
              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Attachments</h3>
                    <p className="mt-1 text-sm text-slate-300">Resume & JD files.</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  {renderAttachmentCard("Resume", resumeAttachment, "resume")}
                  {renderAttachmentCard("Job Description", jdAttachment, "jd")}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Notes</h3>
                  {notesSaving && <span className="text-xs text-slate-400">Saving...</span>}
                </div>
                <textarea
                  value={notesValue}
                  onChange={(event) => setNotesValue(event.target.value)}
                  rows={4}
                  className="mt-3 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200"
                  placeholder="Add notes about this application"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={notesSaving}
                  className="mt-3 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {notesSaving ? "Saving..." : "Save Notes"}
                </button>
              </section>
            </div>
          </div>
        )}
      </main>

      {activeUploadType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">
                  {activeUploadType === "resume" ? "Resume" : "Job Description"}
                </h3>
                <p className="text-sm text-slate-400">Upload and manage files.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-sm text-slate-400 hover:text-slate-200"
              >
                Close
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                disabled={uploading[activeUploadType]}
                onChange={(event) =>
                  handleUpload(activeUploadType, event.target.files?.[0] || null)
                }
                className="w-full text-xs text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-500/20 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-emerald-200"
              />
              {uploading[activeUploadType] && (
                <p className="mt-2 text-xs text-slate-400">Uploading...</p>
              )}
              {uploadError && (
                <div className="mt-3 rounded-lg border border-rose-500/40 bg-rose-500/10 p-2 text-xs text-rose-100">
                  {uploadError}
                </div>
              )}
            </div>

            <div className="mt-4 max-h-48 overflow-y-auto">
              {attachments.filter((item) => item.type === activeUploadType).length === 0 ? (
                <p className="text-sm text-slate-400">No files uploaded yet.</p>
              ) : (
                <ul className="space-y-2 text-sm text-slate-200">
                  {attachments
                    .filter((item) => item.type === activeUploadType)
                    .map((item) => (
                      <li
                        key={`${item.type}-${item.filename}`}
                        className="flex flex-wrap items-center gap-2"
                      >
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-300 hover:text-emerald-200"
                        >
                          {item.filename}
                        </a>
                        <span className="text-xs text-slate-400">{formatDate(item.uploadedAt)}</span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicationDetails;
