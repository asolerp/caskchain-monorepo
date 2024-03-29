import React from "react";
import Spinner from "./Spinner";

type ButtonProps = {
  fit?: boolean;
  isForm?: boolean;
  active?: boolean;
  loading?: boolean;
  disabled?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  onClick?: () => void;
  children: string;
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  isForm = false,
  loading,
  children,
  labelStyle,
  fit = true,
  active = true,
  containerStyle,
  disabled = false,
}) => {
  const activeClass = active
    ? "bg-cask-chain"
    : "ring-1 ring-cask-chain text-cask-chain";
  const containerClass = containerStyle || "px-6 py-3 rounded-full";
  const labelClass = labelStyle || "font-poppins text-lg text-center";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";
  return (
    <button
      type={isForm ? "submit" : "button"}
      onClick={onClick}
      className={`${
        fit ? "w-fit" : "w-full"
      } cursor-pointer hover:bg-opacity-80 ${activeClass} ${containerClass} ${disabledClass}`}
    >
      {loading ? (
        <Spinner color="black" />
      ) : (
        <p className={`font-semibold ${labelClass}`}>{children}</p>
      )}
    </button>
  );
};

export default Button;
