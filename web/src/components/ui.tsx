import type { ComponentProps } from 'react';

export function Button(props: ComponentProps<'button'> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  const { variant = 'primary', className = '', ...rest } = props;

  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed';

  const styles = {
    primary: 'bg-black text-white hover:bg-black/90 cursor-pointer',
    ghost: 'bg-white text-black border hover:bg-gray-50 cursor-pointer',
    danger: 'bg-red-600 text-white hover:bg-red-700 cursor-pointer',
  }[variant];

  return <button className={`${base} ${styles} ${className}`} {...rest} />;
}

export function Input(props: ComponentProps<'input'>) {
  const { className = '', ...rest } = props;
  return (
    <input
      className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 ${className}`}
      {...rest}
    />
  );
}

export function Label(props: ComponentProps<'label'>) {
  const { className = '', ...rest } = props;
  return <label className={`text-sm font-medium ${className}`} {...rest} />;
}

export function HelperText({ children }: { children: string }) {
  return <p className="mt-1 text-xs text-gray-600">{children}</p>;
}

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border bg-white p-4 shadow-sm">{children}</div>;
}
