import type {
  BoardAdapter,
  ChessSite,
  DetectedPiece,
  PieceColor,
  PieceType,
} from "./types";

const ROLE_MAP: Record<string, PieceType> = {
  king: "king",
  queen: "queen",
  rook: "rook",
  bishop: "bishop",
  knight: "knight",
  pawn: "pawn",
};

function getColor(element: Element): PieceColor | null {
  if (element.classList.contains("white")) {
    return "white";
  }

  if (element.classList.contains("black")) {
    return "black";
  }

  return null;
}

function getPieceType(element: Element): PieceType | null {
  for (const [role, type] of Object.entries(ROLE_MAP)) {
    if (element.classList.contains(role)) {
      return type;
    }
  }

  return null;
}

function getBoardWrapper(
  board: HTMLElement,
): HTMLElement | null {
  return board.closest(".cg-wrap");
}

function detectBoardOrientation(
  board: HTMLElement,
): PieceColor {
  const wrapper = getBoardWrapper(board);

  if (
    wrapper?.classList.contains("orientation-black")
  ) {
    return "black";
  }

  return "white";
}

/**
 * Convert a Lichess/Chessground piece DOM element
 * into a chess square.
 *
 * We intentionally do NOT parse style.transform.
 *
 * Chessground may represent transforms differently
 * depending on the version/browser/animation state.
 *
 * getBoundingClientRect() gives us the actual rendered
 * position of the piece on the board.
 */
function parsePieceSquare(
  element: HTMLElement,
  board: HTMLElement,
): string | null {
  const boardRect = board.getBoundingClientRect();
  const pieceRect = element.getBoundingClientRect();

  const boardSize = Math.min(
    boardRect.width,
    boardRect.height,
  );

  if (boardSize <= 0) {
    console.warn(
      "[Chess Human][Lichess] Invalid board size:",
      boardSize,
    );

    return null;
  }

  const squareSize = boardSize / 8;

  /**
   * Use the center of the piece.
   *
   * This is more reliable than reading CSS transform.
   */
  const pieceCenterX =
    pieceRect.left + pieceRect.width / 2;

  const pieceCenterY =
    pieceRect.top + pieceRect.height / 2;

  const relativeX =
    pieceCenterX - boardRect.left;

  const relativeY =
    pieceCenterY - boardRect.top;

  /**
   * Convert pixel position -> board coordinates.
   *
   * Example:
   *
   * relativeX = 50
   * squareSize = 100
   *
   * => fileIndex = 0
   *
   * relativeY = 50
   * => rankFromTop = 0
   */
  const fileIndex = Math.floor(
    relativeX / squareSize,
  );

  const rankFromTop = Math.floor(
    relativeY / squareSize,
  );

  console.log(
    "[Chess Human][Lichess] Piece position:",
    {
      piece: element,
      boardRect,
      pieceRect,
      pieceCenterX,
      pieceCenterY,
      relativeX,
      relativeY,
      squareSize,
      fileIndex,
      rankFromTop,
    },
  );

  if (
    fileIndex < 0 ||
    fileIndex > 7 ||
    rankFromTop < 0 ||
    rankFromTop > 7
  ) {
    console.warn(
      "[Chess Human][Lichess] Piece outside board:",
      {
        fileIndex,
        rankFromTop,
      },
    );

    return null;
  }

  const orientation =
    detectBoardOrientation(board);

  let actualFile: number;
  let actualRank: number;

  if (orientation === "white") {
    /**
     * White orientation:
     *
     * a b c d e f g h
     * 8 7 6 5 4 3 2 1
     *
     * top-left = a8
     */
    actualFile = fileIndex;
    actualRank = 7 - rankFromTop;
  } else {
    /**
     * Black orientation:
     *
     * h g f e d c b a
     * 1 2 3 4 5 6 7 8
     *
     * top-left = h1
     */
    actualFile = 7 - fileIndex;
    actualRank = rankFromTop;
  }

  const square = `${String.fromCharCode(
    97 + actualFile,
  )}${actualRank + 1}`;

  console.log(
    "[Chess Human][Lichess] Calculated square:",
    square,
  );

  return square;
}

export const lichessAdapter: BoardAdapter = {
  site: "lichess" satisfies ChessSite,

  findBoard(): HTMLElement | null {
    console.log(
      "[Chess Human][Lichess] Searching for board...",
    );

    /**
     * Modern Lichess / Chessground board.
     */
    const board =
      document.querySelector<HTMLElement>(
        "cg-board",
      );

    if (!board) {
      console.warn(
        "[Chess Human][Lichess] <cg-board> NOT FOUND",
      );

      return null;
    }

    console.log(
      "[Chess Human][Lichess] Board FOUND:",
      board,
    );

    return board;
  },

  detectOrientation(
    board: HTMLElement,
  ): PieceColor {
    const orientation =
      detectBoardOrientation(board);

    console.log(
      "[Chess Human][Lichess] Orientation:",
      orientation,
    );

    return orientation;
  },

  extractPieces(
    board: HTMLElement,
  ): DetectedPiece[] {
    console.log(
      "[Chess Human][Lichess] Searching for pieces...",
    );

    /**
     * Chessground renders pieces as:
     *
     * <piece class="white king"></piece>
     * <piece class="black pawn"></piece>
     *
     * etc.
     */
    const elements =
      board.querySelectorAll<HTMLElement>(
        ":scope > piece",
      );

    console.log(
      "[Chess Human][Lichess] Piece elements found:",
      elements.length,
    );

    const pieces: DetectedPiece[] = [];

    for (
      const [index, element] of elements.entries()
    ) {
      console.log(
        `[Chess Human][Lichess] Processing piece ${
          index + 1
        }/${elements.length}`,
        element,
      );

      const color =
        getColor(element);

      const type =
        getPieceType(element);

      console.log(
        "[Chess Human][Lichess] Piece metadata:",
        {
          color,
          type,
          classes: Array.from(
            element.classList,
          ),
        },
      );

      if (!color || !type) {
        console.warn(
          "[Chess Human][Lichess] Could not identify piece.",
          element,
        );

        continue;
      }

      const square =
        parsePieceSquare(
          element,
          board,
        );

      if (!square) {
        console.warn(
          "[Chess Human][Lichess] Could not determine square.",
          element,
        );

        continue;
      }

      const piece: DetectedPiece = {
        color,
        type,
        square,
      };

      console.log(
        "[Chess Human][Lichess] Detected piece:",
        piece,
      );

      pieces.push(piece);
    }

    console.log(
      "[Chess Human][Lichess] Successfully detected:",
      pieces.length,
      "pieces",
    );

    console.table(pieces);

    return pieces;
  },

  isValidBoard(
    board: HTMLElement,
  ): boolean {
    const valid =
      board.tagName.toLowerCase() ===
      "cg-board";

    console.log(
      "[Chess Human][Lichess] Board validation:",
      valid,
    );

    return valid;
  },
};