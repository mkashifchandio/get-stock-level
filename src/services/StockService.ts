import { Item } from "../interfaces/Item.interface";
import { StockProvider } from "../providers/StockProvider";

export default class StockService {
  sku: string;
  item: Item;
  itemExists: boolean = false;

  constructor(sku: string) {
    this.sku = sku;
    this.item = { sku, stock: 0 };
  }

  // StockServiceFactory is creating Instance of this class and Initializing using following method
  async initialize(): Promise<void> {
    this.item = await this.getItem();
  }

  private async getItem(): Promise<Item> {
    const itemObj = await StockProvider.getItem(this.sku);
    this.itemExists = itemObj ? true : false;

    return {
      sku: this.sku,
      stock: itemObj?.stock ? itemObj.stock : 0,
    };
  }

  getItemStockLevel(): number {
    return this.item.stock;
  }

  isItemStockExists(): boolean {
    return this.itemExists;
  }
}
