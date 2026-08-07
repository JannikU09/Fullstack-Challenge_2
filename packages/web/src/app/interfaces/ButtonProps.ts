export interface ButtonProps {
  children: React.ReactNode;
  variant: "primary" | "submit" | "danger";
  type?: "button" | "submit";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: true | false;
}
