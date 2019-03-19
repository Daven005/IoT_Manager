#!/bin/bash -x
if [ -z "$1" ]; then
echo "Usage: copy <wkg || fbk> <1 || 2> [all]"
exit
fi
if [ "$EUID" -ne 0 ] ; then 
  echo "Please run as root"
  exit
fi
ERR=-
C=/home/iot/IoT_Manager/configs
if [ "$1" = "wkg" ] || [ "$1" = "fbk" ] ; then
    if [ "$2" = "1" ] || [ "$2" = "2" ] ; then
        cp $C/hosts.$1.$2 /etc/hosts
        cp $C/hostname.$2 /etc/hostname
        cp $C/dnsmasq.$1.conf /etc/dnsmasq.conf
        cp $C/dhcpcd.$1.$2.conf /etc/dhcpcd.conf
        cp $C/mosquitto.bridge.$1.conf /etc/mosquitton.conf.d
    else
        ERR="Bad IOT ($2) Should be 1 or 2"
    fi
else
    ERR="Bad type ($1) Should be wkg or fbk"
fi

if [ "$ERR" != "-" ] ; then
    echo $ERR
    exit 1
fi
if [ "$3" = "all" ] ; then
    cp $C/dnsmasq.blacklist.conf /etc/dnsmasq.d
    cp $C/dnsmasq.sethost.conf /etc/dnsmasq.d
    cp $C/50-server.cnf /etc/mysql/mariadb.conf.d
    cp $C/mariadb.cnf /etc/mysql
    cp $C/smb.conf /etc/samba
    cp $C/monitrc /etc/monit
    cp $C/mosquitto.conf /etc/mosquitto
    cp $C/dphys-swapfile /etc
    cp $C/node-red/settings.js /home/iot/.nodered
fi
if [ "$4" = "reboot" ] ; then
    reboot
elif [ "$4" = "shutdown" ] ; then
    shutdown now
else
    hostname -I
    hostname -A
fi
exit
