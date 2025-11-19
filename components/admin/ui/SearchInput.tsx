import React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || 'Search...'}
      className="border border-orange-300 rounded-lg px-3 py-2 text-sm w-full md:w-64 bg-white text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition-colors"
    />
  );
}


