# Nome del container backend locale
container_be_local = christmas-core

# Percorso del docker-compose per l'ambiente locale
compose_local = docker compose -f ./operations/local/docker-compose.yml

# Script per l'esportazione delle variabili d'ambiente
export_env = source ./export_env.sh

# Comando per avviare il container backend
start_backend = docker exec -it ${container_be_local} node index.js

# Target per avviare il container
start:
	${export_env} && ${compose_local} up -d
	${start_backend}

# Target per fermare il container
stop:
	${compose_local} stop

# Target per rimuovere i container e le reti create
down:
	${compose_local} down

# Target per avviare il container con rebuild dell'immagine
start_rebuild:
	${export_env} && ${compose_local} up --build -d
	${start_backend}
