# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/dist/TalentBridge/browser/ /usr/share/nginx/html/
COPY --from=build /app/instructions/ /usr/share/nginx/html/instructions/
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
