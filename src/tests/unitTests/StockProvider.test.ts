import { expect } from "chai";
import sinon from "sinon";
import { StockProvider } from "../../providers/StockProvider";
import { Item } from "../../interfaces/Item.interface";
import fileUtils from "../../utils/file.utils";

describe("StockProvider", () => {
  let fileUtilsStub: sinon.SinonStub;

  beforeEach(() => {
    fileUtilsStub = sinon
      .stub(fileUtils, "readFiles")
      .resolves(['[{"sku": "item1"}]']);
  });

  afterEach(() => {
    fileUtilsStub.restore();
  });

  describe("getItems", () => {
    it("should call fileUtils.readFiles with the correct path", async () => {
      await StockProvider.getItems();
      sinon.assert.calledWith(fileUtilsStub, [StockProvider.filePath]);
    });

    it("should parse the JSON content of the file", async () => {
      const items = await StockProvider.getItems();
      expect(items).to.deep.equal([{ sku: "item1" } as Item]);
    });
  });

  describe("getItem", () => {
    it("should return the item with the specified sku", async () => {
      const item = await StockProvider.getItem("item1");
      expect(item).to.deep.equal({ sku: "item1" } as Item);
    });

    it("should return undefined if no item matches the sku", async () => {
      const item = await StockProvider.getItem("item42");
      expect(item).to.be.undefined;
    });
  });
});
