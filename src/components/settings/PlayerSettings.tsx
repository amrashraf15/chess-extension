import type {
  PlayerSettings as PlayerSettingsType,
  PlayerStyle,
} from "../../types/chess";

import { SettingField } from "./SettingField";
import { InaccuracySlider } from "./InaccuracySlider";

interface PlayerSettingsProps {
  settings: PlayerSettingsType;
  onChange: (settings: PlayerSettingsType) => void;
}

const ELO_OPTIONS = [
  800,
  1000,
  1200,
  1400,
  1600,
  1800,
  2000,
  2200,
];

const STYLE_OPTIONS: Array<{
  label: string;
  value: PlayerStyle;
}> = [
  { label: "Balanced", value: "balanced" },
  { label: "Aggressive", value: "aggressive" },
  { label: "Positional", value: "positional" },
  { label: "Solid", value: "solid" },
  { label: "Creative", value: "creative" },
];

export function PlayerSettings({
  settings,
  onChange,
}: PlayerSettingsProps) {
  return (
    <div className="settings-stack">
      <SettingField
        label="Player Elo"
        description="Simulated playing strength"
      >
        <select
          className="setting-select"
          value={settings.elo}
          onChange={(event) => {
            onChange({
              ...settings,
              elo: Number(event.target.value),
            });
          }}
        >
          {ELO_OPTIONS.map((elo) => (
            <option key={elo} value={elo}>
              {elo}
            </option>
          ))}
        </select>
      </SettingField>

      <SettingField
        label="Playing Style"
        description="Move preference"
      >
        <select
          className="setting-select"
          value={settings.style}
          onChange={(event) => {
            onChange({
              ...settings,
              style: event.target.value as PlayerStyle,
            });
          }}
        >
          {STYLE_OPTIONS.map((style) => (
            <option key={style.value} value={style.value}>
              {style.label}
            </option>
          ))}
        </select>
      </SettingField>

      <InaccuracySlider
        value={settings.inaccuracy}
        onChange={(inaccuracy) => {
          onChange({
            ...settings,
            inaccuracy,
          });
        }}
      />
    </div>
  );
}