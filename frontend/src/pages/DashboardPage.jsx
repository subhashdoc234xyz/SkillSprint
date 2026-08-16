import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  CheckCircle2,
  Lock,
  PlayCircle,
  Sparkles,
  BarChart3,
  Clock,
  Zap,
  Target,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { fetchRoadmap, completeSkillNode } from '../services/api';
import GlassCard from '../components/GlassCard';
import GlowButton from '../components/GlowButton';

const DashboardPage = ({ language }) => {
  const location = useLocation();
  const intakeResult = location.state?.intakeResult;

  const [nodes, setNodes] = useState([]);
  const [jobGap, setJobGap] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        if (intakeResult && intakeResult.roadmap) {
          setNodes(intakeResult.roadmap);
        } else {
          const data = await fetchRoadmap('Full Stack Engineer', 'Computer Science Engineering', language);
          setNodes(data.nodes || []);
          setJobGap(data.job_gap_analysis);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [intakeResult, language]);

  const handleMarkComplete = async (nodeId) => {
    try {
      await completeSkillNode(nodeId);
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId ? { ...n, status: 'completed' } : n
        )
      );
      if (selectedNode && selectedNode.id === nodeId) {
        setSelectedNode({ ...selectedNode, status: 'completed' });
      }
    } catch (err) {
      console.error("Failed to complete skill:", err);
    }
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-accent-cyan" />
            <span>Interactive SkillTree Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Engineering Skill Path</h1>
          <p className="text-gray-400 text-sm mt-1">
            Track stage progression, unlock skill badges, and close industry skill gaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/chat">
            <GlowButton variant="primary" icon={Sparkles}>
              Consult AI Mentor
            </GlowButton>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400 animate-pulse">
          Loading AI SkillTree Nodes...
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* SkillTree Timeline (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent-cyan" />
                <span>Skill Progression Timeline</span>
              </h2>

              <div className="relative border-l-2 border-primary-500/30 ml-4 pl-6 space-y-8">
                {nodes.map((node, idx) => {
                  const isCompleted = node.status === 'completed';
                  const isInProgress = node.status === 'in_progress';
                  const isLocked = node.status === 'locked';

                  return (
                    <div key={node.id} className="relative group">
                      {/* Node Icon Circle */}
                      <div
                        className={`absolute -left-[35px] top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-accent-cyan border-accent-cyan text-dark-900 shadow-glow-cyan'
                            : isInProgress
                            ? 'bg-primary-500 border-primary-400 text-white shadow-glow-blue animate-pulse'
                            : 'bg-dark-900 border-gray-600 text-gray-500'
                        }`}
                      >
                        {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                        {isInProgress && <PlayCircle className="w-4 h-4" />}
                        {isLocked && <Lock className="w-3.5 h-3.5" />}
                      </div>

                      {/* Node Content Card */}
                      <div
                        onClick={() => setSelectedNode(node)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                          selectedNode?.id === node.id
                            ? 'bg-primary-500/20 border-primary-500 shadow-glow-blue'
                            : 'bg-dark-800/60 border-white/10 hover:border-primary-500/40 hover:bg-dark-800/90'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-primary-300">
                            {node.category || 'Core Skill'}
                          </span>
                          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                            <Zap className="w-3 h-3" /> +{node.xp_reward || 150} XP
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white mt-2">{node.title}</h3>
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">{node.description}</p>

                        <div className="flex items-center justify-between text-xs text-gray-400 mt-4 pt-3 border-t border-white/5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-gray-500" /> ~{node.estimated_hours || 12} hrs
                          </span>
                          <span className="capitalize text-primary-400 font-medium">
                            {node.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar: Job Gap Analysis & Selected Node Details */}
          <div className="space-y-6">
            {/* Selected Node Inspector */}
            {selectedNode ? (
              <GlassCard glow className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-500/20 text-primary-300">
                    Node Details
                  </span>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>

                <h3 className="text-xl font-bold text-white">{selectedNode.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{selectedNode.description}</p>

                <div className="p-3 bg-dark-900/60 rounded-xl border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white font-medium">{selectedNode.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estimated Duration:</span>
                    <span className="text-white font-medium">{selectedNode.estimated_hours} Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">XP Completion Reward:</span>
                    <span className="text-amber-400 font-bold">+{selectedNode.xp_reward} XP</span>
                  </div>
                </div>

                {selectedNode.status !== 'completed' && (
                  <GlowButton
                    onClick={() => handleMarkComplete(selectedNode.id)}
                    variant="primary"
                    icon={CheckCircle2}
                    className="w-full py-2.5"
                  >
                    Mark as Completed
                  </GlowButton>
                )}
              </GlassCard>
            ) : (
              <GlassCard className="p-6 text-center text-gray-400 text-xs">
                Click any SkillTree node to inspect details or update completion status.
              </GlassCard>
            )}

            {/* Job Readiness Gap Analysis */}
            {jobGap && (
              <GlassCard glow className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-accent-cyan">
                  <Target className="w-5 h-5" />
                  <h3 className="text-lg font-bold text-white">Job Readiness Gap</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Match for {jobGap.target_role}:</span>
                    <span className="text-accent-cyan font-bold">{jobGap.match_percentage}%</span>
                  </div>
                  <div className="w-full bg-dark-900 rounded-full h-2 overflow-hidden border border-white/10">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-accent-cyan h-full shadow-glow-cyan"
                      style={{ width: `${jobGap.match_percentage}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Missing Skills to Master:
                  </h4>
                  <ul className="space-y-1 pl-4 list-disc text-xs text-gray-300">
                    {jobGap.missing_skills?.map((sk, i) => (
                      <li key={i}>{sk}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <Link to="/chat" className="text-xs font-medium text-primary-400 hover:underline flex items-center gap-1">
                    <span>Ask AI Mentor how to close these gaps</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
