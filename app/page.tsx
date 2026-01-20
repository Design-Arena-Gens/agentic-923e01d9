"use client";

import { FormEvent, useMemo, useState } from "react";

type StepStatus = "Draft" | "Active" | "Completed";

type WorkflowStep = {
  id: string;
  title: string;
  owner: string;
  purpose: string;
  deliverable: string;
  durationDays: number;
  dependencies: string;
  notes: string;
  status: StepStatus;
};

const defaultSteps: WorkflowStep[] = [
  {
    id: crypto.randomUUID(),
    title: "Kickoff & Alignment",
    owner: "Program Manager",
    purpose: "Confirm objectives, constraints, and success metrics with stakeholders.",
    deliverable: "Project charter & communication plan",
    durationDays: 3,
    dependencies: "Executive sponsor availability",
    notes: "Schedule a 60-minute workshop and capture open questions in the tracker.",
    status: "Completed"
  },
  {
    id: crypto.randomUUID(),
    title: "Discovery & Mapping",
    owner: "Research Lead",
    purpose: "Understand current state and identify friction points in the existing process.",
    deliverable: "Current-state journey map with pain points tagged",
    durationDays: 5,
    dependencies: "Access to analytics, customer interviews",
    notes: "Prioritize top 3 pain points to address in design sprint.",
    status: "Active"
  },
  {
    id: crypto.randomUUID(),
    title: "Solution Blueprint",
    owner: "Design Strategist",
    purpose: "Co-create future-state workflow with SMEs and validate feasibility.",
    deliverable: "Future-state swimlane diagram + RACI matrix",
    durationDays: 4,
    dependencies: "Discovery outputs, SME availability",
    notes: "Capture assumptions in an appendix for later validation.",
    status: "Draft"
  }
];

const statusOrder: StepStatus[] = ["Draft", "Active", "Completed"];

const emptyDraft: Omit<WorkflowStep, "id"> = {
  title: "",
  owner: "",
  purpose: "",
  deliverable: "",
  durationDays: 3,
  dependencies: "",
  notes: "",
  status: "Draft"
};

function createStepId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function Page() {
  const [steps, setSteps] = useState<WorkflowStep[]>(defaultSteps);
  const [draft, setDraft] = useState<Omit<WorkflowStep, "id">>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [view, setView] = useState<"board" | "timeline">("board");

  const stats = useMemo(() => {
    if (!steps.length) {
      return { totalDuration: 0, ownerCount: 0, activeSteps: 0, longestStep: null as WorkflowStep | null };
    }

    const totalDuration = steps.reduce((acc, step) => acc + step.durationDays, 0);
    const ownerCount = new Set(steps.map((step) => step.owner)).size;
    const activeSteps = steps.filter((step) => step.status === "Active").length;
    const longestStep = steps.reduce((longest, step) =>
      !longest || step.durationDays > longest.durationDays ? step : longest
    );

    return { totalDuration, ownerCount, activeSteps, longestStep };
  }, [steps]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleaned = {
      ...draft,
      title: draft.title.trim(),
      owner: draft.owner.trim(),
      purpose: draft.purpose.trim(),
      deliverable: draft.deliverable.trim(),
      dependencies: draft.dependencies.trim(),
      notes: draft.notes.trim()
    };

    if (!cleaned.title) {
      return;
    }

    if (editingId) {
      setSteps((prev) =>
        prev.map((step) => (step.id === editingId ? { ...step, ...cleaned } : step))
      );
      setEditingId(null);
    } else {
      setSteps((prev) => [...prev, { id: createStepId(), ...cleaned }]);
    }

    setDraft(emptyDraft);
  };

  const startEditing = (id: string) => {
    const target = steps.find((step) => step.id === id);
    if (!target) return;

    const { id: _id, ...rest } = target;
    setDraft(rest);
    setEditingId(id);
  };

  const removeStep = (id: string) => {
    setSteps((prev) => prev.filter((step) => step.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setDraft(emptyDraft);
    }
  };

  const shiftStatus = (id: string) => {
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id !== id) return step;
        const idx = statusOrder.indexOf(step.status);
        const next = statusOrder[(idx + 1) % statusOrder.length];
        return { ...step, status: next };
      })
    );
  };

  const moveStep = (id: string, direction: "up" | "down") => {
    setSteps((prev) => {
      const index = prev.findIndex((step) => step.id === id);
      if (index < 0) return prev;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const clone = [...prev];
      const [item] = clone.splice(index, 1);
      clone.splice(targetIndex, 0, item);
      return clone;
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraft(emptyDraft);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="badge">Workflow Studio</span>
        <h1 className="headline">Build a workflow that keeps every milestone on track</h1>
        <p className="subhead">
          Capture each stage, align owners, and communicate the hand-offs all in one place. Iterate
          quickly, export the plan, or share it with your team in seconds.
        </p>
      </header>

      <section className="workflow-grid">
        <article className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, fontSize: "1.35rem" }}>
              {editingId ? "Update workflow step" : "Add workflow step"}
            </h2>
            {editingId && (
              <button className="button secondary" type="button" onClick={cancelEditing}>
                Cancel
              </button>
            )}
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="title">Stage name</label>
              <input
                id="title"
                className="input"
                placeholder="e.g. Define requirements"
                value={draft.title}
                onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="owner">Primary owner</label>
              <input
                id="owner"
                className="input"
                placeholder="Team or person responsible"
                value={draft.owner}
                onChange={(event) => setDraft((prev) => ({ ...prev, owner: event.target.value }))}
              />
            </div>

            <div className="field">
              <label htmlFor="purpose">Purpose</label>
              <textarea
                id="purpose"
                className="textarea"
                placeholder="What outcome are we driving?"
                value={draft.purpose}
                onChange={(event) => setDraft((prev) => ({ ...prev, purpose: event.target.value }))}
              />
            </div>

            <div className="field">
              <label htmlFor="deliverable">Key deliverable</label>
              <input
                id="deliverable"
                className="input"
                placeholder="What proves we are done?"
                value={draft.deliverable}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, deliverable: event.target.value }))
                }
              />
            </div>

            <div className="field">
              <label htmlFor="duration">Expected duration (days)</label>
              <input
                id="duration"
                type="number"
                min={1}
                max={60}
                className="input"
                value={draft.durationDays}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    durationDays: Math.max(1, Number(event.target.value) || 1)
                  }))
                }
              />
            </div>

            <div className="field">
              <label htmlFor="dependencies">Dependencies</label>
              <input
                id="dependencies"
                className="input"
                placeholder="e.g. research insights, signed contract"
                value={draft.dependencies}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, dependencies: event.target.value }))
                }
              />
            </div>

            <div className="field">
              <label htmlFor="notes">Notes & hand-off details</label>
              <textarea
                id="notes"
                className="textarea"
                placeholder="Call out risks, communication plans, and hand-offs."
                value={draft.notes}
                onChange={(event) => setDraft((prev) => ({ ...prev, notes: event.target.value }))}
              />
            </div>

            <div className="field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                className="select"
                value={draft.status}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, status: event.target.value as StepStatus }))
                }
              >
                {statusOrder.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="button">
              {editingId ? "Save step" : "Add step"}
            </button>
          </form>
        </article>

        <article className="card" style={{ gap: "1rem" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, fontSize: "1.35rem" }}>Workflow blueprint</h2>
            <div className="switcher">
              <button
                type="button"
                className={view === "board" ? "active" : ""}
                onClick={() => setView("board")}
              >
                Board
              </button>
              <button
                type="button"
                className={view === "timeline" ? "active" : ""}
                onClick={() => setView("timeline")}
              >
                Timeline
              </button>
            </div>
          </header>

          {view === "board" ? (
            steps.length ? (
              <div className="steps">
                {steps.map((step, index) => (
                  <div key={step.id} className="step-card">
                    <div className="step-card__header">
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                        <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                          Step {String(index + 1).padStart(2, "0")}
                        </span>
                        <strong style={{ fontSize: "1.1rem" }}>{step.title}</strong>
                      </div>
                      <span className="chip">{step.status}</span>
                    </div>

                    <div className="step-card__meta">
                      {step.owner && <span>👤 {step.owner}</span>}
                      <span>⏱️ {step.durationDays} {step.durationDays === 1 ? "day" : "days"}</span>
                      {step.dependencies && <span>🧩 {step.dependencies}</span>}
                    </div>

                    {step.purpose && (
                      <div>
                        <span className="summary-title">Purpose</span>
                        <p style={{ margin: 0, color: "#cbd5f5", lineHeight: 1.4 }}>{step.purpose}</p>
                      </div>
                    )}

                    {step.deliverable && (
                      <div>
                        <span className="summary-title">Deliverable</span>
                        <p style={{ margin: 0, color: "#cbd5f5", lineHeight: 1.4 }}>
                          {step.deliverable}
                        </p>
                      </div>
                    )}

                    {step.notes && (
                      <div>
                        <span className="summary-title">Notes</span>
                        <p style={{ margin: 0, color: "#cbd5f5", lineHeight: 1.4 }}>{step.notes}</p>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="button secondary"
                        onClick={() => startEditing(step.id)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="button secondary"
                        onClick={() => shiftStatus(step.id)}
                      >
                        Advance status
                      </button>
                      <button
                        type="button"
                        className="button secondary"
                        onClick={() => moveStep(step.id, "up")}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="button secondary"
                        onClick={() => moveStep(step.id, "down")}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="button secondary"
                        onClick={() => removeStep(step.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                Add your first step to start shaping the workflow. Begin with the trigger, outline
                responsibilities, and note the signals that unlock the next stage.
              </div>
            )
          ) : (
            <div className="timeline">
              {steps.map((step, index) => (
                <div key={step.id} className="timeline-item">
                  <div className="timeline-item__title">
                    {index + 1}. {step.title}
                  </div>
                  <div className="timeline-item__meta">
                    {step.owner || "Unassigned"} · {step.durationDays}{" "}
                    {step.durationDays === 1 ? "day" : "days"} · {step.status}
                  </div>
                  <div className="timeline-item__desc">
                    {step.purpose || "Clarify the objective for this step."}
                  </div>
                  {step.dependencies && (
                    <div style={{ marginTop: "0.5rem", color: "#cbd5f5", fontSize: "0.85rem" }}>
                      Dependencies: {step.dependencies}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="card summary">
          <h2 style={{ margin: 0, fontSize: "1.35rem" }}>Operational summary</h2>

          <div className="summary-item">
            <span className="summary-title">Total duration</span>
            <span className="summary-content">
              {stats.totalDuration
                ? `${stats.totalDuration} ${stats.totalDuration === 1 ? "day" : "days"}`
                : "Pending steps"}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-title">Active steps</span>
            <span className="summary-content">{stats.activeSteps}</span>
          </div>

          <div className="summary-item">
            <span className="summary-title">Contributors</span>
            <span className="summary-content">
              {stats.ownerCount
                ? `${stats.ownerCount} distinct owner${stats.ownerCount === 1 ? "" : "s"}`
                : "Assign owners to increase accountability."}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-title">Longest stage</span>
            <span className="summary-content">
              {stats.longestStep
                ? `${stats.longestStep.title} · ${stats.longestStep.durationDays} ${
                    stats.longestStep.durationDays === 1 ? "day" : "days"
                  }`
                : "Add a step to see pacing insights."}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-title">Share & export</span>
            <span className="summary-content">
              Capture decisions and circulate the plan. Duplicate steps for parallel tracks or drop
              them into your doc, Confluence page, or deck.
            </span>
          </div>
        </article>
      </section>
    </div>
  );
}
