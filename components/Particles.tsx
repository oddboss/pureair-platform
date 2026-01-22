import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DashboardTheme } from '../types';

interface ParticlesProps {
  theme: DashboardTheme;
}

const Particles: React.FC<ParticlesProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const particles = useMemo(() => 
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 30 + 20,
      delay: Math.random() * 10,
    })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.06]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}%`, y: `${p.y}%`, opacity: 0 }}
          animate={{
            y: [`${p.y}%`, `${(p.y + 15) % 100}%`],
            x: [`${p.x}%`, `${(p.x + (Math.random() - 0.5) * 5) % 100}%`],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
          className={`absolute rounded-full blur-[2px] ${isDark ? 'bg-white' : 'bg-black'}`}
          style={{ width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
};

export default Particles;