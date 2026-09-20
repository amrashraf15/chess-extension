import { detectBoard } from "../../chess/board-detector";
import { normalizePosition } from "../../chess/position-parser";

import type {
  ExtensionMessage,
  ExtensionMessageResponse,
} from "../../types/extension-messages";

let observer: MutationObserver | null = null;

let lastPositionKey: string | null = null;

let scanTimer: number | null = null;

let currentPosition:
  | ReturnType<typeof normalizePosition>
  | null = null;

function createPositionKey(
  position: ReturnType<typeof normalizePosition>,
): string {
  return JSON.stringify({
    site: position.site,
    orientation: position.orientation,
    pieces: position.pieces,
  });
}

function sendMessage(message: ExtensionMessage): void {
  chrome.runtime.sendMessage(message).catch(() => {
    // The Side Panel may not be open.
    // This is expected and should not interrupt board detection.
  });
}

function scanBoard(): void {
  scanTimer = null;

  const board = detectBoard();

  if (!board) {
    if (currentPosition !== null) {
      currentPosition = null;
      lastPositionKey = null;

      sendMessage({
        type: "BOARD_LOST",
      });
    }

    return;
  }

  const position = normalizePosition(board);

  if (position.pieceCount === 0) {
    return;
  }

  const key = createPositionKey(position);

  if (key === lastPositionKey) {
    return;
  }

  const messageType =
    currentPosition === null
      ? "BOARD_DETECTED"
      : "BOARD_UPDATED";

  lastPositionKey = key;
  currentPosition = position;

  sendMessage({
    type: messageType,
    position,
  });
}

function scheduleScan(): void {
  if (scanTimer !== null) {
    return;
  }

  scanTimer = window.setTimeout(() => {
    scanBoard();
  }, 100);
}

function startObserver(): void {
  observer?.disconnect();

  observer = new MutationObserver(() => {
    scheduleScan();
  });

  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: [
      "class",
      "style",
    ],
  });
}

function handleMessage(
  message: ExtensionMessage,
  sendResponse: (
    response: ExtensionMessageResponse,
  ) => void,
): boolean {
  if (message.type !== "GET_CURRENT_POSITION") {
    return false;
  }

  sendResponse({
    success: true,
    position: currentPosition,
  });

  return false;
}

chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    _sender,
    sendResponse,
  ) => {
    return handleMessage(message, sendResponse);
  },
);

function start(): void {
  startObserver();

  scheduleScan();

  window.setTimeout(scheduleScan, 500);

  window.setTimeout(scheduleScan, 1500);
}

start();