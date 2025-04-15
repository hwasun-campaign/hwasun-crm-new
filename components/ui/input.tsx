import { InputHTMLAttributes } from 'react';

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`border rounded p-2 w-full ${className || ""}`}
      {...props}
    />
  );
}