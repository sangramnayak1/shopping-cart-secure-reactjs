#!/bin/sh
set -e

echo "⏳ Waiting for MongoDB to be ready..."
until nc -z mongo 27017; do
  sleep 1
done
echo "✅ MongoDB is up."

echo "📦 Running seed scripts..."
node seed/seedAdmin.js
node seed/seedProducts.js
node seed/seedOrders.js

echo "🚀 Starting backend server..."
node server.js
