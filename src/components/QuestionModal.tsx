'use client';

import React, { useState } from 'react';
import { Question } from '../types/game';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  onAnswer: (isCorrect: boolean, correctAnswer?: string, explanation?: string) => void;
}

export default function QuestionModal({ isOpen, onClose, question, onAnswer }: QuestionModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!isOpen) return null;

  const handleAnswer = (answer: string) => {
    const correct = answer === question.correctAnswer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Delay the closing of modal to show feedback
    setTimeout(() => {
      onAnswer(correct, question.correctAnswer, question.explanation);
      setSelectedAnswer(null);
      setShowFeedback(false);
      onClose();
    }, 2000);
  };

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div 
        className={`
          bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-2xl w-full mx-4
          transform transition-all duration-300 ease-out
          ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}
        `}
      >
        {/* Question Header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="text-4xl" role="img" aria-label="question category">
            {getQuestionIcon()}
          </span>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Question
            </h2>
            {question.category && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm">
                {question.category}
              </span>
            )}
          </div>
        </div>

        {/* Question Text */}
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
          {question.text}
        </p>

        {/* Options */}
        <div className="space-y-4">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === question.correctAnswer;
            let optionStyle = `
              w-full p-4 text-left rounded-lg transition-all duration-300
              flex items-center gap-3
              ${
                showFeedback
                  ? isCorrectAnswer
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 ring-2 ring-green-500'
                    : isSelected
                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 ring-2 ring-red-500'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
              }
            `;

            return (
              <button
                key={index}
                onClick={() => !showFeedback && handleAnswer(option)}
                disabled={showFeedback}
                className={optionStyle}
              >
                <span className="w-8 h-8 flex-shrink-0 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border-2 border-current">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-grow">{option}</span>
                {showFeedback && (
                  <span className="flex-shrink-0">
                    {isCorrectAnswer ? '✅' : isSelected ? '❌' : ''}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Message */}
        {showFeedback && (
          <div className={`
            mt-6 p-4 rounded-lg
            ${isCorrect ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'}
            transform transition-all duration-300 animate-fadeIn
          `}>
            <p className="font-semibold mb-2">
              {isCorrect 
                ? '🎉 Correct! +10 points' 
                : `❌ Incorrect. The correct answer is: ${question.correctAnswer}`}
            </p>
            {!isCorrect && question.explanation && (
              <p className="text-sm mt-2">{question.explanation}</p>
            )}
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  );
} 