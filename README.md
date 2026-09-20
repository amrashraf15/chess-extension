# ♟️ Chess Human Extension

A browser-based chess analysis and training extension for **Google Chrome** and **Brave**.

The extension combines **Stockfish**, chess-position analysis, and a configurable **human-like decision layer** to provide multiple reasonable move options instead of always presenting only the engine's top move.

The project is designed around **Chrome Manifest V3**, **TypeScript**, **React**, **Vite**, **WebAssembly**, and **Web Workers**.

> **Important:** The initial versions are intended for chess analysis, training, and permitted/offline environments. Automated play on online chess platforms should only be used where the platform explicitly permits it.

---

# 📌 Project Goals

The extension aims to provide:

* ♟️ Chess position detection
* 🧠 Stockfish-powered analysis
* 🔢 Top 5 candidate moves
* 📊 Position evaluation
* 🎯 Configurable playing strength
* 👤 Human-like move selection
* 🎲 Controlled inaccuracies and mistakes
* ⏱️ Human-like time management
* 🎨 Multiple playing styles
* 🌐 Chrome support
* 🦁 Brave support
* 💾 Persistent user settings
* 🧩 Site-specific chess-board adapters
* 🚀 Optional future adaptive player modeling

---

# 🏗️ Architecture

```text
                         Browser
                            │
             ┌──────────────┴──────────────┐
             │                             │
          Web Page                    Side Panel
             │                             │
             ▼                             ▼
      ┌───────────────┐             ┌───────────────┐
      │ Content Script│             │ React UI      │
      └───────┬───────┘             └───────┬───────┘
              │                             │
              │ FEN / Moves                 │ Settings
              │                             │
              └──────────────┬──────────────┘
                             ▼
                    ┌─────────────────┐
                    │ Engine Manager  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Stockfish WASM  │
                    │ Web Worker      │
                    └────────┬────────┘
                             │
                      Engine candidates
                             │
                             ▼
                    ┌─────────────────┐
                    │ Human Player    │
                    │ Decision Layer  │
                    └────────┬────────┘
                             │
                     Human-like choice
                             │
                             ▼
                    ┌─────────────────┐
                    │ Candidate Moves │
                    │      Top 5      │
                    └─────────────────┘
```

---

# 📁 Project Structure

```text
chess-human-extension/
│
├── extension/
│   ├── manifest.json
│   │
│   ├── background/
│   │   └── service-worker.ts
│   │
│   ├── content/
│   │   ├── chess-site-detector.ts
│   │   ├── board-reader.ts
│   │   └── move-handler.ts
│   │
│   ├── sidepanel/
│   │   ├── index.html
│   │   ├── app.ts
│   │   ├── styles.css
│   │   └── components/
│   │
│   ├── engine/
│   │   ├── stockfish.worker.ts
│   │   ├── engine.ts
│   │   ├── multipv.ts
│   │   └── human-player.ts
│   │
│   ├── chess/
│   │   ├── board.ts
│   │   ├── fen.ts
│   │   └── move-generator.ts
│   │
│   └── storage/
│       └── settings.ts
│
├── stockfish/
│   ├── stockfish.js
│   └── stockfish.wasm
│
├── package.json
└── README.md
```

---

# 🗺️ Development Roadmap

The project is divided into **12 phases**.

Each phase should leave the project in a working state.

```text
Phase 01 → Project Foundation
Phase 02 → Chrome/Brave Extension
Phase 03 → Side Panel UI
Phase 04 → Chess Board Detection
Phase 05 → FEN & Chess Position
Phase 06 → Stockfish Integration
Phase 07 → MultiPV / Top 5 Moves
Phase 08 → Human Player Model
Phase 09 → Elo & Playing Styles
Phase 10 → Human Mistakes & Time Management
Phase 11 → Website Adapters & Testing
Phase 12 → Production Build & Release
```

---

# 🟢 Phase 01 — Project Foundation

## Objective

Create the basic TypeScript project and development environment.

## Tasks

* [ ] Initialize Git repository
* [ ] Initialize `package.json`
* [ ] Configure TypeScript
* [ ] Configure Vite
* [ ] Create source directories
* [ ] Configure ESLint
* [ ] Configure Prettier
* [ ] Create initial README
* [ ] Create development scripts
* [ ] Create `.gitignore`

## Expected Structure

```text
chess-human-extension/
├── extension/
├── stockfish/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── README.md
```

## Deliverable

A clean TypeScript project that can be built successfully.

---

# 🟢 Phase 02 — Chrome & Brave Extension Foundation

## Objective

Create a working **Manifest V3** browser extension.

## Tasks

* [ ] Create `manifest.json`
* [ ] Configure Manifest V3
* [ ] Configure extension permissions
* [ ] Configure background service worker
* [ ] Configure side panel
* [ ] Configure content scripts
* [ ] Configure extension icons
* [ ] Load extension into Chrome
* [ ] Load extension into Brave

## Target Structure

```text
extension/
├── manifest.json
├── background/
│   └── service-worker.ts
├── content/
└── sidepanel/
```

## Deliverable

The extension should successfully load in:

```text
Chrome
Brave
```

and appear in the browser's extensions page.

---

# 🟢 Phase 03 — Side Panel UI

## Objective

Build the user interface for the chess assistant.

## UI Components

```text
Side Panel
│
├── Header
│
├── Playing Strength
│
├── Human Style
│
├── Position Evaluation
│
├── Candidate Moves
│
├── Engine Information
│
└── Settings
```

## Example

```text
┌──────────────────────────┐
│ ♟ Chess Human            │
├──────────────────────────┤
│                          │
│ Playing Strength         │
│                          │
│ 800 ─────●────── 2400    │
│          1500            │
│                          │
├──────────────────────────┤
│ POSITION                 │
│                          │
│ Evaluation: +0.42        │
│                          │
├──────────────────────────┤
│ TOP 5 MOVES              │
│                          │
│ 1. Nf3      +0.42        │
│ 2. d4       +0.38        │
│ 3. c4       +0.31        │
│ 4. Bb5      +0.25        │
│ 5. O-O      +0.19        │
│                          │
└──────────────────────────┘
```

## Tasks

* [ ] Create `index.html`
* [ ] Create `app.ts`
* [ ] Create `styles.css`
* [ ] Create reusable components
* [ ] Add Elo selector
* [ ] Add style selector
* [ ] Add candidate move cards
* [ ] Add evaluation display
* [ ] Add loading state
* [ ] Add error state

## Deliverable

A functional side panel with mock chess data.

---

# 🟢 Phase 04 — Chess Board Detection

## Objective

Detect chess boards on supported websites.

## Components

```text
chess-site-detector.ts
board-reader.ts
move-handler.ts
```

## Responsibilities

### `chess-site-detector.ts`

Identify the current website.

```text
Chess.com
Lichess
Other supported site
Unknown
```

### `board-reader.ts`

Extract:

* board element
* board orientation
* pieces
* piece positions
* current turn
* game state

### `move-handler.ts`

Handle detected board changes.

## Tasks

* [ ] Detect supported chess website
* [ ] Detect chess board
* [ ] Detect board orientation
* [ ] Read pieces
* [ ] Convert coordinates
* [ ] Detect board changes
* [ ] Detect player's color
* [ ] Detect opponent move

## Deliverable

Given a chess board, the extension can determine the current position.

---

# 🟢 Phase 05 — Chess Position & FEN

## Objective

Convert the detected board into a standard chess representation.

The primary format will be **FEN**.

Example:

```text
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

## Files

```text
extension/chess/
├── board.ts
├── fen.ts
└── move-generator.ts
```

## Tasks

* [ ] Create internal board representation
* [ ] Convert board → FEN
* [ ] Parse FEN → board
* [ ] Track side to move
* [ ] Track castling rights
* [ ] Track en passant
* [ ] Track halfmove clock
* [ ] Track fullmove number
* [ ] Validate positions

## Testing

Test:

* [ ] Starting position
* [ ] Castling
* [ ] En passant
* [ ] Promotion
* [ ] Mid-game positions
* [ ] Endgame positions

## Deliverable

Reliable FEN generation from detected browser positions.

---

# 🟢 Phase 06 — Stockfish Integration

## Objective

Integrate Stockfish into the extension.

Stockfish will run locally through:

```text
WebAssembly
+
Web Worker
+
UCI protocol
```

## Files

```text
stockfish/
├── stockfish.js
└── stockfish.wasm
```

and:

```text
extension/engine/
├── stockfish.worker.ts
└── engine.ts
```

## Architecture

```text
Extension
    │
    ▼
engine.ts
    │
    ▼
Web Worker
    │
    ▼
Stockfish WASM
    │
    ▼
UCI
```

## Tasks

* [ ] Add Stockfish WASM
* [ ] Create worker
* [ ] Initialize engine
* [ ] Implement UCI communication
* [ ] Send FEN
* [ ] Start analysis
* [ ] Parse engine output
* [ ] Stop analysis
* [ ] Handle engine errors

## Basic Commands

```text
uci
isready
position fen <FEN>
go depth 18
stop
quit
```

## Deliverable

The extension can analyze a FEN position using Stockfish.

---

# 🟢 Phase 07 — MultiPV & Top 5 Moves

## Objective

Instead of displaying only the engine's best move, generate the top five candidate moves.

## Architecture

```text
Position
   │
   ▼
Stockfish
   │
   ▼
MultiPV = 5
   │
   ├── Move 1
   ├── Move 2
   ├── Move 3
   ├── Move 4
   └── Move 5
```

## Files

```text
extension/engine/
└── multipv.ts
```

## Candidate Information

Each candidate should contain:

```typescript
interface CandidateMove {
    rank: number;
    move: string;
    evaluation: number;
    depth: number;
    principalVariation?: string[];
}
```

## Example

```text
1. Nf3   +0.42
2. d4    +0.38
3. c4    +0.31
4. Bb5   +0.25
5. O-O   +0.19
```

## Tasks

* [ ] Enable MultiPV
* [ ] Request five variations
* [ ] Parse MultiPV responses
* [ ] Normalize evaluations
* [ ] Sort candidate moves
* [ ] Display top five
* [ ] Add move details
* [ ] Add engine depth

## Deliverable

The extension displays five engine candidate moves.

---

# 🟢 Phase 08 — Human Player Model

## Objective

Build the main differentiating feature of the project.

The system should not always select the engine's #1 move.

Instead:

```text
Stockfish
    │
    ▼
Top candidate moves
    │
    ▼
Human Player Model
    │
    ├── Elo
    ├── Style
    ├── Position complexity
    ├── Tactical difficulty
    └── Randomness
    │
    ▼
Human-like choice
```

## File

```text
extension/engine/human-player.ts
```

## Initial Model

```typescript
interface HumanPlayerConfig {
    elo: number;
    style: PlayerStyle;
    riskTolerance: number;
    tacticalAwareness: number;
    consistency: number;
}
```

## Candidate Selection

Example:

```text
Engine:

1. Qd2   +1.80
2. Rd1   +1.50
3. Nc3   +1.20
4. O-O   +1.00
5. h3    +0.70
```

At a lower simulated strength, the model may select:

```text
Nc3
```

rather than always choosing:

```text
Qd2
```

## Tasks

* [ ] Define human-player configuration
* [ ] Define move-quality categories
* [ ] Calculate evaluation loss
* [ ] Filter extreme blunders
* [ ] Implement weighted candidate selection
* [ ] Add controlled randomness
* [ ] Make behavior deterministic when seeded
* [ ] Add unit tests

## Deliverable

The system can select a reasonable move without always selecting Stockfish's first move.

---

# 🟢 Phase 09 — Elo & Playing Styles

## Objective

Allow the user to configure the simulated player.

## Elo Range

```text
800
1000
1200
1400
1600
1800
2000
2200
2400
```

The system should translate Elo into internal behavioral parameters rather than treating the number as a precise measurement of real-world playing strength.

## Player Styles

### Balanced

```text
Balanced
├── moderate risk
├── moderate tactical awareness
└── moderate consistency
```

### Aggressive

```text
Aggressive
├── higher risk
├── tactical positions
└── attacking moves
```

### Positional

```text
Positional
├── lower risk
├── strategic moves
└── long-term improvements
```

### Defensive

```text
Defensive
├── lower risk
├── king safety
└── simplification
```

### Tactical

```text
Tactical
├── tactical opportunities
├── combinations
└── dynamic positions
```

## Tasks

* [ ] Add Elo selector
* [ ] Add player styles
* [ ] Create style configuration
* [ ] Map Elo → behavior
* [ ] Map style → behavior
* [ ] Combine Elo + style
* [ ] Add configuration preview

## Deliverable

Different configurations produce visibly different move-selection behavior.

---

# 🟢 Phase 10 — Human Mistakes & Time Management

## Objective

Make the simulated player behave more naturally.

The system should not generate completely random blunders.

Instead, mistakes should depend on the position.

## Position Factors

```text
Position
   │
   ├── Complexity
   ├── Tactical density
   ├── King safety
   ├── Material imbalance
   ├── Opening familiarity
   └── Time pressure
```

These factors influence the probability of selecting weaker candidates.

## Example

```text
Simple position
    ↓
Low mistake probability
```

```text
Complex tactical position
    ↓
Higher mistake probability
```

```text
Low remaining time
    ↓
Higher probability of inaccurate move
```

## Mistake Categories

```text
Excellent
Good
Inaccuracy
Mistake
Blunder
```

The exact thresholds should be configurable and validated experimentally rather than assumed to correspond directly to a particular Elo.

## Tasks

* [ ] Calculate position complexity
* [ ] Detect tactical positions
* [ ] Detect material imbalance
* [ ] Model time pressure
* [ ] Add mistake probability
* [ ] Add blunder protection
* [ ] Add opening familiarity
* [ ] Test behavior over many games

## Deliverable

Human-like inaccuracies occur for understandable reasons instead of arbitrary random moves.

---

# 🟢 Phase 11 — Website Adapters & Testing

## Objective

Make the extension reliable across supported chess websites.

## Adapter Architecture

```text
WebsiteAdapter
       │
       ├── ChessComAdapter
       │
       ├── LichessAdapter
       │
       └── FutureAdapter
```

Each adapter should implement a common interface.

```typescript
interface ChessSiteAdapter {
    detect(): boolean;

    getBoard(): BoardState;

    getOrientation(): BoardOrientation;

    getTurn(): Color;

    getGameState(): GameState;
}
```

## Testing

### Unit Tests

* [ ] FEN generation
* [ ] FEN parsing
* [ ] Move parsing
* [ ] MultiPV parsing
* [ ] Human move selection
* [ ] Elo configuration
* [ ] Style configuration

### Integration Tests

* [ ] Board detection
* [ ] Engine communication
* [ ] Side panel communication
* [ ] Content script ↔ background
* [ ] Background ↔ side panel

### Browser Tests

* [ ] Chrome
* [ ] Brave

### Chess Positions

Test:

* [ ] Opening
* [ ] Middlegame
* [ ] Endgame
* [ ] Tactical positions
* [ ] Check
* [ ] Checkmate
* [ ] Castling
* [ ] Promotion
* [ ] En passant

## Deliverable

A stable extension capable of handling real chess positions on supported sites.

---

# 🟢 Phase 12 — Production Build & Release

## Objective

Prepare the extension for distribution.

## Tasks

* [ ] Optimize production bundle
* [ ] Minimize unnecessary permissions
* [ ] Verify Manifest V3
* [ ] Package extension
* [ ] Test clean installation
* [ ] Test upgrade process
* [ ] Add extension icons
* [ ] Add screenshots
* [ ] Update README
* [ ] Create release version
* [ ] Create changelog

## Production Structure

```text
dist/
├── manifest.json
├── background/
├── content/
├── sidepanel/
├── engine/
├── chess/
├── storage/
└── stockfish/
```

## Deliverable

A production-ready Chrome/Brave extension package.

---

# 🧪 Testing Strategy

The project should use multiple testing levels.

```text
                 Testing
                    │
       ┌────────────┼────────────┐
       │            │            │
       ▼            ▼            ▼
     Unit       Integration    Browser
       │            │            │
       ▼            ▼            ▼
    Logic        Components     Real Site
```

---

# 📊 Core Data Flow

When a position changes:

```text
1. Chess website changes position
                │
                ▼
2. Content script detects change
                │
                ▼
3. Board reader extracts pieces
                │
                ▼
4. Board converted to FEN
                │
                ▼
5. Engine receives FEN
                │
                ▼
6. Stockfish calculates candidates
                │
                ▼
7. MultiPV returns top 5
                │
                ▼
8. Human Player Model processes them
                │
                ▼
9. UI displays candidates
                │
                ▼
10. User selects a move
```

---

# 🧠 Human Decision Model

The human simulation layer is intentionally separated from Stockfish.

```text
              Stockfish
                  │
                  ▼
        ┌──────────────────┐
        │ Candidate Moves  │
        └────────┬─────────┘
                 │
                 ▼
        ┌──────────────────┐
        │ Position Analysis│
        └────────┬─────────┘
                 │
       ┌─────────┼─────────┐
       │         │         │
       ▼         ▼         ▼
      Elo      Style    Complexity
       │         │         │
       └─────────┼─────────┘
                 ▼
        ┌──────────────────┐
        │ Human Decision   │
        │      Model       │
        └────────┬─────────┘
                 ▼
            Selected Move
```

---

# ⚙️ Configuration

Example configuration:

```json
{
    "elo": 1500,
    "style": "balanced",
    "riskTolerance": 0.45,
    "tacticalAwareness": 0.60,
    "consistency": 0.70,
    "candidateMoves": 5,
    "engineDepth": 18,
    "humanMode": true
}
```

---

# 📈 Future Features

After the core system is stable, the project can be extended with:

## Player Fingerprint

Create a behavioral profile:

```text
Player Profile

ELO                 1500
Tactical             62
Positional           71
Aggression           74
Risk                 67
Consistency           58
Endgame               55
Opening               48
```

---

## Adaptive Player Model

The system could analyze previous decisions and adjust its internal profile.

```text
Games
  │
  ▼
Move History
  │
  ▼
Behavior Analysis
  │
  ├── Tactical accuracy
  ├── Opening performance
  ├── Endgame performance
  ├── Risk preference
  └── Time management
  │
  ▼
Updated Player Profile
```

---

# 🔬 Possible Machine Learning Extension

A future version could collect training data from permitted games and study relationships between:

```text
Position Features
        +
Player Features
        +
Candidate Moves
        │
        ▼
Move Selection Model
```

Potential models:

* Logistic Regression
* Random Forest
* Gradient Boosting
* Neural Network
* Learning-to-Rank models

The ML model should remain separate from the initial rule-based system so the baseline remains understandable and testable.

---

# 🔐 Privacy

The initial architecture is designed to perform analysis locally.

Goals:

* No chess positions sent to a remote server by default
* Stockfish runs locally
* User settings stored locally
* No account required for the core extension
* No unnecessary permissions

Any future telemetry or cloud features should be opt-in.

---

# 🌐 Browser Compatibility

## Chrome

Target:

```text
Google Chrome
Manifest V3
```

## Brave

Target:

```text
Brave Browser
Chromium
Manifest V3
```

Because both browsers use Chromium-based extension APIs, most of the implementation can be shared.

---

# 🛠️ Development Commands

The final project should provide commands similar to:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Test:

```bash
npm test
```

Lint:

```bash
npm run lint
```

Type checking:

```bash
npm run typecheck
```

---

# 📦 Installation for Development

## Chrome

1. Build the project.

```bash
npm run build
```

2. Open:

```text
chrome://extensions
```

3. Enable:

```text
Developer mode
```

4. Select:

```text
Load unpacked
```

5. Select the generated `dist/` directory.

---

## Brave

1. Build the project.

```bash
npm run build
```

2. Open:

```text
brave://extensions
```

3. Enable:

```text
Developer mode
```

4. Select:

```text
Load unpacked
```

5. Select the generated `dist/` directory.

---

# 📌 Project Milestones

| Milestone            | Phase | Result                 |
| -------------------- | ----: | ---------------------- |
| Foundation           |     1 | TypeScript project     |
| Extension            |     2 | Chrome/Brave extension |
| UI                   |     3 | Side panel             |
| Board Detection      |     4 | Detect chess board     |
| Chess Representation |     5 | FEN                    |
| Engine               |     6 | Stockfish              |
| Analysis             |     7 | Top 5 moves            |
| Human Model          |     8 | Human-like selection   |
| Strength             |     9 | Elo + styles           |
| Behavior             |    10 | Mistakes + time        |
| Compatibility        |    11 | Website adapters       |
| Release              |    12 | Production build       |

---

# 🎯 MVP Definition

The first MVP is complete when the extension can:

```text
┌──────────────────────────────────────┐
│             MVP                      │
├──────────────────────────────────────┤
│                                      │
│ ✓ Load in Chrome                     │
│ ✓ Load in Brave                      │
│ ✓ Open side panel                    │
│ ✓ Detect a supported chess board     │
│ ✓ Extract current position           │
│ ✓ Generate FEN                       │
│ ✓ Run Stockfish locally              │
│ ✓ Generate top 5 moves               │
│ ✓ Display evaluations                │
│ ✓ Select target Elo                  │
│ ✓ Apply human decision model         │
│ ✓ Display human-oriented candidates  │
│                                      │
└──────────────────────────────────────┘
```

---

# 🚀 Long-Term Vision

The long-term goal is to create a browser-based chess intelligence platform that combines:

```text
Chess Engine
      +
Human Behavior Modeling
      +
Browser Extension
      +
Player Analytics
      +
Adaptive Learning
```

rather than simply exposing a chess engine's strongest move.

---

# ⚠️ Responsible Use

This project should primarily be used for:

* Chess analysis
* Learning
* Training
* Studying positions
* Reviewing games
* Personal experiments
* Offline chess applications
* Platforms and environments that explicitly permit assistance

Do not use automated analysis or move execution to gain an unfair advantage in competitive games where external assistance or automation is prohibited.

---

# 📜 License

Choose a license before publishing the project.

Possible options:

```text
MIT
Apache-2.0
GPL-3.0
```

If distributing Stockfish or Stockfish-derived components, ensure the distribution complies with the applicable Stockfish/GPL licensing requirements.

---

# 👨‍💻 Development Philosophy

The project follows these principles:

1. **Engine and human behavior must remain separate.**
2. **Every phase should produce a working feature.**
3. **Browser-specific logic should use adapters.**
4. **Chess logic should be independently testable.**
5. **The UI should not contain engine logic.**
6. **The engine should run independently of the UI.**
7. **Human behavior should be configurable.**
8. **Randomness should be controlled and testable.**
9. **Privacy should be local-first.**
10. **Online automation should only be implemented where explicitly permitted.**

---

# 🏁 Final Architecture

```text
                         CHESS HUMAN
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
             Browser                   Side Panel
                 │                         │
                 ▼                         ▼
         Website Adapter              React UI
                 │                         │
                 ▼                         │
            Board Reader                   │
                 │                         │
                 ▼                         │
                FEN ───────────────────────┘
                 │
                 ▼
          Engine Manager
                 │
                 ▼
          Stockfish Worker
                 │
                 ▼
             MultiPV
                 │
                 ▼
          Top 5 Candidates
                 │
                 ▼
        Human Player Model
                 │
        ┌────────┼────────┐
        │        │        │
       Elo      Style   Position
        │        │      Complexity
        └────────┼────────┘
                 │
                 ▼
        Human-like Selection
                 │
                 ▼
             Final UI
```

---

# ⭐ Status

```text
Project Status: 🟡 Planning

Current Phase:
Phase 01 — Project Foundation

Next Target:
Phase 02 — Chrome & Brave Extension Foundation
```

---

## Roadmap Summary

```text
01. Project Foundation
        ↓
02. Extension Foundation
        ↓
03. Side Panel UI
        ↓
04. Board Detection
        ↓
05. FEN / Chess Representation
        ↓
06. Stockfish WASM
        ↓
07. MultiPV / Top 5
        ↓
08. Human Player Model
        ↓
09. Elo + Styles
        ↓
10. Human Mistakes + Time
        ↓
11. Website Adapters + Testing
        ↓
12. Production Release
        ↓
    Future ML
        ↓
 Adaptive Player Model
```
