#!/bin/sh

echo "--- STARTUP SCRIPT INITIATED ---"

echo "--- 1. Verifying environment & files ---"
echo "Current directory: $(pwd)"
echo "Listing root directory contents:"
ls -la

echo "--- 2. Verifying prisma/migrations folder ---"
echo "Listing migrations directory contents:"
ls -la prisma/migrations/

echo "--- 3. Attempting to run database migration ---"
npx prisma migrate deploy

# Simpan status dari perintah migrasi
MIGRATE_STATUS=$?

echo "--- Migration command finished with exit code: $MIGRATE_STATUS ---"

# Hentikan script jika migrasi gagal (exit code bukan 0)
if [ $MIGRATE_STATUS -ne 0 ]; then
  echo "--- !!! MIGRATION FAILED - EXITING !!! ---"
  exit 1
fi

echo "--- 4. Starting application server ---"
node src/app.js
