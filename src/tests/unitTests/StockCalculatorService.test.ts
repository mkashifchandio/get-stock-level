import chai, { expect } from "chai";
import sinon from "sinon";
import StockCalculatorService from "../../services/StockCalculatorService";
import StockServiceFactory from "../../factories/StockServiceFactory";
import TransactionServiceFactory from "../../factories/TransactionServiceFactory";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

describe("StockCalculatorService", () => {
  let stockFactoryStub: sinon.SinonStub;
  let transactionFactoryStub: sinon.SinonStub;

  beforeEach(() => {
    stockFactoryStub = sinon
      .stub(StockServiceFactory as any, "create")
      .resolves({
        sku: "item1",
        isItemStockExists: () => true,
        getItemStockLevel: () => 10,
      });
    transactionFactoryStub = sinon
      .stub(TransactionServiceFactory as any, "create")
      .resolves({
        sku: "item1",
        isItemTransactionExists: () => true,
        getItemTotalRefunds: () => 5,
        getItemTotalOrders: () => 2,
      });
  });

  afterEach(() => {
    stockFactoryStub.restore();
    transactionFactoryStub.restore();
  });

  describe("getCurrentStockLevel", () => {
    it("should call factories to create stock and transaction services", async () => {
      const stockCalculatorService = new StockCalculatorService("item1");
      await stockCalculatorService.getCurrentStockLevel();
      sinon.assert.calledWith(stockFactoryStub, "item1");
      sinon.assert.calledWith(transactionFactoryStub, "item1");
    });

    it("should throw an error if SKU is not found in both files", async () => {
      stockFactoryStub.returns({
        sku: "item1",
        isItemStockExists: () => false,
        getItemStockLevel: () => 0,
      });
      transactionFactoryStub.returns({
        sku: "item1",
        isItemTransactionExists: () => false,
        getItemTotalRefunds: () => 0,
        getItemTotalOrders: () => 0,
      });

      const stockCalculatorService = new StockCalculatorService("item1");
      await expect(
        stockCalculatorService.getCurrentStockLevel()
      ).to.be.rejectedWith("Cant't find sku in both files.");
    });

    it("should calculate the current stock level correctly", async () => {
      const stockCalculatorService = new StockCalculatorService("item1");
      const result = await stockCalculatorService.getCurrentStockLevel();
      expect(result).to.deep.equal({ sku: "item1", qty: 13 }); // 10 + 5 - 2
    });
  });
});
