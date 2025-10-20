import { User } from '../users/user.entity'; // <-- Проверьте этот путь!

declare global {
    namespace Express {
        // 2. "Прикрепляем" свойство `user` к интерфейсу Request из Express.
        // Теперь во всем приложении TypeScript будет знать, что в объекте Request
        // может быть свойство `user` с нашим типом `User` (или оно может отсутствовать).
        interface Request {
            user?: User;
        }
    }
}
