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
        cp $C/dhcpcd.$1.$2.conf /etc/dhcpcd.conf
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
    cp $C/dnsmasq.conf /etc
    cp $C/dnsmasq.blacklist.conf /etc
    cp $C/50-server.cnf /etc/mysql/mariadb.conf.d
    cp $C/mariadb.cnf /etc/mysql
    cp $C/smb.conf /etc/samba
    cp $C/monitrc /etc/monit
    cp $C/mosquitto.conf /etc/mosquitto
fi
hostname -I
hostname -A
exit
