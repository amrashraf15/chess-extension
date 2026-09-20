import { useEffect, useState } from "react";

import { Header } from "../../components/layout/Header";
import { Section } from "../../components/layout/Section";
import { EngineStatus } from "../../components/engine/EngineStatus";
import { PositionCard } from "../../components/chess/PositionCard";
import { CandidateMoves } from "../../components/chess/CandidateMoves";
import { PlayerSettings } from "../../components/settings/PlayerSettings";
import { EngineSettings } from "../../components/settings/EngineSettings";

import type {
  CandidateMove,
  EngineSettings as EngineSettingsType,
  EngineState,
  PlayerSettings as PlayerSettingsType,
  PositionState,
} from "../../types/chess";

import type { BoardPosition } from "../../chess/position-parser";
import type { ExtensionMessage } from "../../types/extension-messages";

const DEFAULT_PLAYER_SETTINGS: PlayerSettingsType = {
  elo: 1200,
  style: "balanced",
  inaccuracy: 30,
};

const DEFAULT_ENGINE_SETTINGS: EngineSettingsType = {
  depth: 16,
  multiPv: 5,
  limitType: "depth",
  timeLimitMs: 1000,
};

const DEFAULT_POSITION: PositionState = {
  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  sideToMove: "white",
  moveNumber: 1,
  isLoaded: false,
};

const DEFAULT_ENGINE_STATE: EngineState = {
  status: "ready",
  depth: 0,
  nodes: 0,
  evaluation: null,
  message: "Engine is not connected yet.",
};

const MOCK_CANDIDATE_MOVES: CandidateMove[] = [
  {
    id: "candidate-1",
    move: "e4",
    evaluation: 0.32,
    probability: 0.38,
    depth: 16,
    principalVariation: ["e4", "e5", "Nf3"],
  },
  {
    id: "candidate-2",
    move: "Nf3",
    evaluation: 0.28,
    probability: 0.25,
    depth: 16,
    principalVariation: ["Nf3", "Nc6", "Bb5"],
  },
  {
    id: "candidate-3",
    move: "d4",
    evaluation: 0.21,
    probability: 0.18,
    depth: 16,
    principalVariation: ["d4", "d5", "c4"],
  },
  {
    id: "candidate-4",
    move: "c4",
    evaluation: 0.15,
    probability: 0.11,
    depth: 16,
    principalVariation: ["c4", "e5", "Nc3"],
  },
  {
    id: "candidate-5",
    move: "Nc3",
    evaluation: 0.08,
    probability: 0.08,
    depth: 16,
    principalVariation: ["Nc3", "Nf6", "e4"],
  },
];

export function SidePanel() {
  const [playerSettings, setPlayerSettings] =
    useState<PlayerSettingsType>(DEFAULT_PLAYER_SETTINGS);

  const [engineSettings, setEngineSettings] =
    useState<EngineSettingsType>(DEFAULT_ENGINE_SETTINGS);

  const [position] =
    useState<PositionState>(DEFAULT_POSITION);

  const [engine, setEngine] =
    useState<EngineState>(DEFAULT_ENGINE_STATE);

  const [candidateMoves, setCandidateMoves] = useState<
    CandidateMove[]
  >([]);

  /*
   * ============================================================
   * PHASE 4 — BOARD DETECTION STATE
   * ============================================================
   */

  const [detectedPosition, setDetectedPosition] =
    useState<BoardPosition | null>(null);

  const [boardDetected, setBoardDetected] =
    useState(false);

  /*
   * ============================================================
   * PHASE 4 — LISTEN FOR CONTENT SCRIPT UPDATES
   * ============================================================
   */

  useEffect(() => {
    const listener = (message: ExtensionMessage) => {
      if (
        message.type === "BOARD_DETECTED" ||
        message.type === "BOARD_UPDATED"
      ) {
        setDetectedPosition(message.position);
        setBoardDetected(true);
      }

      if (message.type === "BOARD_LOST") {
        setDetectedPosition(null);
        setBoardDetected(false);
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  /*
   * ============================================================
   * REQUEST CURRENT POSITION
   *
   * The content script may have detected the board before the
   * Side Panel was opened. Therefore, when the Side Panel mounts,
   * ask the active content script for its current position.
   * ============================================================
   */

  useEffect(() => {
    chrome.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then((tabs) => {
        const activeTab = tabs[0];

        if (!activeTab?.id) {
          return;
        }

        chrome.tabs
          .sendMessage(activeTab.id, {
            type: "GET_CURRENT_POSITION",
          })
          .then(
            (
              response: {
                success?: boolean;
                position?: BoardPosition | null;
              } | undefined,
            ) => {
              if (
                response?.success &&
                response.position
              ) {
                setDetectedPosition(response.position);
                setBoardDetected(true);
              }
            },
          )
          .catch(() => {
            /*
             * The current page may not be a supported chess
             * website, or the content script may not be available.
             *
             * This is expected and should not break the Side Panel.
             */
          });
      })
      .catch(() => {
        /*
         * Ignore tab-query errors.
         */
      });
  }, []);

  /*
   * ============================================================
   * ENGINE ANALYSIS
   * ============================================================
   */

  function handleAnalyze() {
    setEngine({
      status: "completed",
      depth: engineSettings.depth,
      nodes: 0,
      evaluation:
        MOCK_CANDIDATE_MOVES[0]?.evaluation ?? null,
      message:
        "Mock analysis completed. Stockfish integration is planned for Phase 6.",
    });

    setCandidateMoves(
      MOCK_CANDIDATE_MOVES.slice(
        0,
        engineSettings.multiPv,
      ),
    );
  }

  /*
   * ============================================================
   * RESET
   * ============================================================
   */

  function handleReset() {
    setPlayerSettings(DEFAULT_PLAYER_SETTINGS);
    setEngineSettings(DEFAULT_ENGINE_SETTINGS);
    setCandidateMoves([]);
    setEngine(DEFAULT_ENGINE_STATE);
  }

  return (
    <div className="side-panel">
      <Header onReset={handleReset} />

      <div className="side-panel-content">
        {/* =====================================================
            PHASE 4 — CHESS BOARD DETECTION
            ===================================================== */}

        <Section
          title="Chess Board"
          description="Live board detection"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  Board Status
                </p>

                <p className="mt-1 text-xs text-white/50">
                  {boardDetected
                    ? `${
                        detectedPosition?.site ??
                        "Unknown site"
                      } detected`
                    : "No chess board detected"}
                </p>
              </div>

              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  boardDetected
                    ? "bg-emerald-400"
                    : "bg-white/20"
                }`}
              />
            </div>

            {detectedPosition && (
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-black/20 p-3">
                  <span className="text-white/40">
                    Orientation
                  </span>

                  <p className="mt-1 capitalize text-white">
                    {detectedPosition.orientation}
                  </p>
                </div>

                <div className="rounded-lg bg-black/20 p-3">
                  <span className="text-white/40">
                    Pieces
                  </span>

                  <p className="mt-1 text-white">
                    {detectedPosition.pieceCount}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* =====================================================
            ENGINE
            ===================================================== */}

        <Section title="Engine">
          <EngineStatus engine={engine} />
        </Section>

        {/* =====================================================
            POSITION
            ===================================================== */}

        <Section
          title="Position"
          description="Current chess position"
        >
          <PositionCard position={position} />
        </Section>

        {/* =====================================================
            CANDIDATE MOVES
            ===================================================== */}

        <Section
          title="Candidate Moves"
          description={`Top ${engineSettings.multiPv} engine candidates`}
        >
          <CandidateMoves moves={candidateMoves} />
        </Section>

        {/* =====================================================
            PLAYER SETTINGS
            ===================================================== */}

        <Section
          title="Player Settings"
          description="Configure the simulated player"
        >
          <PlayerSettings
            settings={playerSettings}
            onChange={setPlayerSettings}
          />
        </Section>

        {/* =====================================================
            ENGINE SETTINGS
            ===================================================== */}

        <Section
          title="Engine Settings"
          description="Configure analysis parameters"
        >
          <EngineSettings
            settings={engineSettings}
            onChange={setEngineSettings}
          />
        </Section>

        {/* =====================================================
            ANALYZE
            ===================================================== */}

        <button
          type="button"
          className="primary-button"
          onClick={handleAnalyze}
        >
          Analyze Position
        </button>

        <p className="disclaimer">
          Analysis mode only. Engine integration will be added
          in a later phase.
        </p>
      </div>
    </div>
  );
}

