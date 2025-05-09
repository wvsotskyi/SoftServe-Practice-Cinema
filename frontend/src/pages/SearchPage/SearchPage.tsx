import { useState, useCallback, useEffect } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchFilters from '../../components/SearchFilters/SearchFilters';

export function SearchPage() {

  
  return (
    <div className="min-h-screen p-22">
      <div className="max-w-3xl mx-auto mb-6">
        <SearchBar/>
      </div>

      <div className="w-full mb-8">
        <SearchFilters/>
      </div>

    </div>
  );
}