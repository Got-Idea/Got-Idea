import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FishCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const vx = e.clientX - lastX;
      const vy = e.clientY - lastY;
      
      setPosition({ x: e.clientX, y: e.clientY });
      setVelocity({ x: vx, y: vy });
      
      lastX = e.clientX;
      lastY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const rotation = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI);

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      }}
    >
      <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
        {/* Fish body */}
        <ellipse cx="16" cy="12" rx="14" ry="8" fill="#FF6B6B" opacity="0.9"/>
        
        {/* Fish tail */}
        <path d="M 2 12 L -6 6 L -4 12 L -6 18 Z" fill="#FF6B6B" opacity="0.8"/>
        
        {/* Fish eye */}
        <circle cx="24" cy="10" r="2" fill="white"/>
        <circle cx="25" cy="10" r="1" fill="black"/>
        
        {/* Fish fins */}
        <path d="M 12 18 Q 10 22 8 20" stroke="#FF6B6B" strokeWidth="2" fill="none" opacity="0.7"/>
        <path d="M 12 6 Q 10 2 8 4" stroke="#FF6B6B" strokeWidth="2" fill="none" opacity="0.7"/>
        
        {/* Scales pattern */}
        <circle cx="18" cy="10" r="1.5" fill="#FFB6B6" opacity="0.5"/>
        <circle cx="14" cy="12" r="1.5" fill="#FFB6B6" opacity="0.5"/>
        <circle cx="10" cy="10" r="1.5" fill="#FFB6B6" opacity="0.5"/>
      </svg>
    </motion.div>
  );
};

export default FishCursor;
