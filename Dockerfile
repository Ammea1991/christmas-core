# Usa un'immagine di base con Node.js
FROM node:16-alpine

# Definisci gli argomenti passati da docker-compose
ARG BASICAUTH_USR_PWD
ARG DB_URI

# Imposta le variabili d'ambiente nel container
ENV BASICAUTH_USR_PWD=${BASICAUTH_USR_PWD}
ENV DB_URI=${DB_URI}

RUN echo "${BASICAUTH_USR_PWD}"
# Crea una directory di lavoro all'interno del container
WORKDIR /app

# Copia il file package.json e package-lock.json nel container
COPY package*.json /app/

# Installa le dipendenze del progetto
RUN npm install

# Copia il resto del codice sorgente nel container
COPY . .

# Espone la porta 3001 per il server Node.js
EXPOSE 3001

# Comando di avvio del server Node.js
CMD ["npm", "start"]

#trigger