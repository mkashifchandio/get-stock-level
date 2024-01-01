import path from "path";
import fileUtils from "../utils/file.utils";
import { Item } from "../interfaces/Item.interface";

const stockFilePath = path.resolve(__dirname, "./../../data/stock.json");

export class StockProvider {
  static readonly filePath: string = stockFilePath;

  constructor() {}

  static async getItems(): Promise<Item[]> {
    const files = await fileUtils.readFiles([StockProvider.filePath]);
    return JSON.parse(files[0]);
  }

  static async getItem(sku: string): Promise<Item | undefined> {
    const items = await StockProvider.getItems();
    return items.find((item) => item.sku === sku);
  }
}
