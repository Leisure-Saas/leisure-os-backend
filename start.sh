Bash

#!/bin/sh

# Menjalankan migrasi database
echo "Running database migrations..."
npx prisma migrate deploy

# Memulai server aplikasi
echo "Starting server..."
node src/app.js
