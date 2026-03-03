FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY server.js ./

EXPOSE 3002

CMD ["node", "server.js"]
