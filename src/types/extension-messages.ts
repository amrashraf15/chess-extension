import type { BoardPosition } from "../chess/position-parser";

export type ExtensionMessage =
  | {
      type: "BOARD_DETECTED";
      position: BoardPosition;
    }
  | {
      type: "BOARD_UPDATED";
      position: BoardPosition;
    }
  | {
      type: "BOARD_LOST";
    }
  | {
      type: "GET_CURRENT_POSITION";
    };

export type ExtensionMessageResponse =
  | {
      success: true;
      position: BoardPosition | null;
    }
  | {
      success: false;
      error: string;
    };