import { MongoDbClientFactory } from "../Dao/Mongo/MongoDbClientFactory";
import { MongoDbDataDaoFactory } from "../Dao/Mongo/MongoDbDataDaoFactory";
import { DataController } from "./DataController";
import { IConfig } from 'config';
import { DataRequestValidator } from "../Validation/DataRequestValidator";

export class DataControllerFactory {
    protected instance: DataController;

    protected config: IConfig;
    protected clientFactory: MongoDbClientFactory;
    protected daoFactory: MongoDbDataDaoFactory;

    constructor(config: IConfig, clientFactory: MongoDbClientFactory, daoFactory: MongoDbDataDaoFactory) {
        this.config = config;
        this.clientFactory = clientFactory;
        this.daoFactory = daoFactory;
    }

    async create() {
        let client = this.clientFactory.create(this.config.get<string>("database.mongo.uri"));
        let dao = await this.daoFactory.create(client, this.config.get<string>("database.mongo.collection"));
        
        return new DataController(new DataRequestValidator(), dao);
    }

    async getOrCreate() {
        if (this.instance === undefined) {
            this.instance = await this.create();
        }

        return this.instance;
    }
}