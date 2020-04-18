select sensors.name, format(avg(value), 1) as value, date_format(min(time), '%Y-%m-%d %H:%i') as time  from temperaturelog 
inner join sensors on temperaturelog.SensorID = sensors.sensorID   and temperaturelog.DeviceID = sensors.DeviceID
where ((sensors.DeviceID = "Hollies139e26" and (sensors.SensorID = 4 or sensors.SensorID = 1))
or  (sensors.DeviceID = "Hollies7e600a" and sensors.SensorID = 1))
and Time >= curdate() - interval 1 day
group by name, FLOOR(UNIX_TIMESTAMP(time)/(30 * 60))