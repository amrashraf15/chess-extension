export type PlayerStyle =
  | "balanced"
  | "aggressive"
  | "positional"
  | "solid"
  | "creative";

export type EngineLimitType = "depth" | "time";

export type EngineStatus =
  | "idle"
  | "ready"
  | "analyzing"
  | "completed"
  | "error";

export interface CandidateMove {
  id: string;
  move: string;
  evaluation: number;
  probability: number;
  depth: number;
  principalVariation: string[];
}

export interface PlayerSettings {
  elo: number;
  style: PlayerStyle;
  inaccuracy: number;
}

export interface EngineSettings {
  depth: number;
  multiPv: number;
  limitType: EngineLimitType;
  timeLimitMs: number;
}

export interface PositionState {
  fen: string;
  sideToMove: "white" | "black";
  moveNumber: number;
  isLoaded: boolean;
}

export interface EngineState {
  status: EngineStatus;
  depth: number;
  nodes: number;
  evaluation: number | null;
  message: string;
}