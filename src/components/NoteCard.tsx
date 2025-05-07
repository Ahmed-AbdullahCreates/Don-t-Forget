import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Tag } from 'lucide-react';
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        damping: 20,
        stiffness: 300,
        delay: index * 0.1 
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    },
    hover: {
      y: -4,
      transition: { type: "spring", stiffness: 400 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      className="group p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
      layout
    >
      <div className="whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">
        {note.text}
      </div>
      
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {note.label && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleLabelClick(e, note.label)}
              className="flex items-center px-2 py-1 bg-teal-100 dark:bg-teal-900/50 rounded-full text-xs text-teal-800 dark:text-teal-200 hover:bg-teal-200 dark:hover:bg-teal-800 transition-colors"
            >
              <Tag className="h-3 w-3 mr-1" />
              {note.label}
            </motion.button>
          )}
        </div>
        
        <div className="flex items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
            {formatDate(note.created_at)}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200"
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