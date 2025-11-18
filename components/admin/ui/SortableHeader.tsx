import React from 'react';

type SortDirection = 'asc' | 'desc' | null;

interface SortState<K extends string> {
  key: K | null;
  direction: SortDirection;
}

interface SortableHeaderProps<K extends string> {
  label: string;
  columnKey: K;
  sort: SortState<K>;
  onChange: (next: SortState<K>) => void;
  className?: string;
}

export function SortableHeader<K extends string>({ label, columnKey, sort, onChange, className }: SortableHeaderProps<K>) {
  const isActive = sort.key === columnKey && sort.direction !== null;
  const indicator = !isActive ? '' : sort.direction === 'asc' ? '↑' : '↓';

  const handleClick = () => {
    // cycle: null -> asc -> desc -> null
    if (sort.key !== columnKey || sort.direction === null) {
      onChange({ key: columnKey, direction: 'asc' });
    } else if (sort.direction === 'asc') {
      onChange({ key: columnKey, direction: 'desc' });
    } else {
      onChange({ key: null as any, direction: null });
    }
  };

  return (
    <th
      onClick={handleClick}
      className={(className || '') + ' select-none cursor-pointer hover:bg-orange-100 dark:hover:bg-stone-700 transition-colors'}
      title="Click to sort"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className="text-orange-500 dark:text-orange-400 text-xs font-medium">{indicator}</span>
      </span>
    </th>
  );
}


