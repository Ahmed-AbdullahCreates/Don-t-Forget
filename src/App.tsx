import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { NoteProvider } from './context/NoteContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import FloatingActionButton from './components/FloatingActionButton';
import AuthModal from './components/AuthModal';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  const openForm = () => {
    if (user) {
      setIsFormOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Header onAuthClick={() => setIsAuthModalOpen(true)} />
      
      <main className="flex-grow max-w-4xl w-full mx-auto">
        <SearchBar />
        <NoteList />
      </main>
      
      <FloatingActionButton onClick={openForm} />
      
      <AnimatePresence>
        {isFormOpen && <NoteForm onClose={() => setIsFormOpen(false)} />}
        {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
      </AnimatePresence>
      
      <Toaster richColors position="bottom-center" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NoteProvider>
          <AppContent />
        </NoteProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;