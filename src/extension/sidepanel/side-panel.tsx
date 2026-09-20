import { useState } from "react";

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

  const [position] = useState<PositionState>(DEFAULT_POSITION);

  const [engine, setEngine] =
    useState<EngineState>(DEFAULT_ENGINE_STATE);

  const [candidateMoves, setCandidateMoves] = useState<
    CandidateMove[]
  >([]);

  function handleAnalyze() {
    setEngine({
      status: "completed",
      depth: engineSettings.depth,
      nodes: 0,
      evaluation: MOCK_CANDIDATE_MOVES[0]?.evaluation ?? null,
      message:
        "Mock analysis completed. Stockfish integration is planned for Phase 6.",
    });

    setCandidateMoves(
      MOCK_CANDIDATE_MOVES.slice(0, engineSettings.multiPv),
    );
  }

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
        <Section title="Engine">
          <EngineStatus engine={engine} />
        </Section>

        <Section
          title="Position"
          description="Current chess position"
        >
          <PositionCard position={position} />
        </Section>

        <Section
          title="Candidate Moves"
          description={`Top ${engineSettings.multiPv} engine candidates`}
        >
          <CandidateMoves moves={candidateMoves} />
        </Section>

        <Section
          title="Player Settings"
          description="Configure the simulated player"
        >
          <PlayerSettings
            settings={playerSettings}
            onChange={setPlayerSettings}
          />
        </Section>

        <Section
          title="Engine Settings"
          description="Configure analysis parameters"
        >
          <EngineSettings
            settings={engineSettings}
            onChange={setEngineSettings}
          />
        </Section>

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