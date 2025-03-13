'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Question } from '../types/game';
import { soundManager } from '../utils/soundEffects';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionModalProps {
  isOpen: boolean;
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  question,
  onAnswer
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimeWarning, setIsTimeWarning] = useState(false);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    
    const correct = answer === question.correctAnswer;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    setIsCorrect(correct);
    onAnswer(correct);
  };

  // Timer effect
  useEffect(() => {
    if (!isOpen || isAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 10 && !isTimeWarning) {
          setIsTimeWarning(true);
        }
        if (newTime <= 0) {
          handleAnswer('');
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isAnswered, isTimeWarning, handleAnswer]);

  if (!isOpen) return null;

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      'Opportunity Cost': '💰',
      'Trade-off': '⚖️',
      'Marginal Thinking': '🤔',
      'Incentives': '🎯',
      'Scarcity': '📊'
    };
    return emojis[category] || '❓';
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative bg-white/80 dark:bg-gray-800/80 p-8 rounded-2xl shadow-2xl max-w-2xl w-full m-4 backdrop-blur-lg border border-white/20"
        >
          {/* Timer Circle */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="relative w-16 h-16 rounded-full bg-white/90 dark:bg-gray-700/90 shadow-lg flex items-center justify-center border-4 border-blue-500/50">
              <motion.div
                animate={{
                  background: timeLeft <= 10 ? ['#ef4444', '#ffffff', '#ef4444'] : '#ffffff',
                }}
                transition={{ duration: 1, repeat: timeLeft <= 10 ? Infinity : 0 }}
                className={`text-xl font-bold ${
                  timeLeft <= 10 ? 'text-red-500' : 'text-blue-500'
                }`}
              >
                {timeLeft}
              </motion.div>
            </div>
          </div>

          <div className="text-center mb-8 mt-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="text-4xl mb-4 inline-block"
            >
              {getCategoryEmoji(question.category)}
            </motion.div>
            
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {question.text}
            </motion.h2>
            
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {question.category}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                {question.points} points
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => !isAnswered && handleAnswer(option)}
                disabled={isAnswered}
                className={`
                  group relative p-4 rounded-xl text-left transition-all duration-300 transform
                  ${isAnswered
                    ? option === question.correctAnswer
                      ? 'bg-green-100/80 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300'
                      : option === selectedAnswer
                      ? 'bg-red-100/80 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300'
                      : 'bg-gray-100/50 dark:bg-gray-700/30 opacity-50'
                    : 'hover:bg-white/90 dark:hover:bg-gray-700/90 hover:shadow-lg hover:-translate-y-1'
                  }
                  backdrop-blur-sm border-2
                  ${isAnswered
                    ? option === question.correctAnswer
                      ? 'border-green-500'
                      : option === selectedAnswer
                      ? 'border-red-500'
                      : 'border-transparent'
                    : 'border-white/20 hover:border-blue-500/50'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 font-medium">{option}</span>
                </div>
                
                {/* Hover Effect */}
                {!isAnswered && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={false}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`
                  p-6 rounded-xl mb-4 backdrop-blur-sm
                  ${isCorrect 
                    ? 'bg-green-100/80 dark:bg-green-900/30 border-2 border-green-500' 
                    : 'bg-red-100/80 dark:bg-red-900/30 border-2 border-red-500'
                  }
                `}
              >
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`
                    text-lg font-semibold mb-2 flex items-center gap-2
                    ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}
                  `}
                >
                  {isCorrect ? '✨ Excellent!' : '💡 Keep Learning!'} 
                  {isCorrect ? (
                    <span className="text-sm">+{question.points} points</span>
                  ) : (
                    <span className="text-sm">Correct answer: {question.correctAnswer}</span>
                  )}
                </motion.p>
                {question.explanation && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 dark:text-gray-400"
                  >
                    {question.explanation}
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuestionModal; 