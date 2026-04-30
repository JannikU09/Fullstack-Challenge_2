interface ButtonProps {
  children: React.ReactNode;
  variant: "primary" | "danger";
  type?: "button" | "submit";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: true | false;
}

export const Button: React.FC<ButtonProps> = ({ children, variant, type, onClick, disabled }) => {
  return (
    <button className={`button ${variant}`} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
