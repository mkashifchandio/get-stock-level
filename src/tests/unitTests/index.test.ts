import { expect } from "chai";
import sinon, { SinonStub } from "sinon";
import { getRemainingStock } from "../../index";
import StockCalculatorService from "../../services/StockCalculatorService";

const mocks = {
  mockGetRemainingStock: (sku: string, qty: number): SinonStub => {
    return sinon
      .stub(StockCalculatorService.prototype, "getCurrentStockLevel")
      .resolves({ sku, qty });
  },
};

describe("index", () => {
  describe("getRemainingStock", () => {
    const expected: { sku: string; qty: number } = {
      sku: "testskuitem123",
      qty: 500,
    };

    afterEach(() => {
      sinon.restore();
    });

    it("should correctly retrieve remaining stock from StockCalculatorService", async () => {
      const getRemainingStockStub = mocks.mockGetRemainingStock(
        expected.sku,
        expected.qty
      );
      const result = await getRemainingStock(expected.sku);

      expect(result).to.deep.equal({ sku: expected.sku, qty: expected.qty });
      expect(getRemainingStockStub.calledOnce).to.be.true;
      expect(getRemainingStockStub.calledOnceWith()).to.be.true;
    });
  });
});
