"use client";

import { useEffect, useState } from "react";
import api from "@/api/axios"; // <-- Импортируем наш настроенный axios

// Опишем, как выглядит объект поста
interface Post {
  id: number;
  title: string;
  body: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect будет выполнен один раз при загрузке компонента
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        // Отправляем запрос. Токен будет добавлен автоматически!
        const response = await api.get("/posts");
        setPosts(response.data);
      } catch (err) {
        setError("Не удалось загрузить посты. Попробуйте снова.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []); // Пустой массив зависимостей означает "выполнить один раз"

  if (isLoading) {
    return <div className="text-center p-10">Загрузка постов...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Лента постов</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded-lg shadow">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-700 mt-2">{post.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
