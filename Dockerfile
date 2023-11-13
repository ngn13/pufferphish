FROM node:20.8.1-slim

COPY . /app
RUN rm -rf /app/node_modules
WORKDIR /app
RUN npm install

CMD ["npm", "run", "start"]
