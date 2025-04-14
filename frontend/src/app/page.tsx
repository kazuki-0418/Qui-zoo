import { Card, Badge } from 'flowbite-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back, Jane!</h1>
        <p className="text-gray-600 dark:text-gray-400">Ready to continue your learning journey?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <Badge color="info" size="xl" className="p-5">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
              </svg>
            </Badge>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</p>
              <p className="text-2xl font-semibold">3 Days</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <Badge color="success" size="xl" className="p-5">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </Badge>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Quizzes</p>
              <p className="text-2xl font-semibold">24</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <Badge color="purple" size="xl" className="p-5">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </Badge>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Score</p>
              <p className="text-2xl font-semibold">85%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-bold mb-4">Continue Learning</h2>
          <div className="space-y-4">
            <Link href="/quiz/linear-equations" className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <h3 className="font-semibold">Linear Equations</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Progress: 60%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </Link>

            <Link href="/quiz/rational-numbers" className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <h3 className="font-semibold">Rational Numbers</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Progress: 30%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </Link>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">Recent Achievements</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex-shrink-0">
                <Badge color="warning" size="xl">
                  🏆
                </Badge>
              </div>
              <div className="ml-4">
                <p className="font-medium">Perfect Score!</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed Basic Algebra with 100%</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex-shrink-0">
                <Badge color="info" size="xl">
                  ⭐
                </Badge>
              </div>
              <div className="ml-4">
                <p className="font-medium">3 Day Streak</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Keep up the great work!</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
