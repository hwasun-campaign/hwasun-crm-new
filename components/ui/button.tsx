import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      {children}
    </button>
  );
};