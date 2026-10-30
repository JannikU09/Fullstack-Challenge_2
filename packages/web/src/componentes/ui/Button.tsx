import type { ButtonProps } from "../../app/interfaces/ButtonProps";

export const Button: React.FC<ButtonProps> = ({ children, variant, type, onClick, disabled, ariaLabel }) => {
  return (
    <button
      className={`button ${variant}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
