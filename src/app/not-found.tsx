import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white/90 dark:bg-gray-800/90 p-8 rounded-xl shadow-2xl max-w-md w-full backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          404 - Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Oops! The page you are looking for doesn't exist.
        </p>
        <Link 
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
                   text-white rounded-xl font-semibold tracking-wide inline-block
                   hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 
                   transform hover:scale-105 transition-all duration-300
                   shadow-lg hover:shadow-xl active:scale-95"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
} 