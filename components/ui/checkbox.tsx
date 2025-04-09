import { InputHTMLAttributes } from 'react';

export function Checkbox(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="checkbox" className="w-4 h-4" {...props} />;
}