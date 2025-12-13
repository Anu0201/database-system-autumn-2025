'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/src/lib/api/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.login(username, password);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      router.push('/dashboard');
    } catch (err: unknown) {
  const error = err as { response?: { data?: { detail?: string } } };
  setError(error.response?.data?.detail || 'Нэвтрэх нэр эсвэл нууц үг буруу');
} finally {
  setLoading(false);
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Task Management</h1>
          <p className="text-gray-600 mt-2">Системд нэвтрэх</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6
        
        
        ">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Хэрэглэгчийн нэр
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Нууц үг
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Test: admin / admin123
        </p>
      </div>
    </div>
  );
}