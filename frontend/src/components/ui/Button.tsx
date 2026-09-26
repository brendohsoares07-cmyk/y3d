import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "danger";
};

export function Button({ variant = "primary", className = "", type = "button", ...rest }: Props) {
  return <button type={type} className={`btn btn-${variant} ${className}`} {...rest} />;
}
