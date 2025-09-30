# Sử dụng image node chính thức
FROM node:18-alpine

# Tạo thư mục app
WORKDIR /app

# Copy file package trước để tối ưu cache
COPY package.json package-lock.json* ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source
COPY . .

# Build Next.js
RUN npm run build

# Expose port mặc định của Next.js
EXPOSE 3001

# Start app
CMD ["npm", "run", "start"]
