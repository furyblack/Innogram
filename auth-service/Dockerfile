FROM node:20-alpine

WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь исходный код
COPY . .

# Собираем TypeScript в JavaScript
# Убедись, что в package.json есть скрипт "build", например: "build": "tsc"
RUN npm run build

# Открываем порт, который слушает приложение ВНУТРИ контейнера
# ИСПРАВЛЕНО: должно быть 4000, как в docker-compose.yml
EXPOSE 4000

# Запускаем приложение. Лучше использовать скрипт из package.json для консистентности.
# Например, в package.json: "start": "node dist/index.js"
CMD ["npm", "run", "start"]