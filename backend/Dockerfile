FROM node:20-alpine

# Install dependencies for building native modules
RUN apk add --no-cache python3 make g++ vips-dev

WORKDIR /opt/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app files
COPY . .

# Build admin panel
ENV NODE_ENV=production
RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "start"]
