import type {
  EngineLimitType,
  EngineSettings as EngineSettingsType,
} from "../../types/chess";

import { SettingField } from "./SettingField";

interface EngineSettingsProps {
  settings: EngineSettingsType;
  onChange: (settings: EngineSettingsType) => void;
}

const DEPTH_OPTIONS = [
  { label: "Very Fast — Depth 8", value: 8 },
  { label: "Fast — Depth 12", value: 12 },
  { label: "Balanced — Depth 16", value: 16 },
  { label: "Deep — Depth 20", value: 20 },
  { label: "Very Deep — Depth 24", value: 24 },
];

const MULTI_PV_OPTIONS = [1, 3, 5];

const TIME_OPTIONS = [
  { label: "100 ms", value: 100 },
  { label: "250 ms", value: 250 },
  { label: "500 ms", value: 500 },
  { label: "1 second", value: 1000 },
  { label: "2 seconds", value: 2000 },
];

export function EngineSettings({
  settings,
  onChange,
}: EngineSettingsProps) {
  function updateSetting(
    partial: Partial<EngineSettingsType>,
  ) {
    onChange({
      ...settings,
      ...partial,
    });
  }

  return (
    <div className="settings-stack">
      <SettingField
        label="Engine Depth"
        description="Search depth"
      >
        <select
          className="setting-select"
          value={settings.depth}
          onChange={(event) => {
            updateSetting({
              depth: Number(event.target.value),
            });
          }}
        >
          {DEPTH_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </SettingField>

      <SettingField
        label="Candidate Moves"
        description="MultiPV count"
      >
        <select
          className="setting-select"
          value={settings.multiPv}
          onChange={(event) => {
            updateSetting({
              multiPv: Number(event.target.value),
            });
          }}
        >
          {MULTI_PV_OPTIONS.map((value) => (
            <option key={value} value={value}>
              Top {value}
            </option>
          ))}
        </select>
      </SettingField>

      <SettingField
        label="Analysis Limit"
        description="Primary search limit"
      >
        <select
          className="setting-select"
          value={settings.limitType}
          onChange={(event) => {
            updateSetting({
              limitType: event.target.value as EngineLimitType,
            });
          }}
        >
          <option value="depth">Depth</option>
          <option value="time">Time</option>
        </select>
      </SettingField>

      {settings.limitType === "time" && (
        <SettingField
          label="Time Limit"
          description="Maximum analysis time"
        >
          <select
            className="setting-select"
            value={settings.timeLimitMs}
            onChange={(event) => {
              updateSetting({
                timeLimitMs: Number(event.target.value),
              });
            }}
          >
            {TIME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </SettingField>
      )}
    </div>
  );
}