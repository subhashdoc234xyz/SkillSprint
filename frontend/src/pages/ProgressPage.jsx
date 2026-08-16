import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Zap, Award, Calendar, CheckCircle, ShieldCheck } from 'lucide-react';
import { fetchProgress } from '../services/api';
import GlassCard from '../components/GlassCard';

const ProgressPage = () => {
  const [progress, setProgress] = useState({
    total_xp: 450,
    level: 3,
    streak_days: 6,
    completed_skills: ['skill_1', 'node_1', 'node_2'],
    recent_badge: 'Level 3 Sprint Engineer ⚡'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProgress = async () => {
      setLoading(true);
      try {
        const data = await fetchProgress();
        if (data) {
          setProgress(data);
        }
      } catch (err) {
        console.error("Progress fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  const currentLevelXp = progress.total_xp % 300;
  const levelProgressPct = (currentLevelXp / 300) * 100;

  // Generate 28-day streak calendar days
  const days = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    completed: i < progress.streak_days || (i % 3 === 0 && i < 20)
  }));

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Header Banner */}
      <div className="pb-6 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-xs font-semibold mb-2">
          <Trophy className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Gamified Achievements</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">XP & Mastery Tracker</h1>
        <p className="text-gray-400 text-sm mt-1">
          Earn XP by completing SkillTree nodes, maintain streak momentum, and unlock engineering titles.
        </p>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid sm:grid-cols-3 gap-6">
        <GlassCard glow className="p-6 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-glow-cyan">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Total Earned XP</span>
            <div className="text-3xl font-extrabold text-white mt-0.5">{progress.total_xp} <span className="text-xs text-amber-400 font-medium">XP</span></div>
          </div>
        </GlassCard>

        <GlassCard glow className="p-6 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-glow-blue">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Learning Streak</span>
            <div className="text-3xl font-extrabold text-white mt-0.5">{progress.streak_days} <span className="text-xs text-rose-400 font-medium">Days</span></div>
          </div>
        </GlassCard>

        <GlassCard glow className="p-6 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-primary-500/20 text-primary-400 border border-primary-500/30 shadow-glow-blue">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Current Level</span>
            <div className="text-3xl font-extrabold text-white mt-0.5">Level {progress.level}</div>
          </div>
        </GlassCard>
      </div>

      {/* Level-Up Progress Bar Card */}
      <GlassCard className="p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Level {progress.level} Progression</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30">
                {progress.recent_badge}
              </span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">300 XP needed per level tier</p>
          </div>
          <span className="text-sm font-bold text-primary-400">{currentLevelXp} / 300 XP ({Math.round(levelProgressPct)}%)</span>
        </div>

        <div className="w-full bg-dark-900 rounded-full h-4 overflow-hidden border border-white/10 p-0.5">
          <motion.div
            className="bg-gradient-to-r from-primary-500 via-accent-cyan to-accent-blue h-full rounded-full shadow-glow-cyan"
            initial={{ width: '0%' }}
            animate={{ width: `${levelProgressPct}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </GlassCard>

      {/* Streak Calendar Grid */}
      <GlassCard className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent-cyan" />
            <span>28-Day Consistency Matrix</span>
          </h3>
          <span className="text-xs text-gray-400">{progress.streak_days} Active Day Streak</span>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {days.map((item) => (
            <div
              key={item.day}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                item.completed
                  ? 'bg-primary-500/20 border-primary-500/50 text-primary-300 shadow-glow-blue'
                  : 'bg-dark-900/60 border-white/5 text-gray-600'
              }`}
            >
              <span className="text-[10px] font-semibold text-gray-400">Day {item.day}</span>
              {item.completed ? (
                <CheckCircle className="w-4 h-4 text-accent-cyan" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-gray-700" />
              )}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default ProgressPage;
