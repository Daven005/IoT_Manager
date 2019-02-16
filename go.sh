#!/bin/bash

# Used to start the IoT service
# Parameter $! is the config.json file (currently pi-config.json)

CONFIG=$1 /usr/bin/node --inspect /home/iot/Hollies_IoT/IOT.js