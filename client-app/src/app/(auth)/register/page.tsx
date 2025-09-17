"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useRouter } from "next/navigation";

// Схема валидации
const formSchema = z.object({
  name: z.string().min(2, { message: "Имя должно быть минимум 2 символа" }),
  email: z.string().email({ message: "Неверный формат email" }),
  password: z
    .string()
    .min(6, { message: "Пароль должен быть минимум 6 символов" }),
});

export default function RegisterPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post("http://localhost:3003/api/auth/register", values);
      alert("Успешная регистрация! Теперь вы можете войти.");
      router.push("/login"); // Перенаправляем на страницу входа
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      alert("Ошибка при регистрации. Попробуйте снова.");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Регистрация</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* --- Поле для имени --- */}
              <FormField
                control={form.control} // Передаем управление формой
                name="name" // Указываем имя поля
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Ваше имя" {...field} />
                    </FormControl>
                    <FormMessage />{" "}
                    {/* Здесь будет выводиться ошибка валидации */}
                  </FormItem>
                )}
              />

              {/* --- Поле для Email --- */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@mail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- Поле для пароля --- */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Зарегистрироваться
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
