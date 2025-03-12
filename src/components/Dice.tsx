'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface DiceProps {
  onRollComplete: (value: number) => void;
}

const Dice: React.FC<DiceProps> = ({ onRollComplete }) => {
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    const result = Math.floor(Math.random() * 6) + 1;
    
    setTimeout(() => {
      setIsRolling(false);
      onRollComplete(result);
    }, 1000);
  };

  return (
    <motion.div
      onClick={handleRoll}
      animate={{
        rotate: isRolling ? [0, 360, 720, 1080] : 0,
        scale: isRolling ? [1, 1.2, 1] : 1
      }}
      transition={{
        duration: isRolling ? 1 : 0.3,
        ease: "easeInOut"
      }}
      className="cursor-pointer select-none text-6xl hover:scale-110 transition-transform"
    >
      🎲
    </motion.div>
  );
};

export default Dice; 