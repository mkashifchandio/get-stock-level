import { expect } from "chai";
import sinon from "sinon";
import StockServiceFactory from "../../factories/StockServiceFactory";
import StockService from "../../services/StockService";

describe("StockServiceFactory", () => {
  let stockServiceInstanceStub: sinon.SinonStub;

  beforeEach(() => {
    stockServiceInstanceStub = sinon
      .stub(StockService.prototype, "initialize")
      .resolves();
  });

  afterEach(() => {
    stockServiceInstanceStub.restore();
  });

  describe("create", () => {
    it("should create a new instance of StockService", async () => {
      const stockServiceInstance = await StockServiceFactory.create("item1");
      expect(stockServiceInstance).to.be.instanceOf(StockService);
    });

    it("should call initialize on the created instance", async () => {
      await StockServiceFactory.create("item1");
      sinon.assert.calledWith(stockServiceInstanceStub);
    });

    it("should return the initialized StockService instance", async () => {
      const stockServiceInstance = await StockServiceFactory.create("item1");
      expect(stockServiceInstance).to.equal(
        stockServiceInstanceStub.thisValues[0] as StockService
      );
    });
  });
});
