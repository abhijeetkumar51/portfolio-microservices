# Use Nginx to serve static files
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static files
COPY . /usr/share/nginx/html/

# Remove non-frontend files that got copied
RUN rm -f /usr/share/nginx/html/Dockerfile

# Expose port 3000
EXPOSE 3000

# Custom nginx config to listen on port 3000
RUN echo 'server { listen 3000; server_name localhost; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
