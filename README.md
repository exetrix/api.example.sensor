![](https://github.com/exetrix/api.example.sensor/workflows/test/badge.svg)

# Dependencies
I have chosen to use a MongoDB timeseries collection to store the sensor data. Therefore, a mongo db instance is required to run as dependency. This can be started easily using docker: `docker run -d -p 27017:27017 mongo`. If there are already instances of mongo running, and you'd like to isolate this collection to a seaparate instance, feel free to change the port. The connection URI for mongo can be changed via an environment variable:

```
docker run -d -p 27018:27017 mongo
export DB_MONGO_URI="mongodb://localhost:27018"
npm run
```

# Running
```
docker run -d -p 27017:27017 mongo
npm run
```

# cURL
## PUT
```
curl -v -XPUT -H "Content-Type: application/json" -H "Accept: application/json" -d '{"sensorId": "SomeSensor", "time": 1599656400, "value": 1}' http://localhost:3000/data
```

## GET
```
curl -v -G -H "Content-Type: application/json" -H "Accept: application/json" http://localhost:3000/data --data-urlencode "sensorId=SomeSensor" --data-urlencode "since=2020-09-09T13:00:00Z" --data-urlencode "until=2020-09-09T13:30:00Z"
```

A dummy line