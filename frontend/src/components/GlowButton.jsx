import React from 'react';
import { motion } from 'framer-motion';

const GlowButton = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  icon: Icon
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 px-5 py-2.5 overflow-hidden group focus:outline-none";

  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-accent-cyan text-white shadow-glow-blue hover:shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-dark-700/80 border border-white/10 text-gray-200 hover:border-primary-500/50 hover:bg-dark-700 hover:text-white",
    outline: "border border-primary-500/40 text-primary-400 hover:bg-primary-500/10 hover:border-primary-400"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </span>
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  );
};

export default GlowButton;
