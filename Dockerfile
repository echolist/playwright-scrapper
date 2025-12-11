# Gunakan image resmi Playwright + Chromium dependencies
FROM mcr.microsoft.com/playwright:focal

WORKDIR /app

# Copy file package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Copy semua file project
COPY . .

# Expose port
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
