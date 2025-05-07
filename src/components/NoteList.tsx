import React, { useMemo } from 'react';
import { useNotes } from '../context/NoteContext';
import NoteCard from './NoteCard';
import { StickyNote } from 'lucide-react';

const NoteList: React.FC = () => {
  const { notes, searchTerm, activeLabel } = useNotes();

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch = searchTerm
        ? note.text.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      
      const matchesLabel = activeLabel
        ? note.label === activeLabel
        : true;
      
      return matchesSearch && matchesLabel;
    });
  }, [notes, searchTerm, activeLabel]);

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <StickyNote className="h-12 w-12 text-gray-400 mb-2" />
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No notes yet</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs mt-1">
          Add your first note by clicking the + button below
        </p>
      </div>
    );
  }

  if (filteredNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <StickyNote className="h-12 w-12 text-gray-400 mb-2" />
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No matching notes</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs mt-1">
          Try a different search term or clear your filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4 md:px-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 auto-rows-max">
      {filteredNotes.map((note, index) => (
        <NoteCard key={note.id} note={note} index={index} />
      ))}
    </div>
  );
};

export default NoteList;