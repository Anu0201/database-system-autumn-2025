'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/src/lib/api/client';

interface Client {
  id: number;
  name: string;
}

interface Status {
  id: number;
  name: string;
}

interface Priority {
  id: number;
  name: string;
}

export default function CreateTaskPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [statusId, setStatusId] = useState('');
  const [priorityId, setPriorityId] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  const [clients, setClients] = useState<Client[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [clientsRes, statusesRes, prioritiesRes] = await Promise.all([
        apiClient.get('/clients/'),
        apiClient.get('/statuses/'),
        apiClient.get('/priorities/'),
      ]);
      
      setClients(clientsRes.data);
      setStatuses(statusesRes.data);
      setPriorities(prioritiesRes.data);
      
      if (statusesRes.data.length > 0) setStatusId(String(statusesRes.data[0].id));
      if (prioritiesRes.data.length > 0) setPriorityId(String(prioritiesRes.data[0].id));
    } catch (err) {
      console.error('Алдаа:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.post('/tasks/', {
        title,
        description,
        client_id: parseInt(clientId),
        status_id: parseInt(statusId),
        priority_id: parseInt(priorityId),
        due_date: dueDate || null,
      });

      alert('✅ Таск амжилттай үүслээ!');
      router.push('/dashboard');
    } catch {
    setError('Таск үүсгэхэд алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Шинэ таск үүсгэх</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Гарчиг */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Гарчиг *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Таскын гарчиг оруулах"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                required
              />
            </div>

            {/* Тайлбар */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тайлбар
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Дэлгэрэнгүй тайлбар..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Харилцагч ба Төлөв */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Харилцагч *
                </label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                >
                  <option value="">Сонгох...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Төлөв *
                </label>
                <select
                  value={statusId}
                  onChange={(e) => setStatusId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                >
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Чухлал ба Хугацаа */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Чухлал *
                </label>
                <select
                  value={priorityId}
                  onChange={(e) => setPriorityId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                >
                  {priorities.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                      {priority.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Хугацаа
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Үүсгэж байна...' : '✅ Таск үүсгэх'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Цуцлах
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}