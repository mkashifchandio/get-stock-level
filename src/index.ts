import path from "path";
import { promises as fsPromises } from "fs";
import { Stock } from "./interfaces/Stock";
import { Transaction } from "./interfaces/Transaction";
import { CurrentStockLevel } from "./interfaces/CurrentStockLevel";

// Method for loading json files
export async function loadFiles(): Promise<string[]> {
  try {
    const filePaths: string[] = [
      path.resolve(__dirname, "./../data/stock.json"),
      path.resolve(__dirname, "./../data/transactions.json"),
    ];

    return Promise.all([
      fsPromises.readFile(filePaths[0], "utf8"),
      fsPromises.readFile(filePaths[1], "utf8"),
    ]);
  } catch (error) {
    console.error("Error in reading files.", error);
    throw error;
  }
}

// Method for getting current stock levels
export async function getCurrentStockLevels(
  sku: string
): Promise<CurrentStockLevel> {
  try {
    const files: string[] = await loadFiles();

    const stocks: Stock[] = JSON.parse(files[0]);
    const transactions: Transaction[] = JSON.parse(files[1]);

    const filteredStock: Stock[] = stocks.filter((obj) => sku === obj.sku);
    const filteredTransaction: Transaction[] = transactions.filter(
      (obj) => sku === obj.sku
    );

    // Throwing error if we can't find this sku in stock and transactions json files
    if (filteredStock.length === 0 && filteredTransaction.length === 0) {
      throw new Error(`Cant't find sku in both files.`);
    }

    // Assuming stock as zero if no stock found in stock file against this sku
    const totalStock: number =
      filteredStock.length > 0 ? filteredStock[0].stock : 0;

    const [totalOrderQty, totalRefundQty]: [number, number] =
      filteredTransaction.reduce(
        ([orderTotal, refundTotal]: [number, number], item) => {
          return [
            orderTotal + (item.type === "order" ? item.qty : 0),
            refundTotal + (item.type === "refund" ? item.qty : 0),
          ];
        },
        [0, 0]
      );

    const qty: number = totalStock - (totalOrderQty - totalRefundQty);
    return { sku, qty };
  } catch (error: any) {
    console.error("Error in getting current stock level.", error);
    throw error;
  }
}

// Only for testing purpose (Can be executed by running following command "npm start")
// You can change sku parameter to check other sku

getCurrentStockLevels("IZP721309/74/90").then((response) => {
  console.log(response);
});
