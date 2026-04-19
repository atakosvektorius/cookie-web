#!/bin/bash

mkdir -p _DATA




################################ DBGATE AUTH AUTOSETUP ##################################
# Only generate if DBGATE_PASSWORD doesn't exist in .env
if [ ! -f .env ] || ! grep -q "^DBGATE_PASSWORD=" .env; then
    echo "Generating DBGATE credentials..."
    DBGATE_PASSWORD="$(openssl rand -hex 32)"

    # Only add newline if file doesn't end with one
    [ -f .env ] && [ -n "$(tail -c1 .env 2>/dev/null)" ] && echo "" >> .env
    echo "DBGATE_PASSWORD=$DBGATE_PASSWORD" >> .env
    echo "DBGATE credentials added to .env"
fi
#########################################################################################




sudo docker-compose down
sudo docker-compose up -d --build
