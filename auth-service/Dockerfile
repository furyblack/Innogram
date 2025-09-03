FROM node:18-alpine

WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь исходный код
COPY . .

# Сборка TypeScript в JavaScript
# ЭТА КОМАНДА ТРЕБУЕТ, ЧТОБЫ В auth-service/package.json БЫЛ СКРИПТ "build"
# Например: "scripts": { "build": "tsc" }
RUN npm run build

# Открываем порт
EXPOSE 3001

# Запускаем скомпилированное приложение
# Убедитесь, что в результате "npm run build" создается /app/dist/index.js
CMD ["node", "dist/index.js"]