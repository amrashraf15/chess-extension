import { chessComAdapter } from "./adapters/chess-com";
import { lichessAdapter } from "./adapters/lichess";

import type {
  BoardAdapter,
  ChessSite,
  DetectedBoard,
} from "./adapters/types";

const ADAPTERS: Record<
  ChessSite,
  BoardAdapter
> = {
  "chess.com": chessComAdapter,
  lichess: lichessAdapter,
};

export function detectCurrentSite(): ChessSite | null {
  const hostname =
    window.location.hostname.toLowerCase();

  console.log(
    "[Chess Human] Hostname:",
    hostname,
  );

  if (
    hostname === "chess.com" ||
    hostname.endsWith(".chess.com")
  ) {
    return "chess.com";
  }

  if (
    hostname === "lichess.org" ||
    hostname.endsWith(".lichess.org")
  ) {
    return "lichess";
  }

  return null;
}

export function getAdapter(): BoardAdapter | null {
  const site = detectCurrentSite();

  if (!site) {
    console.log(
      "[Chess Human] Unsupported website.",
    );

    return null;
  }

  return ADAPTERS[site];
}

export function detectBoard(): DetectedBoard | null {
  const adapter = getAdapter();

  if (!adapter) {
    return null;
  }

  console.log(
    "[Chess Human] Using adapter:",
    adapter.site,
  );

  const board = adapter.findBoard();

  if (!board) {
    return null;
  }

  console.log(
    "[Chess Human] Board element detected:",
    board,
  );

  if (!adapter.isValidBoard(board)) {
    console.log(
      "[Chess Human] Board element is invalid.",
    );

    return null;
  }

  const pieces =
    adapter.extractPieces(board);

  console.log(
    "[Chess Human] Total pieces:",
    pieces.length,
  );

  return {
    site: adapter.site,
    element: board,
    orientation:
      adapter.detectOrientation(board),
    pieces,
    detectedAt: Date.now(),
  };
}