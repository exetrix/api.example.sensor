import { DataRecord } from "../Output/DataRecord";

export interface DataDaoInterface {
    put(sensorId: string, timestamp: number, value: number): Promise<boolean>;
    get(sensorId: string, lowerLimit: number, upperLimit: number): Promise<DataRecord[]>;
}