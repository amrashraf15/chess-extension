
import {
  type BoardFile,
  type BoardRank,
  type ChessBoard,
  type PositionMetadata,
  type Square,
  type SideToMove,
  isValidSquare,
  createEmptyBoard,
} from "./board";

import type {
  PieceColor,
  PieceType,
} from "./adapters/types";

const PIECE_TO_FEN: Record<
  PieceColor,
  Record<PieceType, string>
> = {
  white: {
    king: "K",
    queen: "Q",
    rook: "R",
    bishop: "B",
    knight: "N",
    pawn: "P",
  },
  black: {
    king: "k",
    queen: "q",
    rook: "r",
    bishop: "b",
    knight: "n",
    pawn: "p",
  },
};

const FEN_TO_PIECE: Record<
  string,
  {
    color: PieceColor;
    type: PieceType;
  }
> = {
  K: { color: "white", type: "king" },
  Q: { color: "white", type: "queen" },
  R: { color: "white", type: "rook" },
  B: { color: "white", type: "bishop" },
  N: { color: "white", type: "knight" },
  P: { color: "white", type: "pawn" },
  k: { color: "black", type: "king" },
  q: { color: "black", type: "queen" },
  r: { color: "black", type: "rook" },
  b: { color: "black", type: "bishop" },
  n: { color: "black", type: "knight" },
  p: { color: "black", type: "pawn" },
};

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
  8,
  7,
  6,
  5,
  4,
  3,
  2,
  1,
];

export interface ParsedFen {
  board: ChessBoard;
  originalFen: string;
}

export interface FenValidationResult {
  valid: boolean;
  errors: string[];
}

function getPieceSymbol(
  board: ChessBoard,
  square: Square,
): string | null {
  const piece = board.pieces.get(square);

  if (!piece) {
    return null;
  }

  return PIECE_TO_FEN[piece.color][piece.type];
}

function serializeRank(
  board: ChessBoard,
  rank: BoardRank,
): string {
  let result = "";
  let emptySquares = 0;

  for (const file of FILES) {
    const square = `${file}${rank}` as Square;
    const symbol = getPieceSymbol(board, square);

    if (!symbol) {
      emptySquares += 1;
      continue;
    }

    if (emptySquares > 0) {
      result += String(emptySquares);
      emptySquares = 0;
    }

    result += symbol;
  }

  if (emptySquares > 0) {
    result += String(emptySquares);
  }

  return result;
}

export function boardToPiecePlacement(
  board: ChessBoard,
): string {
  return RANKS
    .map((rank) => serializeRank(board, rank))
    .join("/");
}

export function boardToFen(
  board: ChessBoard,
): string {
  const piecePlacement =
    boardToPiecePlacement(board);

  const {
    sideToMove,
    castlingRights,
    enPassantTarget,
    halfmoveClock,
    fullmoveNumber,
  } = board.metadata;

  return [
    piecePlacement,
    sideToMove,
    castlingRights || "-",
    enPassantTarget || "-",
    halfmoveClock,
    fullmoveNumber,
  ].join(" ");
}

function parsePiecePlacement(
  placement: string,
): ChessBoard {
  const ranks = placement.split("/");

  if (ranks.length !== 8) {
    throw new Error(
      "FEN piece placement must contain 8 ranks.",
    );
  }

  const board = createEmptyBoard();

  for (
    let rankIndex = 0;
    rankIndex < 8;
    rankIndex += 1
  ) {
    const rank = RANKS[rankIndex];
    const rankData = ranks[rankIndex];

    let fileIndex = 0;

    for (const character of rankData) {
      if (fileIndex > 7) {
        throw new Error(
          `Too many files in rank ${rank}.`,
        );
      }

      if (/^[1-8]$/.test(character)) {
        fileIndex += Number(character);
        continue;
      }

      const pieceData = FEN_TO_PIECE[character];

      if (!pieceData) {
        throw new Error(
          `Invalid FEN piece symbol: ${character}`,
        );
      }

      if (fileIndex > 7) {
        throw new Error(
          `Invalid file position in rank ${rank}.`,
        );
      }

      const file = FILES[fileIndex];
      const square = `${file}${rank}` as Square;

      board.pieces.set(square, {
        ...pieceData,
        square,
      });

      fileIndex += 1;
    }

    if (fileIndex !== 8) {
      throw new Error(
        `Rank ${rank} does not contain 8 squares.`,
      );
    }
  }

  return board;
}

function parseSideToMove(
  value: string,
): SideToMove {
  if (value !== "w" && value !== "b") {
    throw new Error(
      `Invalid side to move: ${value}`,
    );
  }

  return value;
}

function parseMetadata(
  fields: string[],
): PositionMetadata {
  if (fields.length !== 6) {
    throw new Error(
      "A complete FEN must contain 6 fields.",
    );
  }

  const sideToMoveValue = fields[1];
  const castlingRights = fields[2];
 const enPassantTarget = fields[3];
 const halfmoveValue = fields[4];
 const fullmoveValue = fields[5];

  const halfmoveClock = Number(halfmoveValue);
  const fullmoveNumber = Number(fullmoveValue);

  if (
    !Number.isInteger(halfmoveClock) ||
    halfmoveClock < 0
  ) {
    throw new Error(
      "Invalid halfmove clock.",
    );
  }

  if (
    !Number.isInteger(fullmoveNumber) ||
    fullmoveNumber < 1
  ) {
    throw new Error(
      "Invalid fullmove number.",
    );
  }

  if (
    castlingRights !== "-" &&
    !/^[KQkq]+$/.test(castlingRights)
  ) {
    throw new Error(
      "Invalid castling rights.",
    );
  }

  if (
    enPassantTarget !== "-" &&
    !isValidSquare(enPassantTarget)
  ) {
    throw new Error(
      "Invalid en passant target square.",
    );
  }

  return {
    sideToMove: parseSideToMove(sideToMoveValue),
    castlingRights,
    enPassantTarget: enPassantTarget as
      | Square
      | "-",
    halfmoveClock,
    fullmoveNumber,
  };
}

export function fenToBoard(
  fen: string,
): ParsedFen {
  const fields = fen.trim().split(/\s+/);

  if (fields.length !== 6) {
    throw new Error(
      "FEN must contain exactly 6 fields.",
    );
  }

  const board = parsePiecePlacement(fields[0]);

  board.metadata = parseMetadata(fields);

  return {
    board,
    originalFen: fen.trim(),
  };
}

export function validateFenStructure(
  fen: string,
): FenValidationResult {
  try {
    fenToBoard(fen);

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
          : "Unknown FEN parsing error.",
      ],
    };
  }
}