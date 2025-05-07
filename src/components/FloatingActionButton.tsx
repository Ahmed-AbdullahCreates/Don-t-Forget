import React from 'react';
import { Plus } from 'lucide-react';

interface FABProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FABProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg flex items-center justify-center transform transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 z-10"
      aria-label="Add new note"
    >
      <Plus className="h-6 w-6" />
    </button>
  );
};

export default FloatingActionButton;