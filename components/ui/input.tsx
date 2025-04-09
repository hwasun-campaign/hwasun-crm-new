import { InputHTMLAttributes } from 'react';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="border rounded p-2 w-full" {...props} />;
}