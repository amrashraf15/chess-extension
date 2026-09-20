interface HeaderProps {
  onReset: () => void;
}

export function Header({ onReset }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand-container">
        <div className="brand-icon">♟</div>

        <div>
          <h1 className="brand-title">CHESS HUMAN</h1>
          <p className="brand-subtitle">Local chess analysis</p>
        </div>
      </div>

      <button
        type="button"
        className="icon-button"
        onClick={onReset}
        aria-label="Reset settings"
        title="Reset settings"
      >
        ↻
      </button>
    </header>
  );
}