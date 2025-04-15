import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils'; // className 병합 함수 (shadcn이나 tailwind에서 자주 씀)

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn("border rounded p-2 w-full", className)}
      {...props}
    />
  );
}