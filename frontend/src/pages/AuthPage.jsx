import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Sparkles, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginWithEmail, signupWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signupWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await loginWithGoogle();
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google.');
    }
  };

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center">
      {/* Left branding panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 hidden md:block"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
          <span>SkillSprint Firebase Auth</span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight">
          Unlock Your AI-Powered Engineering Roadmap
        </h1>

        <p className="text-gray-300 text-sm leading-relaxed">
          Sign in to access your bilingual mentor, interactive skill tree timeline, XP tracker, and customized career gap analytics.
        </p>

        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <div className="p-2 rounded-lg bg-accent-cyan/10 text-accent-cyan">
              <Shield className="w-4 h-4" />
            </div>
            <span>Firebase Security Rules enforced per user UID</span>
          </div>
        </div>
      </motion.div>

      {/* Right Auth Card */}
      <GlassCard glow className="p-8">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isSignUp ? 'Create your Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-400 text-xs">
            {isSignUp ? 'Start your engineering career sprint' : 'Log in to continue your learning journey'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@skillsprint.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900/80 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900/80 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>

          <GlowButton
            type="submit"
            variant="primary"
            disabled={loading}
            icon={LogIn}
            className="w-full py-3 mt-2"
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </GlowButton>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-xs text-gray-500 font-medium">OR</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-dark-700/80 hover:bg-dark-700 border border-white/10 text-sm font-medium text-gray-200 hover:text-white transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z" />
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
            <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z" />
            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="mt-6 text-center text-xs text-gray-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary-400 font-semibold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </GlassCard>
    </div>
  );
};

export default AuthPage;
