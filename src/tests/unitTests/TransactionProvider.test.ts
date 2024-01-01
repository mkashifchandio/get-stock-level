import { expect } from "chai";
import sinon from "sinon";
import { TransactionProvider } from "../../providers/TransactionProvider";
import { ItemTransactionRecord } from "../../interfaces/ItemTransactionRecord.interface";
import fileUtils from "../../utils/file.utils";

describe("TransactionProvider", () => {
  let fileUtilsStub: sinon.SinonStub;

  beforeEach(() => {
    fileUtilsStub = sinon
      .stub(fileUtils, "readFiles")
      .resolves(['[{"sku": "item1"}]']);
  });

  afterEach(() => {
    fileUtilsStub.restore();
  });

  describe("getTransactions", () => {
    it("should call fileUtils.readFiles with the correct path", async () => {
      await TransactionProvider.getTransactions();
      sinon.assert.calledWith(fileUtilsStub, [TransactionProvider.filePath]);
    });

    it("should parse the JSON content of the file", async () => {
      const transactions = await TransactionProvider.getTransactions();
      expect(transactions).to.deep.equal([
        { sku: "item1" } as ItemTransactionRecord,
      ]);
    });
  });

  describe("getItemTransactions", () => {
    it("should return transactions for the specified sku", async () => {
      const transactions = await TransactionProvider.getItemTransactions(
        "item1"
      );
      expect(transactions).to.deep.equal([
        { sku: "item1" } as ItemTransactionRecord,
      ]);
    });

    it("should return an empty array if no transactions match the sku", async () => {
      const transactions = await TransactionProvider.getItemTransactions(
        "item43"
      );
      expect(transactions).to.deep.equal([]);
    });
  });
});
