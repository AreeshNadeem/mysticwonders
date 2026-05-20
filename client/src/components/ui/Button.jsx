/** Reusable Button component — primary or outline variant */
export default function Button({ children, variant = 'primary', onClick, style = {} }) {
  return (
    <div
      className={variant === 'primary' ? 'btn-primary' : 'btn-outline'}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      style={style}
    >
      {children}
    </div>
  );
}
