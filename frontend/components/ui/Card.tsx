import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden ${
        hoverable ? 'transition-all hover:shadow-md hover:border-[#A8B589]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
