FROM node:20-alpine
WORKDIR /app

# Copy toàn bộ source code
COPY . .

# Cài dependencies
RUN npm install

# Build Next.js
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3001

# Chạy app
CMD ["npm", "start"]
