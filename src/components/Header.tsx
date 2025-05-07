import React from 'react';
import { BrainCircuit, LogIn, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onAuthClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthClick }) => {
  const { user, signOut } = useAuth();

  const handleAuthClick = async () => {
    if (user) {
      await signOut();
    } else {
      onAuthClick();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center flex-shrink-0">
            <BrainCircuit className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            <h1 className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">Don't Forget</h1>
            <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-800 dark:text-teal-100 rounded-md">BETA</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleAuthClick}
              className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {user ? (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sign In</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;