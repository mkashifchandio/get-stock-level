import StockService from "../services/StockService";

export default class StockServiceFactory {
  static async create(sku: string): Promise<StockService> {
    const stockServiceInstance = new StockService(sku);
    await stockServiceInstance.initialize();

    return stockServiceInstance;
  }
}
