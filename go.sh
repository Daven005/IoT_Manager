#!/bin/bash

# Used to start the IoT service
# Parameter $1 is the config.json file (currently pi-config.json)
# --inspect used to enable debugger

CONFIG=$1 /usr/bin/node --inspect /home/iot/IoT_Manager/IOT.js
