export default function QuickActionButton({ icon, label, onClick, disabled = false }) {
  return (
    <button
      className={`quick-action-btn ${disabled ? 'disabled' : ''}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="quick-action-icon">{icon}</span>
      <span className="quick-action-label">{label}</span>
    </button>
  );
}
