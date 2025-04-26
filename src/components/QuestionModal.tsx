'use client';

import React, { useState } from 'react';
import { Question } from '../types/game';
import { motion } from 'framer-motion';
import Confetti from './Confetti';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  spacePoints: number;
  onAnswer: (isCorrect: boolean, points: number, correctAnswer?: string, explanation?: string) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  question,
  spacePoints,
  onAnswer,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  if (!isOpen) return null;

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || hasAnswered) return;

    const correct = selectedAnswer === question.correctAnswer;
    setIsCorrect(correct);
    setHasAnswered(true);

    if (correct) {
      setShowConfetti(true);
      // Reset confetti after animation
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }

    // Show the result for a moment before closing
    setTimeout(() => {
      onAnswer(correct, spacePoints, question.correctAnswer, question.explanation);
    }, 2000);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, { bg: string, text: string }> = {
      'Opportunity Cost': { bg: 'from-blue-500 to-blue-600', text: 'text-blue-100' },
      'Trade-off': { bg: 'from-purple-500 to-purple-600', text: 'text-purple-100' },
      'Marginal Thinking': { bg: 'from-green-500 to-green-600', text: 'text-green-100' },
      'Incentives': { bg: 'from-yellow-500 to-yellow-600', text: 'text-yellow-100' },
      'Scarcity': { bg: 'from-red-500 to-red-600', text: 'text-red-100' }
    };
    return colors[category] || { bg: 'from-gray-500 to-gray-600', text: 'text-gray-100' };
  };

  const categoryColor = getCategoryColor(question.category);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Confetti isActive={showConfetti} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-auto overflow-hidden"
      >
        {/* Question Header */}
        <div className={`p-4 bg-gradient-to-r ${categoryColor.bg} ${categoryColor.text}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">Question #{question.id}</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                  {question.category}
                </span>
                <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                  {question.points} points
                </span>
              </div>
            </div>
            <div className="text-4xl opacity-50">❓</div>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6">
          <p className="text-lg text-gray-800 dark:text-gray-200 font-medium mb-6">
            {question.text}
          </p>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !hasAnswered && setSelectedAnswer(option)}
                disabled={hasAnswered}
                className={`
                  p-4 rounded-lg text-left transition-all duration-200
                  ${hasAnswered
                    ? option === question.correctAnswer
                      ? 'bg-green-100 dark:bg-green-900/30 border-green-500'
                      : option === selectedAnswer
                      ? 'bg-red-100 dark:bg-red-900/30 border-red-500'
                      : 'bg-gray-100 dark:bg-gray-700/30 border-transparent'
                    : selectedAnswer === option
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500'
                    : 'bg-gray-100 dark:bg-gray-700/30 hover:bg-gray-200 dark:hover:bg-gray-600/30 border-transparent'
                  }
                  border-2 flex items-center gap-3
                `}
              >
                <span className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${hasAnswered
                    ? option === question.correctAnswer
                      ? 'bg-green-500 text-white'
                      : option === selectedAnswer
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-500 text-white'
                    : selectedAnswer === option
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-500 text-white'
                  }
                `}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1 text-sm sm:text-base">{option}</span>
                {hasAnswered && (
                  <span className="text-xl">
                    {option === question.correctAnswer ? '✅' : option === selectedAnswer ? '❌' : ''}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleAnswerSubmit}
              disabled={!selectedAnswer || hasAnswered}
              className={`
                px-6 py-2 rounded-lg text-sm font-medium transition-all
                ${!selectedAnswer || hasAnswered
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl active:scale-95'
                }
              `}
            >
              Submit
            </button>
          </div>

          {/* Explanation (shown after answering) */}
          {hasAnswered && question.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                mt-6 p-4 rounded-lg
                ${isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}
              `}
            >
              <h4 className={`font-bold mb-2 ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                Explanation:
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {question.explanation}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuestionModal;