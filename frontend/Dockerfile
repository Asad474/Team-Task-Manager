# Stage 1: Build the frontend
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build the application
RUN npm run build

# Debug: Show what was built
RUN echo "=== Build output ===" && ls -la && \
    (ls -la dist 2>/dev/null && echo "Found dist folder") || \
    (ls -la build 2>/dev/null && echo "Found build folder") || \
    (ls -la out 2>/dev/null && echo "Found out folder") || \
    echo "No standard build folder found"

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy from builder - try dist first
COPY --from=builder /app/dist /usr/share/nginx/html

# If dist didn't work, try build (this runs if the previous COPY had no files)
RUN if [ ! -f /usr/share/nginx/html/index.html ]; then \
        echo "Trying build folder..." && \
        cp -r /app/build/* /usr/share/nginx/html 2>/dev/null || true; \
    fi

# If still no files, try out folder
RUN if [ ! -f /usr/share/nginx/html/index.html ]; then \
        echo "Trying out folder..." && \
        cp -r /app/out/* /usr/share/nginx/html 2>/dev/null || true; \
    fi

# If still no files, copy everything as fallback
RUN if [ ! -f /usr/share/nginx/html/index.html ]; then \
        echo "Copying all files as fallback..." && \
        cp -r /app/* /usr/share/nginx/html 2>/dev/null || true; \
    fi

# Create Nginx config with proper MIME types
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen 80;' >> /etc/nginx/conf.d/default.conf && \
    echo '    server_name localhost;' >> /etc/nginx/conf.d/default.conf && \
    echo '    include /etc/nginx/mime.types;' >> /etc/nginx/conf.d/default.conf && \
    echo '    root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    index index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \
    echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf

# Debug: Show what files were copied
RUN echo "=== Files in nginx html directory ===" && ls -la /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]