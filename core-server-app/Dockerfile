FROM node:18-alpine

WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальной код приложения
COPY . .

# Сборка NestJS приложения (если используете TypeScript)
RUN npm run build

# Открываем порт, который слушает ваше NestJS-приложение
EXPOSE 3000

# Запускаем скомпилированное приложение
CMD ["npm", "run", "start"]