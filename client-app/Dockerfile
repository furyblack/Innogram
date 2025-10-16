FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Сборка Next.js приложения
RUN npm run build

# Открываем порт, который слушает Next.js
EXPOSE 3000

# Запускаем Next.js в production-режиме
CMD ["npm", "run", "start"]