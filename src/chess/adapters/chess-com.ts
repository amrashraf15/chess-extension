import type {
  BoardAdapter,
  ChessSite,
  DetectedPiece,
  PieceColor,
  PieceType,
} from "./types";

const PIECE_TYPES: Record<string, PieceType> = {
  k: "king",
  q: "queen",
  r: "rook",
  b: "bishop",
  n: "knight",
  p: "pawn",
};

const BOARD_SELECTORS = [
  "wc-chess-board",
  "wc-chess-board.board",
  ".board",
  ".chess-board",
  "[class*='chess-board']",
  "[data-board]",
];

function getPieceFromClasses(
  element: Element,
): { color: PieceColor; type: PieceType } | null {
  const classes = Array.from(element.classList);

  if (!classes.includes("piece")) {
    return null;
  }

  const pieceClass = classes.find((value) =>
    /^[wb][kqrbnp]$/.test(value),
  );

  if (!pieceClass) {
    return null;
  }

  const color: PieceColor =
    pieceClass[0] === "w" ? "white" : "black";

  const type = PIECE_TYPES[pieceClass[1]];

  if (!type) {
    return null;
  }

  return {
    color,
    type,
  };
}

function parseSquareClass(
  element: Element,
): string | null {
  const squareClass = Array.from(element.classList).find(
    (value) => /^square-[1-8][1-8]$/.test(value),
  );

  if (!squareClass) {
    return null;
  }

  const encoded = squareClass.replace("square-", "");

  const file = Number(encoded[0]);
  const rank = Number(encoded[1]);

  if (
    !Number.isInteger(file) ||
    !Number.isInteger(rank) ||
    file < 1 ||
    file > 8 ||
    rank < 1 ||
    rank > 8
  ) {
    return null;
  }

  return `${String.fromCharCode(96 + file)}${rank}`;
}

export const chessComAdapter: BoardAdapter = {
  site: "chess.com" satisfies ChessSite,

  findBoard(): HTMLElement | null {
    console.log(
      "[Chess Human][Chess.com] Searching for board...",
    );

    for (const selector of BOARD_SELECTORS) {
      const board =
        document.querySelector<HTMLElement>(selector);

      if (board) {
        console.log(
          "[Chess Human][Chess.com] Board found using:",
          selector,
          board,
        );

        return board;
      }
    }

    console.log(
      "[Chess Human][Chess.com] No board selector matched.",
    );

    return null;
  },

  detectOrientation(board: HTMLElement): PieceColor {
    const flipped =
      board.classList.contains("flipped") ||
      board.closest(".board-layout")?.classList.contains("flipped") ||
      document.body.classList.contains("flipped");

    return flipped ? "black" : "white";
  },

  extractPieces(
    board: HTMLElement,
  ): DetectedPiece[] {
    const elements =
      board.querySelectorAll(".piece");

    console.log(
      "[Chess Human][Chess.com] Piece elements:",
      elements.length,
    );

    const pieces: DetectedPiece[] = [];

    for (const element of elements) {
      const piece = getPieceFromClasses(element);

      if (!piece) {
        continue;
      }

      const square = parseSquareClass(element);

      if (!square) {
        continue;
      }

      pieces.push({
        ...piece,
        square,
      });
    }

    console.log(
      "[Chess Human][Chess.com] Parsed pieces:",
      pieces,
    );

    return pieces;
  },

  isValidBoard(
    board: HTMLElement,
  ): boolean {
    return board.matches("wc-chess-board") ||
      board.querySelector(".piece") !== null;
  },
};