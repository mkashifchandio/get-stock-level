<h2>Problem Stetement</h2>

You are given two json files:

- stock.json: contains objects which represent the starting stock levels for given SKUS
- transactions.json: contains an array of transactions since the stock levels were recorded in `stock.json`
  The objective is to create a function which is able to return the current stock levels for a given SKU by combining the data in these two files. These are the requirements.
- The function must match the following signature: `(sku: string) => Promise<{ sku: string, qty: number }>`.
- The function must read from the `stock` and `transactions` files on each invocation (totals cannot be precomputed)
- The function must throw an error where the SKU does not exist in the `transactions.json` and `stock.json` file
- All code must be adequately tested
  Notes:
- Transactions may exist for SKUs which are not present in `stock.json`. It should be assumed that the starting quantity for these is 0.
- Functionality can be split into many files to help keep the project clear and organised

<h2>How to run</h2>

- Clone this repository using following command "git clone https://github.com/mkashifchandio/get-stock-level.git"
- Go to cloned "get-stock-level" folder and run command "npm install" to install depedencies
- Use any of the commands mentioned below

<h2>Scripts</h2>

**Run Tests Cases**

npm test

**Run Program**

npm start

note: You can go through using tests but if you want to execute the method directly than you can update sku param on line 72 of src/getCurrentStockLevels.ts and run following command "npm start" to execute that method.
