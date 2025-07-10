# Use official Node.js 20 LTS base image
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma folder first (to allow caching of dependencies)
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy rest of the backend source code (including src/, dist/, etc.)
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Expose the port your Express app runs on 
EXPOSE 5001

# Start the application
CMD ["npm", "start"]
