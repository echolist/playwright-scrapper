# Gunakan image resmi Playwright + Chromium dependencies
FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /app


RUN npm config set registry https://registry.npmjs.org/

# Copy file package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Copy semua file project
COPY . .

# Expose port
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
