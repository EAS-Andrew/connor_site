import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`bg-card border border-radar-grey-dark p-card shadow-lg shadow-black/40 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

