import React from 'react';
import { Search, X } from 'lucide-react';
import { useNotes } from '../context/NoteContext';

const SearchBar: React.FC = () => {
  const { searchTerm, setSearchTerm, activeLabel, setActiveLabel, allLabels } = useNotes();

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleClearLabel = () => {
    setActiveLabel('');
  };

  return (
    <div className="sticky top-[3.5rem] z-10 bg-gray-100 dark:bg-gray-900 px-4 py-3 md:px-0 shadow-sm">
      <div className="relative max-w-2xl mx-auto">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search notes..."
          className="w-full p-3 pl-10 pr-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 dark:text-white shadow-sm"
        />
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {allLabels.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 max-w-2xl mx-auto">
          {allLabels.map((label) => (
            <button
              key={label}
              onClick={() => setActiveLabel(label === activeLabel ? '' : label)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                label === activeLabel
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/30 shadow-sm'
              }`}
            >
              {label}
            </button>
          ))}
          {activeLabel && (
            <button
              onClick={handleClearLabel}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 shadow-sm transition-colors"
            >
              Clear filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;