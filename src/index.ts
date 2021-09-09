import * as express from 'express';
import { json } from 'body-parser';
import * as config from 'config';
import { DataControllerFactory } from './Controller/DataControllerFactory';
import { MongoDbClientFactory } from './Dao/Mongo/MongoDbClientFactory';
import { MongoDbDataDaoFactory } from './Dao/Mongo/MongoDbDataDaoFactory';
import { ValidationError } from './Error/ValidationError';
import { HttpStatusCodeError } from './Error/HttpStatusCodeError';
import { HttpStatusCode } from './Output/HttpStatusCode';
import { DuplicateMetricError } from './Error/DuplicateMetricError';

const controllerFactory = new DataControllerFactory(
    config,
    new MongoDbClientFactory(),
    new MongoDbDataDaoFactory()
);

const app = express();

app.use(json());

app.put(
    '/data',
    async (req, res, next) => {

        let controller = await controllerFactory.getOrCreate();

        try {
            return res.status(HttpStatusCode.NO_CONTENT).send(await controller.put(req.body));
        } catch (error) {
            if (error instanceof ValidationError) {
                return next(new HttpStatusCodeError("Validation failed for metric", HttpStatusCode.BAD_REQUEST, { messages: error.messages }));
            } else if (error instanceof DuplicateMetricError) {
                return next(new HttpStatusCodeError("Duplicate metric encountered", HttpStatusCode.CONFLICT));
            }

            return next(error);
        }
    }
);

app.get(
    '/data',
    async (req, res) => {
        let controller = await controllerFactory.getOrCreate();

        return res.status(HttpStatusCode.OK).send(await controller.get(req.query.sensorId as string, req.query.since as string, req.query.until as string));
    }
);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof HttpStatusCodeError) {
        res.status(err.code).send({ message: err.message, ...err.meta });
    } else {
        res.status(500).send({ message: "Internal server error" });
    }

    next(err);
});

app.listen(3000, () => console.log("Service started!"));