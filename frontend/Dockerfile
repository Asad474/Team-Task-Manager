FROM nginx:stable-alpine

# Copy your static files
COPY . /usr/share/nginx/html

# Remove default config and create new one with CORRECT binding
RUN rm -f /etc/nginx/conf.d/default.conf && \
    echo 'server { \
        listen 0.0.0.0:80; \
        server_name localhost; \
        root /usr/share/nginx/html; \
        index index.html; \
        location / { \
            try_files $uri $uri/ /index.html; \
        } \
    }' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]