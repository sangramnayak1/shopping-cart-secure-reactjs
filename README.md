# shopping-cart-complete-secure

This package contains a ready-to-run shopping cart demo with:
- React frontend
- Node.js + Express backend
- MongoDB (docker)

Seeds run automatically when backend container starts:
- Admin user (ADMIN_EMAIL / ADMIN_PASSWORD from backend/.env)
- Sample products
- Sample orders

## Usage

1. Copy backend/.env.example to backend/.env and set ADMIN_EMAIL and ADMIN_PASSWORD (and secrets).
2. Run:
   docker compose up --build
3. Open http://localhost:3000


# Debug steps:
```
docker-compose exec backend node seedAdmin.js
✅ Connected to MongoDB in Docker
✅ Admin created: admin@example.com / admin123

curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com", "password":"test123"}'
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWEzMjc4ZmJmNTY2OTkwYTg5ZGI5YiIsImlhdCI6MTc1NDkzNjU5NCwiZXhwIjoxNzU1MDIyOTk0fQ.V00PB9CMyrF2fymAZVV5e1lPBCOVXErK_jEz8WXnQQY"}

docker-compose exec backend npm run seed

docker-compose logs backend

docker-compose up backend

docker-compose restart backend

docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up

docker-compose up --build
docker-compose down

zip -r shopping-cart.zip shopping-cart/

docker-compose logs backend --tail=200

docker-compose exec mongo mongosh
use shopping
db.users.find({ role: 'admin' }).pretty()


db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { password: "$2a$10$hG0t3cu23ek3hfZwF8gy1eLO9KP6FYES7XSdSSmqWf7N4BBdo6pOW" } }
)
```

## Debug MongoDB
1️⃣ Open MongoDB shell inside your Docker container

Find your Mongo container:

docker ps

Example output:

CONTAINER ID   IMAGE         COMMAND                  ...   NAMES
abc12345       mongo:6.0     "docker-entrypoint.s…"   ...   shopping_mongo

Then connect:

```docker exec -it shopping_mongo mongosh```

2️⃣ Switch to your app’s database

Most likely:

use shopping

You can confirm with:

show collections

You should see users.

3️⃣ Reset the password for the admin

Since the backend hashes passwords, we can either:

    Use the backend’s hashing function (safer)

    Or bypass hashing and insert plaintext (only for quick testing, not for production)

Here’s the safe way using bcrypt from inside the backend container.

First, exit MongoDB shell (exit) and go into the backend container:

```docker exec -it shopping_backend sh```

Then open Node REPL:

node

Inside Node:

const bcrypt = require('bcryptjs');
bcrypt.hash('admin123', 10).then(console.log);

Copy the resulting hash (a long string starting with $2a$10$...).

4️⃣ Update password in MongoDB

Reconnect to MongoDB shell:

```docker exec -it shopping_mongo mongosh```

Switch DB:

```use shopping```

Update:

```
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { password: "<PASTE_HASH_HERE>" } }
)
```

5️⃣ Test login

Now you can log in with:

Email: admin@example.com
Password: admin123
