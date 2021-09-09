import { StubbedInstance, stubConstructor, stubInterface } from 'ts-sinon';
import { DataDaoInterface } from '../../../src/Dao/DataDaoInterface';
import { DataRequestValidator } from '../../../src/Validation/DataRequestValidator';
import { DataController } from '../../../src/Controller/DataController';
import { DataRequest } from '../../../src/Input/DataRequest';
import { assert, expect, use } from 'chai';
import { ValidationError } from '../../../src/Error/ValidationError';
import * as chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised);

describe("When using the data controller", () => {

    let request: DataRequest;
    let validator: StubbedInstance<DataRequestValidator>;
    let dao: StubbedInstance<DataDaoInterface>;

    let controller: DataController

    beforeEach(() => {
        request = stubInterface<DataRequest>();
        validator = stubConstructor(DataRequestValidator);
        dao = stubInterface<DataDaoInterface>();

        controller = new DataController(validator, dao);
    });

    it("should throw a validation error when the validation fails", async () => {

        validator.validate.withArgs(request).returns({
            valid: false,
            messages: ["a message"]
        });

        expect(controller.put(request)).to.be.rejectedWith(ValidationError);
    });

    it("should throw a validation error when the validation fails", async () => {
        let request: DataRequest = {
            sensorId: "SomeSensor",
            time: 1234,
            value: 1
        }

        validator.validate.returns({ valid: true } as any);

        dao.put.withArgs(request.sensorId, request.time, request.value).resolves(true);

        expect(controller.put(request)).eventually.be.undefined;
    });

    it("should throw a validation error when the validation fails", async () => {
        let request: DataRequest = {
            sensorId: "SomeSensor",
            time: 1234,
            value: 1
        }

        validator.validate.returns({ valid: true } as any);

        dao.put.withArgs(request.sensorId, request.time, request.value).resolves(true);

        expect(controller.put(request)).eventually.be.undefined;
    }); 

})