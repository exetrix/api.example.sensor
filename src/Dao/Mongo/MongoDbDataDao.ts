import { createHash } from "crypto";
import { Collection, MongoClient, ObjectId } from "mongodb";
import { DataRequest } from "../../Input/DataRequest";
import { DataRecord } from "../../Output/DataRecord";
import { DataDaoInterface } from "../DataDaoInterface";

export class MongoDbDataDao implements DataDaoInterface {
    protected collection: Collection;

    constructor(collection: Collection) {
        this.collection = collection;
    }

    async put(sensorId: string, timestamp: number, value: number): Promise<boolean> {

        let response = await this.collection.updateOne(
            {
                _id: this.getId(sensorId, timestamp)
            },
            {
                $set: {
                    metadata: [{ sensorId }],
                    timestamp: this.timestampToDate(timestamp),
                    value
                }
            },
            {
                upsert: true
            }
        );

        return response.matchedCount === 0 ? true : false;
    }

    get(sensorId: string, lowerLimit: number, upperLimit: number) {
        return this.collection.find<DataRecord>(
            {
                metadata: { sensorId },
                timestamp: {
                    $gte: this.timestampToDate(lowerLimit),
                    $lt: this.timestampToDate(upperLimit)
                }
            }, {
            sort: { timestamp: 1 },
            projection: { _id: 0, timestamp: 1, value: 1 },
        }).toArray();
    }

    protected timestampToDate(timestamp: number) {
        return new Date(timestamp * 1000);
    }

    protected getId(sensorId: string, timestamp: number) {
        
        return new ObjectId(createHash("md5").update(`${sensorId}-${timestamp}`).digest("hex").slice(0, 12));
    }
}