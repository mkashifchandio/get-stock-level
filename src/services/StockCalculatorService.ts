import StockServiceFactory from "../factories/StockServiceFactory";
import TransactionServiceFactory from "../factories/TransactionServiceFactory";

export default class StockCalculatorService {
  sku: string;

  constructor(sku: string) {
    this.sku = sku;
  }

  async getCurrentStockLevel(): Promise<{ sku: string; qty: number }> {
    const [stockFactory, transactionFactory] = await Promise.all([
      StockServiceFactory.create(this.sku),
      TransactionServiceFactory.create(this.sku),
    ]);

    // Throwing error if we can't find this sku in stock and transactions json files
    if (
      stockFactory.isItemStockExists() === false &&
      transactionFactory.isItemTransactionExists() === false
    ) {
      throw new Error(`Cant't find sku in both files.`);
    }

    const qty: number =
      stockFactory.getItemStockLevel() +
      transactionFactory.getItemTotalRefunds() -
      transactionFactory.getItemTotalOrders();

    return { sku: this.sku, qty };
  }
}
