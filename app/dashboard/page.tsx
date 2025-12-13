'use client';

import { useRouter } from 'next/navigation';
import { authApi } from '@/src/lib/api/auth';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    authApi.logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Task Management System</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Гарах
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Тавтай морил! 🎉
          </h2>
          <p className="text-gray-600 mb-6">
            Backend болон Frontend амжилттай холбогдлоо.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl mb-2">✅</div>
              <h3 className="font-semibold text-gray-900 mb-1">Backend</h3>
              <p className="text-sm text-gray-600">Django REST API ажиллаж байна</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl mb-2">✅</div>
              <h3 className="font-semibold text-gray-900 mb-1">Frontend</h3>
              <p className="text-sm text-gray-600">Next.js ажиллаж байна</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl mb-2">✅</div>
              <h3 className="font-semibold text-gray-900 mb-1">Database</h3>
              <p className="text-sm text-gray-600">PostgreSQL холбогдсон</p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">🚀 Систем бэлэн!</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• JWT Authentication ажиллаж байна</li>
              <li>• Backend API бэлэн</li>
              <li>• Frontend UI бэлэн</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}