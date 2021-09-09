import { assert, expect } from 'chai';
import { DataRequest } from '../../../src/Input/DataRequest';
import { DataRequestValidator } from '../../../src/Validation/DataRequestValidator';

describe("When using the data request validator", () => {

    let validator = new DataRequestValidator();

    it("should validate a record correctly", () => {

        let request: DataRequest = {
            sensorId: "SomeSensor",
            time: 12345,
            value: 1
        }

        let response = validator.validate(request);

        assert.isTrue(response.valid);
    });

    it("should fail validation if sensor id is missing", () => {

        let request: any = {
            time: 12345,
            value: 1
        }

        let response = validator.validate(request);

        assert.isFalse(response.valid);
        expect(response.messages).to.be.an("array").with.lengthOf(1);
    });

    it("should fail validation if time is missing", () => {

        let request: any = {
            sensorId: "SomeSensor",
            value: 1
        }

        let response = validator.validate(request);

        assert.isFalse(response.valid);
        expect(response.messages).to.be.an("array").with.lengthOf(1);
    });

    it("should fail validation if both time and sensor id are missing", () => {

        let request: any = {
            value: 1
        }

        let response = validator.validate(request);

        assert.isFalse(response.valid);
        expect(response.messages).to.be.an("array").with.lengthOf(2);
    });

})