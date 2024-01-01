import TransactionService from "../services/TransactionService";

export default class StockServiceFactory {
  static async create(sku: string): Promise<TransactionService> {
    const transactionServiceInstance = new TransactionService(sku);
    await transactionServiceInstance.initialize();

    return transactionServiceInstance;
  }
}
