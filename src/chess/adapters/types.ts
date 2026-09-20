export type ChessSite = "chess.com" | "lichess";

export type PieceColor = "white" | "black";

export type PieceType =
  | "king"
  | "queen"
  | "rook"
  | "bishop"
  | "knight"
  | "pawn";

export interface BoardSquare {
  file: number;
  rank: number;
}

export interface DetectedPiece {
  type: PieceType;
  color: PieceColor;
  square: string;
}

export interface DetectedBoard {
  site: ChessSite;
  element: HTMLElement;
  orientation: PieceColor;
  pieces: DetectedPiece[];
  detectedAt: number;
}

export interface BoardAdapter {
  readonly site: ChessSite;

  findBoard(): HTMLElement | null;

  detectOrientation(board: HTMLElement): PieceColor;

  extractPieces(board: HTMLElement): DetectedPiece[];

  isValidBoard(board: HTMLElement): boolean;
}