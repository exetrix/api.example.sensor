import { DataRequest } from "../Input/DataRequest";

export class DataRequestValidator {
    validate(request: DataRequest): ValidationResponse {
        let messages: string[] = [];

        this.checkFieldIsSet(request.sensorId, "sensorId", messages);
        this.checkFieldIsSet(request.time, "time", messages);

        return {
            valid: messages.length === 0,
            messages
        }
    }

    protected checkFieldIsSet(value: any, field: string, messages: string[]) {
        if (value === undefined) {
            messages.push(`Field (${field}) is not set`);
        }
    }
}

export interface ValidationResponse {
    valid: boolean,
    messages: string[]
}