'use client';

import { useState } from 'react';

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar recetas..."
        className="flex-1 px-4 py-2 border rounded-lg"
      />
      <button type="submit" className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
        Buscar
      </button>
    </form>
  );
}