'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const ranges = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '1 year', value: '1y' },
];

export function TimeRangeSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get('range') || '7d';

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('range', value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => handleChange(range.value)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            currentRange === range.value
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
