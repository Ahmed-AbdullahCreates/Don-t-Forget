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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      <Header onAuthClick={() => setIsAuthModalOpen(true)} />
      
      <main className="flex-grow container max-w-5xl w-full mx-auto px-4 py-6">
        <SearchBar />
        <div className="mt-8">
          <NoteList />
        </div>
      </main>
      
      <FloatingActionButton onClick={openForm} />
      
      <AnimatePresence>
        {isFormOpen && <NoteForm onClose={() => setIsFormOpen(false)} />}
        {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
      </AnimatePresence>
      
      {/* <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Don't Forget &copy; {new Date().getFullYear()} - Your personal note-taking app</p>
      </footer> */}
      
      <Toaster 
        richColors 
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          className: "rounded-lg shadow-lg border border-gray-100 dark:border-gray-700",
        }}
      />
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