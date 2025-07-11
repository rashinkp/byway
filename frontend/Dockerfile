# =========================
# 🔧 Build stage
# =========================
FROM node:20-alpine AS builder
WORKDIR /app

# Install all dependencies (including dev)
COPY package*.json ./
RUN npm install

# Copy source code and build the app
COPY . .
RUN npm run build

# =========================
# 🚀 Production stage
# =========================
FROM node:20-alpine
WORKDIR /app

# Copy package files and install only production deps
COPY package*.json ./
RUN npm install --omit=dev

# Copy only the necessary built files from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json

# If you need others like tsconfig, add as needed

EXPOSE 3000

CMD ["npm", "start"]
