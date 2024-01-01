import path from "path";
import sinon, { SinonStub } from "sinon";
import { promises as fsPromises } from "fs";
import { expect } from "chai";
import { getRemainingStock } from "../../index";
import { Item } from "../../interfaces/Item.interface";
import { ItemTransactionRecord } from "../../interfaces/ItemTransactionRecord.interface";

interface CurrentStockLevel {
  sku: string;
  qty: number;
}

const stockPath: string = path.resolve(__dirname, "./../../../data/stock.json");
const transactionsPath: string = path.resolve(
  __dirname,
  "./../../../data/transactions.json"
);

const mocks = {
  mockReadFile: (
    stock: Item[],
    transactions: ItemTransactionRecord[]
  ): SinonStub => {
    return sinon.stub(fsPromises, "readFile").callsFake(async (path) => {
      if (path === stockPath) {
        return JSON.stringify(stock);
      } else if (path === transactionsPath) {
        return JSON.stringify(transactions);
      } else {
        throw new Error("File not found");
      }
    });
  },
};

describe("getCurrentStockLevels - Integration Test", () => {
  describe("should return correct stock levels for a given SKU", () => {
    let mockReadFile: SinonStub;

    afterEach(() => {
      mockReadFile.restore();
    });

    [
      {
        label: `should Subtract sum of orders from total stock quantity`,
        sku: "LTV719449/39/39",
        stock: [
          {
            sku: "LTV719449/39/39",
            stock: 8000,
          },
        ],
        transactions: [
          { sku: "LTV719449/39/39", type: "order", qty: 5 },
          { sku: "LTV719449/39/39", type: "order", qty: 10 },
        ],
        expectedResponse: {
          sku: "LTV719449/39/39",
          qty: 7985,
        },
      },
      {
        label: `Should Add sum of refunds to total stock quantity`,
        sku: "LTV719449/39/39",
        stock: [
          {
            sku: "LTV719449/39/39",
            stock: 8000,
          },
        ],
        transactions: [
          { sku: "LTV719449/39/39", type: "refund", qty: 5 },
          { sku: "LTV719449/39/39", type: "refund", qty: 10 },
        ],
        expectedResponse: {
          sku: "LTV719449/39/39",
          qty: 8015,
        },
      },
      {
        label: `Should Add sum of orders and subtract sum of refunds to total stock quantity`,
        sku: "LTV719449/39/39",
        stock: [
          {
            sku: "LTV719449/39/39",
            stock: 8000,
          },
        ],
        transactions: [
          { sku: "LTV719449/39/39", type: "order", qty: 15 },
          { sku: "LTV719449/39/39", type: "order", qty: 10 },
          { sku: "LTV719449/39/39", type: "refund", qty: 5 },
          { sku: "LTV719449/39/39", type: "refund", qty: 10 },
        ],
        expectedResponse: {
          sku: "LTV719449/39/39",
          qty: 7990,
        },
      },
      {
        label: `Assume total stock as zero if no entry in stock file`,
        sku: "LTV719449/39/39",
        stock: [],
        transactions: [
          { sku: "LTV719449/39/39", type: "order", qty: 5 },
          { sku: "LTV719449/39/39", type: "order", qty: 10 },
          { sku: "LTV719449/39/39", type: "refund", qty: 20 },
          { sku: "LTV719449/39/39", type: "refund", qty: 30 },
        ],
        expectedResponse: {
          sku: "LTV719449/39/39",
          qty: 35,
        },
      },
    ].forEach((test) => {
      it(`${test.label}`, async () => {
        mockReadFile = mocks.mockReadFile(test.stock, test.transactions);
        const actualResult: CurrentStockLevel = await getRemainingStock(
          test.sku
        );
        expect(actualResult).to.deep.equal(test.expectedResponse);
      });
    });
  });

  describe("Error Cases", () => {
    let mockReadFile: SinonStub;

    afterEach(() => {
      mockReadFile.restore();
    });

    [
      {
        label: `Should throw error if sku doesn't exist in stock and transactions files`,
        sku: "LTV719449/39/39",
        stock: [],
        transactions: [],
        expectedResponse: {
          sku: "LTV719449/39/39",
          qty: 35,
        },
      },
    ].forEach((test) => {
      it(`${test.label}`, async () => {
        mockReadFile = mocks.mockReadFile(test.stock, test.transactions);

        try {
          await getRemainingStock(test.sku);
          expect.fail(`Unexpected success`);
        } catch (error: any) {
          expect(error).to.be.an.instanceof(Error);
          expect(error?.message).to.equal(`Cant't find sku in both files.`);
        }
      });
    });
  });

  describe("should throw error when file reading fails", () => {
    let mockReadFile: SinonStub;

    beforeEach(() => {
      mockReadFile = sinon
        .stub(fsPromises, "readFile")
        .rejects(new Error(`Unexpected error in reading file.`));
    });

    afterEach(() => {
      mockReadFile.restore();
    });

    it("should throw an error", async () => {
      try {
        await getRemainingStock("LTV719449/39/39");
        expect.fail("Promise should not have resolved");
      } catch (error: any) {
        expect(error).to.be.an.instanceof(Error);
        expect(error?.message).to.equal(`Unexpected error in reading file.`);
      }
    });
  });
});
