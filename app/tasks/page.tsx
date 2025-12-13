'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/src/lib/api/client';

interface Client {
  id: number;
  name: string;
  contact_person: string;
  email: string;
}

interface Status {
  id: number;
  name: string;
  color: string;
  order: number;
}

interface Priority {
  id: number;
  name: string;
  level: number;
  color: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  client_id: number;
  status_id: number;
  priority_id: number;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  client?: Client;
  status?: Status;
  priority?: Priority;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, statusesData, prioritiesData] = await Promise.all([
        apiClient.get<Task[]>('/tasks/'),
        apiClient.get<Status[]>('/statuses/'),
        apiClient.get<Priority[]>('/priorities/'),
      ]);
      
      setTasks(tasksData.data);
      setStatuses(statusesData.data);
      setPriorities(prioritiesData.data);
    } catch (err) {
      console.error('Өгөгдөл ачааллахад алдаа:', err);
      setError('Өгөгдөл ачааллахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Хугацаагүй';
    const date = new Date(dateString);
    return date.toLocaleDateString('mn-MN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || String(task.status_id) === filterStatus;
    const matchesPriority = !filterPriority || String(task.priority_id) === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Ачааллаж байна...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Таскууд</h1>
            <button
              onClick={() => router.push('/tasks/create')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              + Шинэ таск
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Хайх
                </label>
                <input
                  type="text"
                  placeholder="Гарчиг эсвэл тайлбараар хайх..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Төлөв
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">Бүгд</option>
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Чухлал
                </label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">Бүгд</option>
                  {priorities.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                      {priority.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">
              {searchTerm || filterStatus || filterPriority 
                ? 'Хайлтын үр дүн олдсонгүй' 
                : 'Таск байхгүй байна'}
            </p>
            {!searchTerm && !filterStatus && !filterPriority && (
              <button
                onClick={() => router.push('/tasks/create')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Эхний таскаа үүсгэх
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => router.push(`/tasks/${task.id}`)}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-3 items-center text-sm">
                      <span className="text-gray-500">
                        📅 {formatDate(task.due_date)}
                      </span>
                      
                      {task.client && (
                        <span className="text-gray-500">
                          👤 {task.client.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {task.status && (
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium text-white whitespace-nowrap"
                        style={{ backgroundColor: task.status.color }}
                      >
                        {task.status.name}
                      </span>
                    )}
                    
                    {task.priority && (
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium text-white whitespace-nowrap"
                        style={{ backgroundColor: task.priority.color }}
                      >
                        {task.priority.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 text-center text-gray-500">
          Нийт {filteredTasks.length} таск
          {(searchTerm || filterStatus || filterPriority) && ` (${tasks.length}-с шүүсэн)`}
        </div>
      </div>
    </div>
  );
}