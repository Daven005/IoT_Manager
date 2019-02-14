select OutsideTemp, LoungeTemp, O.time from (
select avg(T.value) as LoungeTemp, FROM_UNIXTIME( TRUNCATE(UNIX_TIMESTAMP(T.Time) / 300,0)*300) as time
from devices as D
inner join sensors as S on S.DeviceID = D.DeviceID
inner join temperaturelog as T on T.DeviceID = D.DeviceID and T.SensorID = S.SensorID
where D.location = 'lounge' and S.`Type` = 'temp'
and T.Time between  "2017-09-08" AND "2017-09-12"
GROUP BY UNIX_TIMESTAMP(T.Time) DIV 600) as L
inner join (
select avg(T.value) as OutsideTemp, FROM_UNIXTIME( TRUNCATE(UNIX_TIMESTAMP(T.Time) / 300,0)*300)as time
from devices as D
inner join sensors as S on D.DeviceID = S.DeviceID
inner join temperaturelog as T on T.DeviceID = D.DeviceID and T.SensorID = S.SensorID
where D.name = 'weather' and S.`Type` = 'temp'
and T.Time between  "2017-09-08" AND "2017-09-12"
GROUP BY UNIX_TIMESTAMP(T.Time) DIV 600) as O
on L.time = O.time
order by L.time