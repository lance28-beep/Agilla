'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Question } from '../types/game';
import { soundManager } from '../utils/soundEffects';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  onAnswer: (isCorrect: boolean, points: number, correctAnswer?: string, explanation?: string) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  question,
  onAnswer
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswer = useCallback(() => {
    if (!selectedOption || hasAnswered) return;

    const correct = selectedOption === question.correctAnswer;
    setIsCorrect(correct);
    setHasAnswered(true);
    soundManager.play(correct ? 'correct' : 'wrong');
    onAnswer(correct, question.points, question.correctAnswer, question.explanation);
  }, [selectedOption, hasAnswered, question, onAnswer]);

  useEffect(() => {
    if (selectedOption && !hasAnswered) {
      handleAnswer();
    }
  }, [selectedOption, hasAnswered, handleAnswer]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-2xl w-full m-4 animate-scaleUp">
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">❓</span>
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
            {question.text}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Category: {question.category} • {question.points} points
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !hasAnswered && setSelectedOption(option)}
              disabled={hasAnswered}
              className={`
                p-4 rounded-xl text-left transition-all duration-300 transform
                ${hasAnswered
                  ? option === question.correctAnswer
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-300'
                    : option === selectedOption
                    ? 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300'
                    : 'bg-gray-100 dark:bg-gray-700/30 opacity-50'
                  : selectedOption === option
                  ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300 scale-105'
                  : 'bg-gray-100 dark:bg-gray-700/30 hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-600/30'
                }
                border-2
                ${hasAnswered
                  ? option === question.correctAnswer
                    ? 'border-green-500'
                    : option === selectedOption
                    ? 'border-red-500'
                    : 'border-transparent'
                  : selectedOption === option
                  ? 'border-blue-500'
                  : 'border-transparent'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg font-semibold">{String.fromCharCode(65 + index)}.</span>
                <span className="flex-1">{option}</span>
              </div>
            </button>
          ))}
        </div>

        {hasAnswered && (
          <div className={`
            p-4 rounded-xl mb-4
            ${isCorrect 
              ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500' 
              : 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
            }
          `}>
            <p className={`
              font-medium mb-2
              ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}
            `}>
              {isCorrect ? '✅ Correct!' : '❌ Incorrect!'}
            </p>
            {question.explanation && (
              <p className="text-gray-600 dark:text-gray-400">
                {question.explanation}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionModal; 