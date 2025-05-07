import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Tag, Calendar, Clock } from 'lucide-react';
import { Note } from '../types';
import { useNotes } from '../context/NoteContext';
import { toast } from 'sonner';

interface NoteCardProps {
  note: Note;
  index: number;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, index }) => {
  const { deleteNote, setActiveLabel } = useNotes();
  
  const formatDate = (date: string): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const handleDelete = async () => {
    try {
      await deleteNote(note.id);
      toast.success('Note deleted');
    } catch (error) {
      // Error is handled in NoteContext
    }
  };

  const handleLabelClick = (e: React.MouseEvent, label: string) => {
    e.stopPropagation();
    if (label) {
      setActiveLabel(label);
      toast.success(`Filtered by "${label}"`);
    }
  };

  // Generate a deterministic pastel background color based on the note's text
  const generatePastelColor = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Use the hash to determine a hue value (0-360)
    const hue = hash % 360;
    
    // Return a pastel HSL color
    return `hsl(${hue}, 85%, 93%)`;
  };

  // Get just the date part for the accent bar
  const noteDate = new Date(note.created_at);
  const day = noteDate.getDate();
  const month = noteDate.toLocaleString('default', { month: 'short' });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        damping: 20,
        stiffness: 300,
        delay: index * 0.05 // Slightly faster appearance
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    },
    hover: {
      y: -4,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 400 }
    }
  };

  // Determine if the note is short enough to apply a larger font size
  const isShortNote = note.text.length < 100;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      className="group relative p-4 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 overflow-hidden"
      layout
    >
      {/* Colored accent bar at the top */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
        style={{ backgroundColor: note.label ? generatePastelColor(note.label) : '#0d9488' }}
      />
      
      {/* Date indicator for visual interest */}
      <div className="absolute top-3 right-3 flex flex-col items-center justify-center rounded-full w-10 h-10 bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-600">
        <span className="text-teal-600 dark:text-teal-400 uppercase">{month}</span>
        <span>{day}</span>
      </div>
      
      <div className={`whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200 pr-12 ${isShortNote ? 'text-lg' : 'text-base'}`}>
        {note.text}
      </div>
      
      <div className="mt-4 pt-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {note.label && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleLabelClick(e, note.label)}
              className="flex items-center px-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-700 transition-colors"
              style={{ 
                backgroundColor: `${generatePastelColor(note.label)}20`, // 20% opacity version of the color
                borderColor: generatePastelColor(note.label)
              }}
            >
              <Tag className="h-3 w-3 mr-1" />
              {note.label}
            </motion.button>
          )}
        </div>
        
        <div className="flex items-center">
          <motion.span 
            initial={{ opacity: 0.6 }}
            whileHover={{ opacity: 1 }}
            className="text-xs text-gray-500 dark:text-gray-400 flex items-center"
          >
            <Clock className="h-3 w-3 mr-1" />
            {formatDate(note.created_at)}
          </motion.span>
          <motion.button
            whileHover={{ scale: 1.1, color: "#f43f5e" }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="ml-3 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200"
            aria-label="Delete note"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default NoteCard;