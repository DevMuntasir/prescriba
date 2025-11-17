# -------------------
# 1st Stage: Angular Build
# -------------------
FROM node:18-alpine AS build

# Inside container working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build Angular for production
RUN npm run build --prod


# -------------------
# 2nd Stage: NGINX Static Server
# -------------------
FROM nginx:alpine

# Copy Angular build output to nginx html folder
# NOTE: Angular build output = dist/<your-project-name>/
COPY --from=build /app/dist /cloudflare/share/nginx/html

# Expose nginx port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
