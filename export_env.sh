#!/bin/bash

# Percorso del file .env
ENV_FILE_PATH=".env"

# Controlla se il file .env esiste
if [ -f "$ENV_FILE_PATH" ]; then
  echo "Caricamento delle variabili d'ambiente dal file $ENV_FILE_PATH..."
  
  # Esporta le variabili d'ambiente nel file .env
  export $(grep -v '^#' "$ENV_FILE_PATH" | xargs)
  
  echo "Variabili d'ambiente esportate."
else
  echo "File .env non trovato nel percorso specificato: $ENV_FILE_PATH"
  exit 1
fi
