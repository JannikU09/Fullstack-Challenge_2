import type { ButtonProps } from "../../app/interfaces/ButtonProps";

export const Button: React.FC<ButtonProps> = ({ children, variant, type, onClick, disabled }) => {
  return (
    <button className={`button ${variant}`} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
