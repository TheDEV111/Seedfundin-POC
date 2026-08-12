import React from 'react';

export interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

export interface ToggleProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
}

export function Toggle<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: ToggleProps<T>) {
  return (
    <div className={`inline-flex p-1 bg-[#F7F7F2] border border-[#CBD5E1] rounded-xl ${className}`}>
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B7A3A] ${
              isActive
                ? 'bg-[#6B7A3A] text-white shadow-sm'
                : 'text-[#2B2B26] hover:bg-white/60'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
