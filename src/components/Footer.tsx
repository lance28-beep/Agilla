'use client';

import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#4338CA] text-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Content */}
        <div className="flex justify-center items-center gap-4 sm:gap-8 md:gap-16 mb-6 overflow-x-auto">
          {/* AP Section */}
          <div className="flex flex-col items-center min-w-[100px]">
            <span className="text-3xl sm:text-4xl mb-2">📘</span>
            <h3 className="text-xl sm:text-2xl font-bold">AP</h3>
            <p className="text-xs sm:text-sm text-blue-200 text-center">Social Studies</p>
            <p className="text-[10px] sm:text-xs text-blue-200/70 text-center mt-0.5">Philippine Social Studies</p>
          </div>

          {/* GILA Section */}
          <div className="flex flex-col items-center min-w-[100px]">
            <span className="text-3xl sm:text-4xl mb-2">🎮</span>
            <h3 className="text-xl sm:text-2xl font-bold">GILA</h3>
            <p className="text-xs sm:text-sm text-blue-200 text-center">Educational Gaming</p>
            <p className="text-[10px] sm:text-xs text-blue-200/70 text-center mt-0.5 max-w-[120px]">Game-based Interactive Learning Activities</p>
          </div>

          {/* EKO9 Section */}
          <div className="flex flex-col items-center min-w-[100px]">
            <span className="text-3xl sm:text-4xl mb-2">✨</span>
            <h3 className="text-xl sm:text-2xl font-bold">EKO9</h3>
            <p className="text-xs sm:text-sm text-blue-200 text-center">Economics</p>
            <p className="text-[10px] sm:text-xs text-blue-200/70 text-center mt-0.5">Ekonomiks Grade 9</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-indigo-400/30">
          <div className="flex justify-between items-center text-center text-xs sm:text-sm">
            <p>
              Programmed by:{' '}
              <a
                href="https://lance28-beep.github.io/portfolio-website"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-colors duration-200"
              >
                Lance Valle
              </a>
            </p>
            <div>
              <p>Developed by: JHS Group</p>
              <p className="text-xs text-blue-200">© {currentYear} All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 