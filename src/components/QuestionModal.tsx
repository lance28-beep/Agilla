'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Question } from '../types/game';
import { motion, AnimatePresence } from 'framer-motion';
import ReactConfetti from 'react-confetti';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  spacePoints?: number;
  onAnswer: (isCorrect: boolean, points: number, correctAnswer?: string, explanation?: string) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  question,
  spacePoints = 1,
  onAnswer
}) => {
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimeWarning, setIsTimeWarning] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleAnswer = useCallback((answer: string) => {
    if (isAnswered) return;
    const correct = answer === question.correctAnswer;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    setIsCorrect(correct);
    if (correct) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
    onAnswer(correct, spacePoints, question.correctAnswer, question.explanation);
    // Close modal after answering
    setTimeout(() => {
      onClose();
    }, 5000);
  }, [isAnswered, question.correctAnswer, spacePoints, question.explanation, onAnswer, onClose]);

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

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setTimeLeft(30);
      setIsTimeWarning(false);
    }
  }, [isOpen]);

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
      {isOpen && (
        <>
          {showConfetti && (
            <ReactConfetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={200}
              gravity={0.3}
              colors={['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981']}
              onConfettiComplete={() => setShowConfetti(false)}
              style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 100 }}
            />
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xl 
                       max-w-xs sm:max-w-md md:max-w-lg w-full mx-auto p-4 sm:p-6 md:p-8 
                       backdrop-blur-sm border border-white/20 dark:border-gray-700/20
                       max-h-[90vh] overflow-auto relative"
            >
              {/* Timer Circle */}
              <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-white/90 dark:bg-gray-700/90 shadow-lg flex items-center justify-center border-2 sm:border-4 border-blue-500/50">
                  <motion.div
                    animate={{
                      background: timeLeft <= 10 ? ['#ef4444', '#ffffff', '#ef4444'] : '#ffffff',
                    }}
                    transition={{ duration: 1, repeat: timeLeft <= 10 ? Infinity : 0 }}
                    className={`text-base sm:text-lg md:text-xl font-bold ${
                      timeLeft <= 10 ? 'text-red-500' : 'text-blue-500'
                    }`}
                  >
                    {timeLeft}
                  </motion.div>
                </div>
              </div>

              <div className="text-center mb-4 sm:mb-6 md:mb-8 mt-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-4 inline-block"
                >
                  {getCategoryEmoji(question.category)}
                </motion.div>
                
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-lg sm:text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                  {question.text}
                </motion.h2>
                
                <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20">
                  <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
                    {question.category}
                  </span>
                  <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-blue-500"></span>
                  <span className="text-xs sm:text-sm font-medium text-purple-700 dark:text-purple-300">
                    {spacePoints} points
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
                {question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    initial={{ x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}
                    className={`
                      p-3 sm:p-4 rounded-lg text-left text-sm sm:text-base
                      transition-all duration-300 transform hover:scale-[1.02]
                      ${isAnswered && option === question.correctAnswer
                        ? 'bg-green-100 dark:bg-green-900/50 border-2 border-green-500 text-green-800 dark:text-green-200'
                        : isAnswered && option === selectedAnswer
                        ? 'bg-red-100 dark:bg-red-900/50 border-2 border-red-500 text-red-800 dark:text-red-200'
                        : isAnswered
                        ? 'bg-gray-100 dark:bg-gray-700/50 border-2 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 opacity-70'
                        : 'bg-white dark:bg-gray-700 border-2 border-blue-200 dark:border-blue-800 text-gray-800 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md'}
                    `}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5
                        ${isAnswered && option === question.correctAnswer
                          ? 'bg-green-500 text-white'
                          : isAnswered && option === selectedAnswer
                          ? 'bg-red-500 text-white'
                          : 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'}
                      `}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className={isAnswered && option !== question.correctAnswer && option !== selectedAnswer ? 'opacity-70' : ''}>
                        {option}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 sm:p-4 rounded-lg mb-4 text-sm sm:text-base
                    ${isCorrect 
                      ? 'bg-green-100/70 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200' 
                      : 'bg-red-100/70 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200'}
                  `}
                >
                  <p className="font-medium mb-1">
                    {isCorrect ? '✅ Correct!' : '❌ Incorrect!'}
                  </p>
                  <p className="text-xs sm:text-sm">
                    {isCorrect 
                      ? `Great job! You earned ${spacePoints} points.` 
                      : `The correct answer is: ${question.correctAnswer}`}
                  </p>
                  {question.explanation && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Explanation:</span> {question.explanation}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuestionModal; 