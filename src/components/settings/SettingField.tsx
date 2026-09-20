import type { ReactNode } from "react";

interface SettingFieldProps {
  label: string;
  description?: string;
  children: ReactNode;
}

export function SettingField({
  label,
  description,
  children,
}: SettingFieldProps) {
  return (
    <div className="setting-field">
      <div className="setting-label-row">
        <label className="setting-label">{label}</label>

        {description && (
          <span className="setting-description">
            {description}
          </span>
        )}
      </div>

      {children}
    </div>
  );
}