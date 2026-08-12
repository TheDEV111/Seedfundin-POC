import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B7A3A] focus-visible:ring-offset-2";
  
  const variantStyles = {
    primary: "bg-[#6B7A3A] text-white hover:bg-[#4A5A2A] active:bg-[#4A5A2A] shadow-sm",
    secondary: "bg-[#A8B589] text-[#2B2B26] hover:bg-[#6B7A3A] hover:text-white",
    outline: "border border-[#6B7A3A] text-[#6B7A3A] bg-transparent hover:bg-[#F7F7F2]",
    ghost: "text-[#2B2B26] bg-transparent hover:bg-[#F7F7F2]",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs font-semibold",
    md: "px-4 py-2 text-sm font-semibold",
    lg: "px-6 py-3 text-base font-semibold",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
