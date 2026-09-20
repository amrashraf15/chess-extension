import type { DetectedBoard } from "./adapters/types";

export interface BoardPosition {
  site: DetectedBoard["site"];
  orientation: DetectedBoard["orientation"];
  pieces: DetectedBoard["pieces"];
  pieceCount: number;
  detectedAt: number;
}

export function normalizePosition(
  board: DetectedBoard,
): BoardPosition {
  const uniqueSquares = new Map<
    string,
    DetectedBoard["pieces"][number]
  >();

  for (const piece of board.pieces) {
    uniqueSquares.set(piece.square, piece);
  }

  const pieces = Array.from(uniqueSquares.values()).sort((a, b) =>
    a.square.localeCompare(b.square),
  );

  return {
    site: board.site,
    orientation: board.orientation,
    pieces,
    pieceCount: pieces.length,
    detectedAt: board.detectedAt,
  };
}