export default function BrandLogo({ compact = false }) {
  return (
    <span className={`brand-logo ${compact ? 'compact' : ''}`} aria-label="MSG Horizons">
      <strong>MSG</strong>
      <small>HORIZONS</small>
    </span>
  );
}
