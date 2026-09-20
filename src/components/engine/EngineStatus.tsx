import type { EngineState } from "../../types/chess";

interface EngineStatusProps {
  engine: EngineState;
}

const STATUS_LABELS: Record<EngineState["status"], string> = {
  idle: "Idle",
  ready: "Ready",
  analyzing: "Analyzing",
  completed: "Completed",
  error: "Error",
};

export function EngineStatus({ engine }: EngineStatusProps) {
  const statusLabel = STATUS_LABELS[engine.status];

  return (
    <div className="engine-status-card">
      <div className="status-row">
        <div className="status-label-group">
          <span
            className={`status-indicator status-${engine.status}`}
            aria-hidden="true"
          />

          <span className="status-label">Engine</span>
        </div>

        <span className="status-value">{statusLabel}</span>
      </div>

      <p className="engine-message">{engine.message}</p>

      <div className="engine-metrics">
        <div>
          <span className="metric-label">Depth</span>
          <strong>{engine.depth}</strong>
        </div>

        <div>
          <span className="metric-label">Nodes</span>
          <strong>{engine.nodes.toLocaleString()}</strong>
        </div>

        <div>
          <span className="metric-label">Evaluation</span>
          <strong>
            {engine.evaluation === null
              ? "—"
              : `${engine.evaluation >= 0 ? "+" : ""}${engine.evaluation.toFixed(2)}`}
          </strong>
        </div>
      </div>
    </div>
  );
}