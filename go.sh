#!/bin/bash

# Used to start the IoT service
# Parameter $! is the config.js file (currently pi-config.js)

CONFIG=$1 /usr/bin/node --inspect /home/iot/Hollies_IoT/IOT.js