'use client';

import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { motion } from 'framer-motion';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  winnerName: string;
  score: number;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  winnerName,
  score
}) => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Confetti */}
      <ReactConfetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={true}
        numberOfPieces={200}
        gravity={0.3}
        colors={['#FFD700', '#FFA500', '#FF69B4', '#87CEEB', '#98FB98']}
        style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-white/90 dark:bg-gray-800/90 p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 
                    backdrop-blur-sm border border-yellow-500/30 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full opacity-20 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-400 rounded-full opacity-20 blur-2xl" />

          {/* Content */}
          <div className="relative z-10 text-center space-y-6">
            {/* Trophy Icon */}
            <div className="text-6xl md:text-7xl animate-bounce">
              🏆
            </div>

            {/* Winner Message */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-700 
                           bg-clip-text text-transparent">
                Congratulations, {winnerName}!
              </h2>
              
              <div className="space-y-2">
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
                  You are a true genius! 🧠
                </p>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                  You've reached the finish line with {score} points!
                </p>
              </div>

              {/* Achievement Messages */}
              <div className="space-y-2 mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                  Your knowledge is truly remarkable! 🌟
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You've proven yourself as a master of economics! 📚
                </p>
              </div>
            </div>

            {/* Play Again Button */}
            <button
              onClick={onClose}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 
                       text-white rounded-xl font-semibold text-base tracking-wide
                       hover:from-yellow-500 hover:to-yellow-700 
                       transform hover:scale-105 transition-all duration-300
                       shadow-lg hover:shadow-xl active:scale-95"
            >
              Play Again 🎮
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CelebrationModal; 