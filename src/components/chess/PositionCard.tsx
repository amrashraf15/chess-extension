import type { PositionState } from "../../types/chess";

interface PositionCardProps {
  position: PositionState;
}

export function PositionCard({ position }: PositionCardProps) {
  return (
    <div className="position-card">
      <div className="position-header">
        <span className="position-label">CURRENT POSITION</span>

        <span className="position-badge">
          {position.isLoaded ? "Loaded" : "Not loaded"}
        </span>
      </div>

      <div className="position-info">
        <div>
          <span className="metric-label">Side to move</span>
          <strong className="capitalize">
            {position.sideToMove}
          </strong>
        </div>

        <div>
          <span className="metric-label">Move</span>
          <strong>{position.moveNumber}</strong>
        </div>
      </div>

      <div className="fen-container">
        <span className="metric-label">FEN</span>

        <code className="fen-value">{position.fen}</code>
      </div>
    </div>
  );
}