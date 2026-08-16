import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  MessageSquareCode,
  Trophy,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Languages
} from 'lucide-react';
import GlowButton from '../components/GlowButton';
import GlassCard from '../components/GlassCard';

const LandingPage = () => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-8 pt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-sm font-medium shadow-glow-blue"
        >
          <Sparkles className="w-4 h-4 text-accent-cyan animate-pulse" />
          <span>Next-Gen Engineering Career Copilot</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight"
        >
          Fast-Track Your Engineering Career Sprint with{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-accent-cyan to-accent-blue">
            Bilingual AI Guidance
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Master industry-ready technical skills with personalized SkillTree roadmaps, real-time job gap analysis, and interactive 24/7 AI mentorship in English & தமிழ்.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-4 pt-4"
        >
          <Link to="/onboarding">
            <GlowButton variant="primary" icon={Zap} className="text-base px-8 py-3.5">
              Start Your Sprint
            </GlowButton>
          </Link>
          <Link to="/chat">
            <GlowButton variant="secondary" icon={MessageSquareCode} className="text-base px-8 py-3.5">
              Chat with AI Mentor
            </GlowButton>
          </Link>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <GlassCard className="space-y-4">
          <div className="p-3 w-fit rounded-xl bg-primary-500/10 text-primary-400 border border-primary-500/20">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Dynamic SkillTree</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Personalized learning nodes generated for your department and target engineering roles with interactive progress tracking.
          </p>
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="p-3 w-fit rounded-xl bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
            <Languages className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Bilingual AI Mentor</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Ask technical concepts, interview strategies, and project questions seamlessly in English or தமிழ்.
          </p>
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="p-3 w-fit rounded-xl bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Gamified XP & Badges</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Earn XP, build continuous learning streak calendars, unlock skill badges, and stay motivated through level progressions.
          </p>
        </GlassCard>
      </section>

      {/* Bottom Callout */}
      <GlassCard glow className="p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Ready to Bridge the Gap Between Academics & Industry?
          </h2>
          <p className="text-gray-300 text-sm max-w-xl">
            Join engineering students mastering modern tech stacks with LLaMA-powered multi-agent AI mentoring.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-400 pt-2">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent-cyan" /> Free Tier Available</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent-cyan" /> Multi-key Groq model rotation</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent-cyan" /> Firebase Auth</span>
          </div>
        </div>
        <Link to="/auth">
          <GlowButton variant="primary" icon={ArrowRight} className="whitespace-nowrap px-8 py-3.5">
            Get Started Now
          </GlowButton>
        </Link>
      </GlassCard>
    </div>
  );
};

export default LandingPage;
