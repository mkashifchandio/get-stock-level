import { expect } from "chai";
import sinon from "sinon";
import { StockProvider } from "../../providers/StockProvider";
import StockService from "../../services/StockService";

describe("StockService", () => {
  let stockProviderStub: sinon.SinonStub;

  beforeEach(() => {
    stockProviderStub = sinon
      .stub(StockProvider, "getItem")
      .resolves({ sku: "item1", stock: 10 });
  });

  afterEach(() => {
    stockProviderStub.restore();
  });

  describe("initialize", () => {
    it("should call getItem to fetch item details", async () => {
      const stockService = new StockService("item1");
      await stockService.initialize();
      sinon.assert.calledWith(stockProviderStub, "item1");
    });

    it("should set itemExists to true if item is found", async () => {
      const stockService = new StockService("item1");
      await stockService.initialize();
      expect(stockService.itemExists).to.be.true;
    });

    it("should update item with fetched details", async () => {
      const stockService = new StockService("item1");
      await stockService.initialize();
      expect(stockService.item).to.deep.equal({ sku: "item1", stock: 10 });
    });
  });

  describe("getItemStockLevel", () => {
    it("should return the stock level of the item", async () => {
      const stockService = new StockService("item1");
      await stockService.initialize();
      expect(stockService.getItemStockLevel()).to.equal(10);
    });
  });

  describe("isItemStockExists", () => {
    it("should return true if the item exists", async () => {
      const stockService = new StockService("item1");
      await stockService.initialize();
      expect(stockService.isItemStockExists()).to.be.true;
    });

    it("should return false if the item does not exist", async () => {
      stockProviderStub.resolves(undefined);
      const stockService = new StockService("item42");
      await stockService.initialize();
      expect(stockService.isItemStockExists()).to.be.false;
    });
  });
});
