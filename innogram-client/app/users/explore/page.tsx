"use client";
import { useState, useEffect } from "react";

// 1. Создаем интерфейсы (решает проблему "Unexpected any")
interface Profile {
  username: string;
  avatarUrl?: string;
}

interface User {
  id: string;
  email: string;
  profile?: Profile; // Профиль может быть, а может и не быть
}

export default function ExploreUsersPage() {
  // 2. Типизируем стейт
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. Правильный useEffect (решает проблему "Synchronous setState")
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users?page=1&limit=50");
        if (res.ok) {
          const data = await res.json();
          // Учитываем структуру пагинации (items) или массив
          setUsers(data.items || data);
        }
      } catch (e) {
        console.error("Failed to load users", e);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFollow = async (username?: string) => {
    if (!username) {
        alert("Error: Username is missing. (Backend didn't return profile?)");
        return;
    }

    try {
        const res = await fetch(`/api/users/${username}/follow`, { method: 'POST' });
        
        if (res.ok) {
            alert(`✅ Followed ${username}!`);
        } else {
            // Читаем ошибку с бэкенда
            const errData = await res.json();
            alert(`❌ Error: ${errData.message || res.statusText}`);
        }
    } catch (e) {
        alert("Network error");
    }
  }

  if (loading) return <div className="p-10 text-black">Loading...</div>;

  return (
      <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-black">Explore Users</h1>
          <div className="space-y-4">
              {users.map((user) => (
                  <div key={user.id} className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded shadow-sm">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border border-gray-400">
                              {user.profile?.avatarUrl ? (
                                  <img src={user.profile.avatarUrl} className="w-full h-full object-cover"/>
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">?</div>
                              )}
                          </div>
                          <div>
                              {/* Если профиля нет, пишем Warning */}
                              <p className="font-bold text-black">
                                  {user.profile?.username || <span className="text-red-500 text-xs">No Profile</span>}
                              </p>
                              <p className="text-xs text-gray-600">{user.email}</p>
                          </div>
                      </div>
                      <button 
                        // Передаем username безопасно
                        onClick={() => handleFollow(user.profile?.username)}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 text-sm font-bold border border-blue-200"
                      >
                          Follow
                      </button>
                  </div>
              ))}
          </div>
      </div>
  )
}