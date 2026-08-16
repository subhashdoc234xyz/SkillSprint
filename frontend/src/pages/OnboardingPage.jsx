import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Star, BookOpen, Target, Cpu } from 'lucide-react';
import { submitIntake } from '../services/api';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';

const DEPARTMENTS = [
  "Computer Science Engineering",
  "Information Technology",
  "Electronics & Communication Engineering",
  "Electrical & Electronics Engineering",
  "Mechanical Engineering",
  "Artificial Intelligence & Data Science"
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "Final Year"];

const INITIAL_SKILLS = ["Problem Solving", "Data Structures", "Web Basics", "Git/Version Control", "System Fundamentals"];

const OnboardingPage = ({ language }) => {
  const [step, setStep] = useState(1);
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [yearOfStudy, setYearOfStudy] = useState("3rd Year");
  const [careerGoal, setCareerGoal] = useState("Full Stack Engineer");
  const [skillRatings, setSkillRatings] = useState(
    INITIAL_SKILLS.map((skill) => ({ skill, level: 3 }))
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRatingChange = (index, rating) => {
    const updated = [...skillRatings];
    updated[index].level = rating;
    setSkillRatings(updated);
  };

  const handleComplete = async () => {
    setLoading(true);
    const payload = {
      department,
      year_of_study: yearOfStudy,
      career_goal: careerGoal,
      skill_ratings: skillRatings,
      preferred_language: language,
    };

    try {
      const response = await submitIntake(payload);
      navigate('/dashboard', { state: { intakeResult: response } });
    } catch (err) {
      console.error("Intake submission error:", err);
      // Fallback navigate to dashboard
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 space-y-8">
      {/* Progress Bar Header */}
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Step {step} of 3 • Profile Assessment</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Configure Your Career Sprint</h1>
        <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden border border-white/5">
          <motion.div
            className="bg-gradient-to-r from-primary-500 to-accent-cyan h-full shadow-glow-cyan"
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Animated Step Container */}
      <GlassCard glow className="p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <BookOpen className="w-6 h-6 text-accent-cyan" />
                <div>
                  <h2 className="text-xl font-bold text-white">Academic Profile</h2>
                  <p className="text-xs text-gray-400">Tell us about your engineering branch and current year.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">Department / Engineering Branch</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full py-3 px-4 rounded-xl bg-dark-900 border border-white/10 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">Year of Study</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {YEARS.map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setYearOfStudy(yr)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all ${
                          yearOfStudy === yr
                            ? 'bg-primary-500/20 border-primary-500 text-primary-300 shadow-glow-blue'
                            : 'bg-dark-900/60 border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <GlowButton onClick={() => setStep(2)} icon={ArrowRight}>
                  Next: Career Goals
                </GlowButton>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <Target className="w-6 h-6 text-accent-cyan" />
                <div>
                  <h2 className="text-xl font-bold text-white">Target Career Path</h2>
                  <p className="text-xs text-gray-400">What job title or domain are you aiming for?</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">Target Job Role / Career Goal</label>
                <input
                  type="text"
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="e.g. Full Stack Engineer, Cloud Architect, AI Data Engineer"
                  className="w-full py-3 px-4 rounded-xl bg-dark-900 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <GlowButton variant="secondary" onClick={() => setStep(1)} icon={ArrowLeft}>
                  Back
                </GlowButton>
                <GlowButton onClick={() => setStep(3)} icon={ArrowRight}>
                  Next: Skill Self-Rating
                </GlowButton>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <Cpu className="w-6 h-6 text-accent-cyan" />
                <div>
                  <h2 className="text-xl font-bold text-white">Self Skill Rating</h2>
                  <p className="text-xs text-gray-400">Rate your current confidence level across core competencies (1 to 5).</p>
                </div>
              </div>

              <div className="space-y-4">
                {skillRatings.map((item, idx) => (
                  <div key={item.skill} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-dark-900/60 rounded-xl border border-white/5 gap-2">
                    <span className="text-sm font-medium text-gray-200">{item.skill}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(idx, star)}
                          className={`p-1.5 transition-transform hover:scale-125 ${
                            star <= item.level ? 'text-amber-400' : 'text-gray-600'
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4">
                <GlowButton variant="secondary" onClick={() => setStep(2)} icon={ArrowLeft}>
                  Back
                </GlowButton>
                <GlowButton
                  onClick={handleComplete}
                  disabled={loading}
                  icon={CheckCircle2}
                  className="bg-gradient-to-r from-accent-cyan to-accent-blue"
                >
                  {loading ? 'Generating SkillTree...' : 'Generate AI Roadmap'}
                </GlowButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
};

export default OnboardingPage;
