FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Install netcat for waiting on mongo
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*
COPY init.sh /app/init.sh
RUN chmod +x /app/init.sh


EXPOSE 5000

#CMD ["./init.sh"]

ENTRYPOINT ["sh", "/app/init.sh"]
