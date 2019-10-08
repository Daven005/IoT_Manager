#!/bin/bash
name=$(</etc/hostname)
echo xxx $name yyy
#mysqldump iot --skip-opt --ignore-table=iot.temperaturelog --ignore-table=iot.sessions -p >/hdd1/mysql-data/iot.sql