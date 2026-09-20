
import type {
  DetectedPiece,
  PieceColor,
  PieceType,
} from "./adapters/types";

export type BoardFile =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h";

export type BoardRank =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8;

export type Square = `${BoardFile}${BoardRank}`;

export type SideToMove = "w" | "b";

export type CastlingRights =
  | "-"
  | "K"
  | "Q"
  | "k"
  | "q"
  | "KQ"
  | "Kk"
  | "Kq"
  | "Qk"
  | "Qq"
  | "kq"
  | "KQk"
  | "KQq"
  | "Kkq"
  | "Qkq"
  | "KQkq";

export interface PositionMetadata {
  sideToMove: SideToMove;
  castlingRights: string;
  enPassantTarget: Square | "-";
  halfmoveClock: number;
  fullmoveNumber: number;
}

export interface BoardPiece {
  type: PieceType;
  color: PieceColor;
  square: Square;
}

export interface ChessBoard {
  pieces: Map<Square, BoardPiece>;
  metadata: PositionMetadata;
}

export interface BoardValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const FILES: readonly BoardFile[] = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
];

const RANKS: readonly BoardRank[] = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
];

const PIECE_TYPES: readonly PieceType[] = [
  "king",
  "queen",
  "rook",
  "bishop",
  "knight",
  "pawn",
];

export const STARTING_POSITION_METADATA: PositionMetadata = {
  sideToMove: "w",
  castlingRights: "KQkq",
  enPassantTarget: "-",
  halfmoveClock: 0,
  fullmoveNumber: 1,
};

export function isValidSquare(
  value: string,
): value is Square {
  if (value.length !== 2) {
    return false;
  }

  const file = value[0];
  const rank = Number(value[1]);

  return (
    FILES.includes(file as BoardFile) &&
    RANKS.includes(rank as BoardRank)
  );
}

export function createEmptyBoard(
  metadata: PositionMetadata = STARTING_POSITION_METADATA,
): ChessBoard {
  return {
    pieces: new Map<Square, BoardPiece>(),
    metadata: {
      ...metadata,
    },
  };
}

export function boardFromDetectedPieces(
  detectedPieces: readonly DetectedPiece[],
  metadata: PositionMetadata,
): ChessBoard {
  const board = createEmptyBoard(metadata);

  for (const detectedPiece of detectedPieces) {
    if (!isValidSquare(detectedPiece.square)) {
      continue;
    }

    const square = detectedPiece.square;

    board.pieces.set(square, {
      type: detectedPiece.type,
      color: detectedPiece.color,
      square,
    });
  }

  return board;
}

export function boardToDetectedPieces(
  board: ChessBoard,
): DetectedPiece[] {
  return Array.from(board.pieces.values()).map(
    (piece) => ({
      type: piece.type,
      color: piece.color,
      square: piece.square,
    }),
  );
}

export function cloneBoard(
  board: ChessBoard,
): ChessBoard {
  return {
    pieces: new Map(
      Array.from(board.pieces.entries()).map(
        ([square, piece]) => [
          square,
          { ...piece },
        ],
      ),
    ),
    metadata: {
      ...board.metadata,
    },
  };
}

export function countPieces(
  board: ChessBoard,
): number {
  return board.pieces.size;
}

export function countPiecesByColor(
  board: ChessBoard,
  color: PieceColor,
): number {
  let count = 0;

  for (const piece of board.pieces.values()) {
    if (piece.color === color) {
      count += 1;
    }
  }

  return count;
}

export function findKingSquare(
  board: ChessBoard,
  color: PieceColor,
): Square | null {
  for (const piece of board.pieces.values()) {
    if (
      piece.type === "king" &&
      piece.color === color
    ) {
      return piece.square;
    }
  }

  return null;
}

export function validateBoardStructure(
  board: ChessBoard,
): BoardValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const whiteKing = findKingSquare(board, "white");
  const blackKing = findKingSquare(board, "black");

  if (!whiteKing) {
    errors.push("White king is missing.");
  }

  if (!blackKing) {
    errors.push("Black king is missing.");
  }

  for (const piece of board.pieces.values()) {
    if (!isValidSquare(piece.square)) {
      errors.push(
        `Invalid square: ${piece.square}`,
      );
    }

    if (!PIECE_TYPES.includes(piece.type)) {
      errors.push(
        `Invalid piece type: ${piece.type}`,
      );
    }
  }

  if (
    board.metadata.halfmoveClock < 0 ||
    !Number.isInteger(board.metadata.halfmoveClock)
  ) {
    errors.push(
      "Halfmove clock must be a non-negative integer.",
    );
  }

  if (
    board.metadata.fullmoveNumber < 1 ||
    !Number.isInteger(board.metadata.fullmoveNumber)
  ) {
    errors.push(
      "Fullmove number must be a positive integer.",
    );
  }

  if (
    board.metadata.sideToMove !== "w" &&
    board.metadata.sideToMove !== "b"
  ) {
    errors.push("Invalid side-to-move value.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}