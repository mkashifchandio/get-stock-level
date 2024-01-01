import { TransactionProvider } from "../providers/TransactionProvider";
import { ItemTransactionRecord } from "../interfaces/ItemTransactionRecord.interface";

export default class TransactionService {
  sku: string;
  transactionExists: boolean = false;
  totalOrders: number = 0;
  totalRefunds: number = 0;

  constructor(sku: string) {
    this.sku = sku;
  }

  // TransactionServiceFactory is creating Instance of this class and Initializing using following method
  async initialize(): Promise<void> {
    const itemTransactions: ItemTransactionRecord[] =
      await this.getItemTransactions();

    this.transactionExists = itemTransactions.length > 0;

    const {
      totalOrders,
      totalRefunds,
    }: { totalOrders: number; totalRefunds: number } =
      this.calculateItemTotalOrdersAndRefunds(itemTransactions);

    this.totalOrders = totalOrders;
    this.totalRefunds = totalRefunds;
  }

  private async getItemTransactions(): Promise<ItemTransactionRecord[]> {
    return TransactionProvider.getItemTransactions(this.sku);
  }

  private calculateItemTotalOrdersAndRefunds(
    itemTransactions: ItemTransactionRecord[]
  ): {
    totalOrders: number;
    totalRefunds: number;
  } {
    const [totalOrders, totalRefunds]: [number, number] =
      itemTransactions.reduce(
        ([orderTotal, refundTotal]: [number, number], item) => {
          return [
            orderTotal + (item.type === "order" ? item.qty : 0),
            refundTotal + (item.type === "refund" ? item.qty : 0),
          ];
        },
        [0, 0]
      );

    return { totalOrders, totalRefunds };
  }

  isItemTransactionExists(): boolean {
    return this.transactionExists;
  }

  getItemTotalOrders(): number {
    return this.totalOrders;
  }

  getItemTotalRefunds(): number {
    return this.totalRefunds;
  }
}
