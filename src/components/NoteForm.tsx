import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotes } from '../context/NoteContext';
import { X, Tag, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { NoteInput } from '../types/schema';

const NoteForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [text, setText] = useState('');
  const [label, setLabel] = useState('');
  const [showLabelInput, setShowLabelInput] = useState(false);
  const { addNote, allLabels } = useNotes();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const labelInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (showLabelInput && labelInputRef.current) {
      labelInputRef.current.focus();
    }
  }, [showLabelInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      try {
        const noteInput: NoteInput = {
          text: text.trim(),
          label: label.trim() || undefined,
        };
        await addNote(noteInput);
        toast.success('Note saved');
        setText('');
        setLabel('');
        onClose();
      } catch (error) {
        // Error is handled in NoteContext
      }
    }
  };

  const handleLabelSelect = (selectedLabel: string) => {
    setLabel(selectedLabel);
    setShowLabelInput(false);
    toast.success(`Label "${selectedLabel}" selected`);
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div 
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Don't Forget</h2>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <motion.textarea
            initial={{ height: "100px" }}
            animate={{ height: "auto" }}
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What do you need to remember?"
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none h-32 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            autoFocus
          />
          
          <AnimatePresence mode="wait">
            {showLabelInput ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", damping: 20 }}
                className="mt-3 relative"
              >
                <input
                  ref={labelInputRef}
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Add a label"
                  className="w-full p-2 pl-8 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <Tag className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowLabelInput(false)}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Check className="h-5 w-5" />
                </motion.button>
                
                {allLabels.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-2 flex flex-wrap gap-2"
                  >
                    {allLabels.map((existingLabel) => (
                      <motion.button
                        key={existingLabel}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => handleLabelSelect(existingLabel)}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
                      >
                        {existingLabel}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-3 flex justify-between"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setShowLabelInput(true)}
                  className="flex items-center text-sm text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 transition-colors"
                >
                  <Tag className="h-4 w-4 mr-1" />
                  {label ? label : 'Add label'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="mt-4 flex justify-end gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!text.trim()}
              className="px-4 py-2 bg-teal-600 text-white rounded text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default NoteForm;