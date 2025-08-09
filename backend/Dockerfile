# Build stage
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    && rm -rf /var/lib/apt/lists/*

RUN npm ci --omit=optional
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .
RUN npm run build

# Production stage
FROM node:20
WORKDIR /app
ENV NODE_ENV=production

# Copy only production node_modules and built files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

EXPOSE 5001
CMD ["npm", "start"]
