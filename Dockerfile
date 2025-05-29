FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install --exclude=mysql2
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
