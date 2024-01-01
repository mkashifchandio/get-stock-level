import path from "path";
import fileUtils from "../utils/file.utils";
import { ItemTransactionRecord } from "../interfaces/ItemTransactionRecord.interface";

const transactionsFilePath = path.resolve(
  __dirname,
  "./../../data/transactions.json"
);

export class TransactionProvider {
  static readonly filePath: string = transactionsFilePath;

  static async getTransactions(): Promise<ItemTransactionRecord[]> {
    const files = await fileUtils.readFiles([TransactionProvider.filePath]);
    return JSON.parse(files[0]);
  }

  static async getItemTransactions(
    sku: string
  ): Promise<ItemTransactionRecord[]> {
    const allTransactions: ItemTransactionRecord[] =
      await TransactionProvider.getTransactions();

    const filteredItemTransactions = allTransactions.filter(
      (transaction: ItemTransactionRecord) => transaction.sku === sku
    );

    return filteredItemTransactions;
  }
}
