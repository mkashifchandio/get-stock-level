import { expect } from "chai";
import sinon from "sinon";
import { ItemTransactionRecord } from "../../interfaces/ItemTransactionRecord.interface";
import { TransactionProvider } from "../../providers/TransactionProvider";
import TransactionService from "../../services/TransactionService";

describe("TransactionService", () => {
  let transactionProviderStub: sinon.SinonStub;

  beforeEach(() => {
    transactionProviderStub = sinon
      .stub(TransactionProvider, "getItemTransactions")
      .resolves([
        { sku: "item1", type: "order", qty: 2 },
        { sku: "item1", type: "refund", qty: 1 },
      ]);
  });

  afterEach(() => {
    transactionProviderStub.restore();
  });

  describe("initialize", () => {
    it("should call getItemTransactions to fetch transactions", async () => {
      const transactionService = new TransactionService("item1");
      await transactionService.initialize();
      sinon.assert.calledWith(transactionProviderStub, "item1");
    });

    it("should set transactionExists to true if transactions are found", async () => {
      const transactionService = new TransactionService("item1");
      await transactionService.initialize();
      expect(transactionService.transactionExists).to.be.true;
    });

    it("should calculate total orders and refunds", async () => {
      const transactionService = new TransactionService("item1");
      await transactionService.initialize();
      expect(transactionService.totalOrders).to.equal(2);
      expect(transactionService.totalRefunds).to.equal(1);
    });
  });

  describe("isItemTransactionExists", () => {
    it("should return true if transactions exist", async () => {
      const transactionService = new TransactionService("item1");
      await transactionService.initialize();
      expect(transactionService.isItemTransactionExists()).to.be.true;
    });

    it("should return false if no transactions exist", async () => {
      transactionProviderStub.resolves([]);
      const transactionService = new TransactionService("item42");
      await transactionService.initialize();
      expect(transactionService.isItemTransactionExists()).to.be.false;
    });
  });

  describe("getItemTotalOrders", () => {
    it("should return the total number of orders", async () => {
      const transactionService = new TransactionService("item1");
      await transactionService.initialize();
      expect(transactionService.getItemTotalOrders()).to.equal(2);
    });
  });

  describe("getItemTotalRefunds", () => {
    it("should return the total number of refunds", async () => {
      const transactionService = new TransactionService("item1");
      await transactionService.initialize();
      expect(transactionService.getItemTotalRefunds()).to.equal(1);
    });
  });
});
