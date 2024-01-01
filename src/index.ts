import StockCalculatorService from "./services/StockCalculatorService";

export async function getRemainingStock(
  sku: string
): Promise<{ sku: string; qty: number }> {
  const stockCalculator = new StockCalculatorService(sku);
  return stockCalculator.getCurrentStockLevel();
}

// getRemainingStock("IZP721309/74/90").then((response) => {
//   console.log(response);
// });
