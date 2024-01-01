import { expect } from "chai";
import sinon from "sinon";
import fileUtils from "../../utils/file.utils";
import { TransactionProvider } from "./../../providers/TransactionProvider";

describe("TransactionProvider", () => {
  let fileUtilsStub: sinon.SinonStub;

  beforeEach(() => {
    fileUtilsStub = sinon
      .stub(fileUtils, "readFiles")
      .resolves([
        '[{"sku": "item1", "type": "order", "qty": 2}, {"sku": "item2", "type": "refund", "qty": 1}]',
      ]);
  });

  afterEach(() => {
    fileUtilsStub.restore();
  });

  describe("getTransactions", () => {
    it("should call fileUtils.readFiles with the correct path", async () => {
      await TransactionProvider.getTransactions();
      sinon.assert.calledWith(fileUtilsStub, [TransactionProvider.filePath]);
    });

    it("should parse the file contents into ItemTransactionRecord[]", async () => {
      const transactions = await TransactionProvider.getTransactions();
      expect(transactions).to.be.an("array");
      expect(transactions[0].sku).to.equal("item1");
      expect(transactions[0].type).to.equal("order");
      expect(transactions[0].qty).to.equal(2);
    });
  });

  describe("getItemTransactions", () => {
    it("should filter transactions by sku", async () => {
      const transactions = await TransactionProvider.getItemTransactions(
        "item1"
      );
      expect(transactions).to.have.lengthOf(1);
      expect(transactions[0].sku).to.equal("item1");
    });
  });
});
