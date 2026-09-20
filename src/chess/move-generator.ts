
import { Chess } from "chess.js";

export interface GeneratedMove {
  san: string;
  uci: string;
  from: string;
  to: string;
  promotion?: string;
}

export interface LegalMoveResult {
  valid: boolean;
  errors: string[];
  moves: GeneratedMove[];
}

export interface PositionStatus {
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  isGameOver: boolean;
}

function convertMove(
  move: {
    san: string;
    from: string;
    to: string;
    promotion?: string;
  },
): GeneratedMove {
  return {
    san: move.san,
    from: move.from,
    to: move.to,
    promotion: move.promotion,
    uci: `${move.from}${move.to}${
      move.promotion ?? ""
    }`,
  };
}

export function createChessGame(
  fen?: string,
): Chess {
  if (!fen) {
    return new Chess();
  }

  return new Chess(fen);
}

export function generateLegalMoves(
  fen: string,
): LegalMoveResult {
  try {
    const chess = new Chess(fen);

    const moves = chess
      .moves({
        verbose: true,
      })
      .map(convertMove);

    return {
      valid: true,
      errors: [],
      moves,
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        error instanceof Error
          ? error.message
          : "Unable to generate legal moves.",
      ],
      moves: [],
    };
  }
}

export function validateLegalPosition(
  fen: string,
): {
  valid: boolean;
  errors: string[];
} {
  try {
    new Chess(fen);

    return {
      valid: true,
      errors: [],
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        error instanceof Error
          ? error.message
          : "Invalid chess position.",
      ],
    };
  }
}

export function getPositionStatus(
  fen: string,
): PositionStatus {
  const chess = new Chess(fen);

  return {
    isCheck: chess.isCheck(),
    isCheckmate: chess.isCheckmate(),
    isStalemate: chess.isStalemate(),
    isDraw: chess.isDraw(),
    isGameOver: chess.isGameOver(),
  };
}

export function isMoveLegal(
  fen: string,
  move: string,
): boolean {
  try {
    const chess = new Chess(fen);

    chess.move(move);

    return true;
  } catch {
    return false;
  }
}

export function applyMove(
  fen: string,
  move: string,
): string {
  const chess = new Chess(fen);

  chess.move(move);

  return chess.fen();
}