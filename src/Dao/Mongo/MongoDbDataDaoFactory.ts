import { MongoClient, Db, Collection } from "mongodb";
import { MongoDbDataDao } from "./MongoDbDataDao";

export class MongoDbDataDaoFactory {
    async create(client: MongoClient, collectionName: string) {
        await client.connect();

        let database = client.db("timeseries");

        return new MongoDbDataDao(await this.getCollection(database, collectionName));
    }

    protected async getCollection(database: Db, name: string) {

        if (this.collectionExists(await database.collections(), name)) {
            return database.collection(name);
        }

        return await database.createCollection(
            "sensor",
            {
                timeseries: {
                    timeField: "timestamp",
                    metaField: "sensorId",
                    granularity: "seconds"
                 }
            }
        );
    }

    protected async collectionExists(collections: Collection<any>[], name: string) {
        return collections.find(collection => collection.collectionName === name);
    }
}