import { DataDaoInterface } from "../Dao/DataDaoInterface";
import { DuplicateMetricError } from "../Error/DuplicateMetricError";
import { ValidationError } from "../Error/ValidationError";
import { DataRequest } from "../Input/DataRequest";
import { DataRequestValidator } from "../Validation/DataRequestValidator";

export class DataController {
    protected validator: DataRequestValidator;
    protected dao: DataDaoInterface;

    constructor(validator: DataRequestValidator, dao: DataDaoInterface) {
        this.validator = validator;
        this.dao = dao;
    }

    async put(request: DataRequest) {
        let validationResponse = this.validator.validate(request);

        if (!validationResponse.valid) {
            throw new ValidationError(validationResponse.messages);
        }

        let response = await this.dao.put(request.sensorId, request.time, request.value);

        if (response === false) {
            throw new DuplicateMetricError();
        }
    }

    get(sensorId: string, since: string, until: string) {
        return this.dao.get(sensorId, Date.parse(since) / 1000, Date.parse(until) / 1000);
    }
}