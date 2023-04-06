#!/bin/bash

# Change directory to the location of the script
cd "$(dirname "${BASH_SOURCE[0]}")"

# Bring up the network
docker-compose -f docker-compose.yaml up -d

# Wait for the network to start
echo "Waiting for the network to start..."
sleep 10

# Create and join the channel
echo "Creating and joining channel..."
docker exec cli peer channel create -o orderer.example.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx --tls --cafile /etc/hyperledger/orderer/tls/ca.crt
docker exec cli peer channel join -b mychannel.block --tls --cafile /etc/hyperledger/orderer/tls/ca.crt

# Install and instantiate the chaincode
echo "Installing and instantiating chaincode..."
docker exec cli peer chaincode install -n mycc -v 1.0 -p /opt/gopath/src/github.com/chaincode/
docker exec cli peer chaincode instantiate -o orderer.example.com:7050 --tls --cafile /etc/hyperledger/orderer/tls/ca.crt -C mychannel -n mycc -v 1.0 -c '{"Args":["init","a","100","b","200"]}' -P "OR('Org1MSP.member')" 

echo "Network started successfully"
