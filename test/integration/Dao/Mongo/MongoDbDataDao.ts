import { MongoDbDataDaoFactory } from '../../../../src/Dao/Mongo/MongoDbDataDaoFactory';
import { MongoDbClientFactory } from '../../../../src/Dao/Mongo/MongoDbClientFactory';
import { MongoDbDataDao } from "../../../../src/Dao/Mongo/MongoDbDataDao";
import { createHash } from 'crypto';
import { MongoClient } from 'mongodb';
import { assert, expect } from 'chai';

describe.skip("When using the mongodb dao", () => {
    const uri = "mongodb://localhost:27017";

    const sensorId = "SomeSensorId";
    const timestamp = 1234;

    let collectionName: string;

    let mongoClient: MongoClient;
    let dao: MongoDbDataDao;

    beforeEach(async () => {

        let clientFactory = new MongoDbClientFactory();

        collectionName = createUniqueCollectionName();

        mongoClient = clientFactory.create(uri);
        dao = await new MongoDbDataDaoFactory().create(mongoClient, collectionName);
    });

    it("should write the metric successfully without throwing an error", async () => {
        await dao.put(sensorId, timestamp, 1.1);
    });

    it("should write the metric successfully and indicate the metric already exists", async () => {
        assert.isTrue(await dao.put(sensorId, timestamp, 1.1));
        assert.isFalse(await dao.put(sensorId, timestamp, 1.1));
    });

    it("should return the expected results", async () => {

        let lowerLimit = new Date("2020-09-08T14:51:00Z").getTime() / 1000;
        let upperLimit = new Date("2020-09-08T14:51:01Z").getTime() / 1000;

        let outsideLimit = upperLimit + 1;

        await Promise.all([
            dao.put(sensorId, lowerLimit, 1),
            dao.put(sensorId, lowerLimit, 2),
            dao.put(sensorId, upperLimit, 5),
            dao.put(sensorId, outsideLimit, 10)
        ]);

        let result = await dao.get(sensorId, lowerLimit, outsideLimit);

        expect(result).is.an("array").with.lengthOf(2);
    });

    function createUniqueCollectionName() {
        return "sensor-" + createHash('md5').update(new Date().getTime().toString()).digest("hex").slice(0, 5);
    }

    afterEach(async () => {
        let database = mongoClient.db("timeseries");
        await database.collection(collectionName).drop();
    })

    after(async () => {
        await mongoClient.close();
    });
});