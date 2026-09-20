import { SettingField } from "./SettingField";

interface InaccuracySliderProps {
  value: number;
  onChange: (value: number) => void;
}

function getInaccuracyLabel(value: number): string {
  if (value <= 20) return "Low";
  if (value <= 50) return "Medium";
  return "High";
}

export function InaccuracySlider({
  value,
  onChange,
}: InaccuracySliderProps) {
  return (
    <SettingField
      label="Inaccuracy"
      description={`${getInaccuracyLabel(value)} · ${value}%`}
    >
      <div className="slider-container">
        <input
          className="setting-slider"
          type="range"
          min={0}
          max={100}
          step={5}
          value={value}
          onChange={(event) => {
            onChange(Number(event.target.value));
          }}
          aria-label="Inaccuracy level"
        />

        <div className="slider-labels">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
    </SettingField>
  );
}