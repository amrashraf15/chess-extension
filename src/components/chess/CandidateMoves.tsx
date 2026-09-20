import type { CandidateMove } from "../../types/chess";

interface CandidateMovesProps {
  moves: CandidateMove[];
}

function formatEvaluation(evaluation: number): string {
  return `${evaluation >= 0 ? "+" : ""}${evaluation.toFixed(2)}`;
}

export function CandidateMoves({ moves }: CandidateMovesProps) {
  if (moves.length === 0) {
    return (
      <div className="empty-state">
        No candidate moves available.
      </div>
    );
  }

  return (
    <div className="candidate-moves">
      <div className="candidate-table-header">
        <span>Move</span>
        <span>Eval</span>
        <span>Chance</span>
      </div>

      {moves.map((candidate, index) => (
        <div className="candidate-row" key={candidate.id}>
          <div className="candidate-move-cell">
            <span className="candidate-rank">{index + 1}</span>

            <div>
              <strong>{candidate.move}</strong>

              <span className="candidate-pv">
                {candidate.principalVariation.join(" ")}
              </span>
            </div>
          </div>

          <span className="candidate-evaluation">
            {formatEvaluation(candidate.evaluation)}
          </span>

          <span className="candidate-probability">
            {(candidate.probability * 100).toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  );
}