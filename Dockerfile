FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the Vite app
RUN npm run build

# Expose the port Render expects (default 10000, but Vite preview chooses a random port, so we expose 8080 just in case)
EXPOSE 8080

# Use the start script (vite preview) to serve the built app
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "7860"]
