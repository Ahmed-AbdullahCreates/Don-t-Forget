import React from 'react';
import { Search, X, Tag, Filter } from 'lucide-react';
import { useNotes } from '../context/NoteContext';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar: React.FC = () => {
  const { searchTerm, setSearchTerm, activeLabel, setActiveLabel, allLabels } = useNotes();

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleClearLabel = () => {
    setActiveLabel('');
  };

  // Generate a deterministic pastel color based on the label text
  const generateLabelColor = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = hash % 360;
    return `hsl(${hue}, 85%, ${activeLabel === text ? '60%' : '93%'})`;
  };

  return (
    <div className="sticky top-16 z-10 glass-effect px-4 py-4 md:px-6 rounded-xl mx-4 mb-4 backdrop-blur-md">
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your notes..."
            className="block w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 dark:text-white shadow-sm transition-all duration-300 focus:shadow-md"
          />
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {allLabels.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 flex flex-wrap gap-2"
        >
          <div className="flex items-center mr-2">
            <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Filters:</span>
          </div>
          
          {allLabels.map((label) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveLabel(label === activeLabel ? '' : label)}
              style={{ 
                backgroundColor: generateLabelColor(label),
                color: activeLabel === label ? 'white' : 'rgba(55, 65, 81)'
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 shadow-sm ${
                label === activeLabel
                  ? 'shadow-md dark:text-white'
                  : 'dark:text-gray-200 hover:shadow'
              }`}
            >
              <Tag className="h-3 w-3" />
              {label}
            </motion.button>
          ))}
          
          {activeLabel && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              onClick={handleClearLabel}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/30 shadow-sm transition-colors"
            >
              <X className="h-3 w-3 inline mr-1" />
              Clear filter
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;