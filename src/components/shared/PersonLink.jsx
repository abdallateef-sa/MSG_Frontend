import { useNavigate } from 'react-router-dom';

/**
 * Renders a person's name as an inline link/button that opens their details.
 * Falls back to plain text when there is no target.
 */
export default function PersonLink({ to, children }) {
  const navigate = useNavigate();

  if (!to) return <span>{children}</span>;

  return (
    <button
      type="button"
      className="person-link"
      onClick={(event) => {
        event.stopPropagation();
        navigate(to);
      }}
    >
      {children}
    </button>
  );
}
