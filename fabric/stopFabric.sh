#!/bin/bash

# Change directory to the location of the script
cd "$(dirname "${BASH_SOURCE[0]}")"

# Stop and remove containers, networks, and volumes
docker-compose -f docker-compose.yaml down --volumes --remove-orphans

echo "Network stopped successfully"
