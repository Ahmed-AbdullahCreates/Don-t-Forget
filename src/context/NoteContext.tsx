import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { noteSchema, type NoteInput } from '../types/schema';
import type { Note } from '../types';
import { useAuth } from './AuthContext';
import { z } from 'zod';

type NoteContextType = {
  notes: Note[];
  loading: boolean;
  addNote: (input: NoteInput) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeLabel: string;
  setActiveLabel: (label: string) => void;
  allLabels: string[];
};

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLabel, setActiveLabel] = useState('');
  const { user } = useAuth();

  // Set up real-time subscription
  React.useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchNotes = useCallback(async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Validate the data shape with a schema that handles the timestamp
      const validatedNotes = z.array(noteSchema.extend({
        id: z.string().uuid(),
        user_id: z.string().uuid(),
        created_at: z.string().transform(str => new Date(str)),
      })).parse(data);

      setNotes(validatedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to fetch notes. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async (input: NoteInput) => {
    if (!user) {
      toast.error('Please sign in to add notes');
      return;
    }

    try {
      const validatedData = noteSchema.parse(input);
      
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          text: validatedData.text,
          label: validatedData.label || null,
        })
        .select()
        .single();

      if (error) throw error;
      
      // Transform the created_at field to a Date object
      const validatedNote = noteSchema.extend({
        id: z.string().uuid(),
        user_id: z.string().uuid(),
        created_at: z.string().transform(str => new Date(str)),
      }).parse(data);
      
      // Optimistically update the UI
      setNotes((prev) => [validatedNote, ...prev]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        console.error('Error adding note:', error);
        toast.error('Failed to add note. Please try again.');
      }
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    if (!user) {
      toast.error('Please sign in to delete notes');
      return;
    }

    try {
      // Optimistically update the UI
      setNotes((prev) => prev.filter((note) => note.id !== id));

      const { error } = await supabase
        .from('notes')
        .delete()
        .match({ id, user_id: user.id });

      if (error) {
        // Rollback on error
        fetchNotes();
        throw error;
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note. Please try again.');
      throw error;
    }
  };

  // Memoize filtered labels to prevent unnecessary recalculations
  const allLabels = React.useMemo(() => {
    const uniqueLabels = new Set(
      notes
        .map((note) => note.label)
        .filter((label): label is string => Boolean(label?.trim()))
    );
    return Array.from(uniqueLabels).sort();
  }, [notes]);

  const value = React.useMemo(() => ({
    notes,
    loading,
    addNote,
    deleteNote,
    searchTerm,
    setSearchTerm,
    activeLabel,
    setActiveLabel,
    allLabels,
  }), [notes, loading, allLabels, searchTerm, activeLabel]);

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};

export const useNotes = (): NoteContextType => {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};