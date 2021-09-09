import { MongoClient } from "mongodb";

export class MongoDbClientFactory {
    create(url: string) {
        return new MongoClient(url);
    }
}