import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hover = true, glow = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        relative rounded-2xl border border-white/10 p-6
        bg-dark-800/60 backdrop-blur-xl shadow-glass overflow-hidden
        ${glow ? 'shadow-glow-cyan border-accent-cyan/30' : ''}
        ${hover ? 'hover:border-primary-500/40 hover:shadow-glow-blue transition-all duration-300' : ''}
        ${className}
      `}
    >
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;
