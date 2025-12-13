'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/src/lib/api/client';

interface TaskDetail {
  id: number;
  title: string;
  description: string;
  status: { 
    id: number;
    name: string; 
    color: string; 
  };
  priority: { 
    id: number;
    name: string; 
    color: string; 
  };
  client: { 
    id: number;
    name: string; 
  };
  created_by: { full_name: string };
  due_date?: string;
  created_at: string;
  updated_at: string;
  logs?: Array<{
    actor?: { full_name: string };
    action_type: string;
    timestamp: string;
  }>;
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTask() {
      try {
        setLoading(true);
        const response = await apiClient.get(`/tasks/${params.id}/`);
        setTask(response.data);
      } catch (error) {
        console.error('Таск ачааллахад алдаа:', error);
        setError('Таск ачааллахад алдаа гарлаа');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchTask();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Та энэ таскыг устгахдаа итгэлтэй байна уу?')) {
      return;
    }

    try {
      await apiClient.delete(`/tasks/${params.id}`);
      alert('Таск амжилттай устлаа!');
      router.push('/tasks');
    } catch (err) {
      console.error('Таск устгахад алдаа:', err);
      alert('Таск устгахад алдаа гарлаа');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">
            {error || 'Таск олдсонгүй'}
          </h2>
          <button
            onClick={() => router.push('/tasks')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            ← Буцах
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/tasks')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Буцах
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/tasks/${params.id}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Засах
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Устгах
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
                <div className="flex gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{
                      backgroundColor: task.status.color,
                    }}
                  >
                    {task.status.name}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{
                      backgroundColor: task.priority.color,
                    }}
                  >
                    {task.priority.name}
                  </span>
                </div>
              </div>

              {task.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Тайлбар:</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
                <div>
                  <span className="font-medium text-gray-500">Харилцагч:</span>
                  <p className="mt-1 text-gray-900">{task.client.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Үүсгэсэн:</span>
                  <p className="mt-1 text-gray-900">{task.created_by.full_name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Үүсгэсэн огноо:</span>
                  <p className="mt-1 text-gray-900">
                    {new Date(task.created_at).toLocaleString('mn-MN')}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Шинэчилсэн:</span>
                  <p className="mt-1 text-gray-900">
                    {new Date(task.updated_at).toLocaleString('mn-MN')}
                  </p>
                </div>
                {task.due_date && (
                  <div className="col-span-2">
                    <span className="font-medium text-gray-500">Хугацаа:</span>
                    <p className="mt-1 text-gray-900">
                      {new Date(task.due_date).toLocaleString('mn-MN')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Activity Logs */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📜</span>
                <span>Үйлдлийн түүх</span>
              </h2>
              {task.logs && task.logs.length > 0 ? (
                <div className="space-y-4">
                  {task.logs.map((log, index) => (
                    <div key={index} className="border-l-2 border-blue-500 pl-4 pb-4 last:pb-0">
                      <p className="font-medium text-gray-900 text-sm">
                        {log.action_type}
                      </p>
                      {log.actor && (
                        <p className="text-xs text-gray-600 mt-1">
                          👤 {log.actor.full_name}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(log.timestamp).toLocaleString('mn-MN')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Түүх байхгүй байна</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}