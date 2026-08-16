import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ParticleCanvas from './components/ParticleCanvas';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import ProgressPage from './pages/ProgressPage';

function App() {
  const [language, setLanguage] = useState('English');

  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen bg-dark-900 text-gray-100 flex flex-col font-sans antialiased overflow-x-hidden selection:bg-primary-500 selection:text-white">
          <ParticleCanvas />
          <Navbar language={language} setLanguage={setLanguage} />

          <main className="flex-1 relative z-10">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/onboarding" element={<OnboardingPage language={language} />} />
              <Route path="/dashboard" element={<DashboardPage language={language} />} />
              <Route path="/chat" element={<ChatPage language={language} setLanguage={setLanguage} />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
