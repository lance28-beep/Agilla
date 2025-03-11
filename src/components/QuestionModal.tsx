'use client';

import { useState, useEffect } from 'react';
import { Question } from '../types/game';
import { useGame } from '../context/GameContext';

interface QuestionModalProps {
  isOpen: boolean;
  question: Question | null;
  onClose: () => void;
  onAnswer: (isCorrect: boolean) => void;
}

export default function QuestionModal({ isOpen, question, onClose, onAnswer }: QuestionModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSelectedAnswer(null);
    }
  }, [isOpen]);

  if (!mounted || !isOpen || !question) return null;

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setTimeout(() => {
      onAnswer(answer === question.correctAnswer);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`
        bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full
        transform transition-all duration-300
        ${mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Question
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-300">{question.questionText}</p>
        
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`
                w-full p-4 rounded-lg text-left transition-all
                ${selectedAnswer === null
                  ? 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  : selectedAnswer === option
                    ? option === question.correctAnswer
                      ? 'bg-green-100 dark:bg-green-800'
                      : 'bg-red-100 dark:bg-red-800'
                    : option === question.correctAnswer
                      ? 'bg-green-100 dark:bg-green-800'
                      : 'bg-gray-100 dark:bg-gray-700'
                }
                ${selectedAnswer !== null && 'cursor-not-allowed'}
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 