FROM node:18

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

# Menjalankan script startup kita yang berisi migrasi dan server
CMD ["./start.sh"]
