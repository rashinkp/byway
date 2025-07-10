# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Build the Next.js app
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built app from builder
COPY --from=builder /app ./

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]