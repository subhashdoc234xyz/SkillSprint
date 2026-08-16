import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cpu, Compass, MessageSquareCode, Trophy, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageToggle from './LanguageToggle';

const Navbar = ({ language, setLanguage }) => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const navLinks = [
    { path: '/dashboard', label: 'SkillTree', icon: Compass },
    { path: '/chat', label: 'AI Mentor', icon: MessageSquareCode },
    { path: '/progress', label: 'XP Tracker', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark-900/70 backdrop-blur-xl border-b border-white/10 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-cyan shadow-glow-cyan">
            <Cpu className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-primary-400">
            SkillSprint <span className="text-accent-cyan text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/30">AI</span>
          </span>
        </Link>

        {currentUser && (
          <nav className="hidden md:flex items-center gap-1 bg-dark-800/60 p-1.5 rounded-2xl border border-white/10">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/40 shadow-glow-blue'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-4">
          <LanguageToggle language={language} setLanguage={setLanguage} />

          {currentUser ? (
            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
              <Link to="/onboarding" className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-300 hover:text-primary-400 transition-colors">
                <User className="w-4 h-4 text-accent-cyan" />
                <span>Profile</span>
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-1.5 rounded-xl bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 text-sm font-medium border border-primary-500/40 transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
