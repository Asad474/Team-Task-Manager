FROM nginx:stable-alpine

# Copy your static files
COPY . /usr/share/nginx/html

# Copy a custom Nginx config template
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Expose the dynamic port
EXPOSE $PORT

# Nginx will automatically substitute $PORT when starting
CMD ["nginx", "-g", "daemon off;"]