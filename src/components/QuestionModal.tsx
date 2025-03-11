'use client';

import React from 'react';
import { Question } from '../types/game';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  onAnswer: (isCorrect: boolean, correctAnswer?: string, explanation?: string) => void;
}

export default function QuestionModal({ isOpen, onClose, question, onAnswer }: QuestionModalProps) {
  if (!isOpen) return null;

  const handleAnswer = (selectedAnswer: string) => {
    const isCorrect = selectedAnswer === question.correctAnswer;
    onAnswer(isCorrect, question.correctAnswer, question.explanation);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Question
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {question.text}
        </p>
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 
                       dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 
                   dark:hover:text-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  );
} 