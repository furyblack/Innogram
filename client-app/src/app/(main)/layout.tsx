"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    // Если токена нет, перенаправляем на страницу входа
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  // Если токен есть, но данные еще грузятся, можно показать preloader
  if (!token) {
    return <div>Загрузка...</div>;
  }

  // Если токен есть, показываем содержимое страницы
  return <>{children}</>;
}
