'use client';

import React, { useState, useEffect } from 'react';
import { Question } from '../types/game';
import { soundManager } from '../utils/soundEffects';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  onAnswer: (isCorrect: boolean, points: number, correctAnswer?: string, explanation?: string) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ isOpen, onClose, question, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds timer
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (isOpen && !isAnswered) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAnswer('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, isAnswered]);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    const isCorrect = answer === question.correctAnswer;
    
    soundManager.play(isCorrect ? 'correct' : 'incorrect');
    
    // Points between 1-5, -1 for incorrect
    const pointsAwarded = isCorrect ? Math.min(Math.max(question.points || 1, 1), 5) : -1;
    
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);

    setTimeout(() => {
      onAnswer(isCorrect, pointsAwarded, question.correctAnswer, question.explanation);
    }, 3000);
  };

  if (!isOpen) return null;

  const getQuestionIcon = () => {
    switch (question.category?.toLowerCase()) {
      case 'opportunity cost':
        return '💭';
      case 'trade-off':
        return '⚖️';
      case 'marginal thinking':
        return '🤔';
      case 'incentives':
        return '🎯';
      case 'scarcity':
        return '📊';
      default:
        return '❓';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with glass effect */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      {/* Modal content */}
      <div className="relative bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-2xl max-w-2xl w-full transform transition-all duration-300 scale-100 animate-fadeIn backdrop-blur-md border border-white/20">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className={`
                inline-block px-3 py-1 rounded-full text-sm font-medium
                ${getDifficultyColor(question.difficulty)}
              `}>
                {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
              </span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                {question.category}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`
                text-lg font-bold
                ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-600 dark:text-gray-400'}
              `}>
                {timeLeft}s
              </span>
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium">
                +{Math.min(Math.max(question.points || 1, 1), 5)} pts
              </span>
            </div>
          </div>

          {/* Question */}
          <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">
            {question.text}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={`
                  w-full p-4 text-left rounded-lg transition-all duration-300
                  ${getOptionStyle(option, selectedAnswer, question.correctAnswer, isAnswered)}
                  ${!isAnswered && 'hover:scale-102 hover:shadow-md'}
                `}
              >
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && question.explanation && (
            <div className="mt-6 p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg animate-slideUp backdrop-blur-sm">
              <h4 className="font-bold text-gray-800 dark:text-white mb-2">Explanation:</h4>
              <p className="text-gray-600 dark:text-gray-300">{question.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'hard':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'expert':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getOptionStyle = (
  option: string,
  selectedAnswer: string | null,
  correctAnswer: string,
  isAnswered: boolean
) => {
  if (!isAnswered) {
    return 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600';
  }

  if (option === correctAnswer) {
    return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-500';
  }

  if (option === selectedAnswer) {
    return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-500';
  }

  return 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 opacity-50';
};

export default QuestionModal; 