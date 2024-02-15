import { waitForKeypress } from "./utility";
const playwright = require("playwright");

interface Transaction {
  orderNumber: number;
  numberOfItems: number;
  date: string;
  orderStatus: string;
  price: string;
}

export async function crawlPurchaseHistory(
  username: string,
  password: string
): Promise<void> {
  // Initialize chromium browser and page
  const browser = await playwright["chromium"].launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the ThriftBooks login page
    await page.goto("https://www.thriftbooks.com/account/login/");

    await page.waitForSelector('[class*="Input"]');
    // Fill in the login form and submit
    const emailInput = await page.$$('[id*="ExistingAccount_EmailAddress"]');
    console.log("**** email", emailInput.length);
    await emailInput[0].fill(username);
    const passwordInput = await page.$$('[id*="ExistingAccount_Password"]');
    console.log("**** passwrod", passwordInput.length);
    console.log(password);
    await passwordInput[0].fill(password);

    const loginButton = await page.$$(".LoginBox-submitButton > input");
    console.log("**** loginbutton", loginButton.length);
    console.log(loginButton);
    await loginButton[0].click();

    // Wait for the login to complete
    console.log("Logging in...");
    console.log(
      "Please allow the login through the ThriftBooks mobile app MFA."
    );
    console.log("Press any key to continue after allowing the log in.");

    await waitForKeypress();

    // Navigate to the ThriftBooks account transaction history page
    await page.goto("https://www.thriftbooks.com/account/ordersummary/");

    // Extract purchase history from the transaction history page
    const history: Transaction[] = await extractPurchaseHistory(page);

    // Print the formatted JSON array of transactions
    console.log("Order History: ", JSON.stringify(history, null, 2));
  } catch (error) {
    console.error(
      "Error occurred while crawling ThriftBooks transaction history:",
      error
    );
  } finally {
    // Close the browser
    await browser.close();
  }
}

async function extractPurchaseHistory(page: any): Promise<Transaction[]> {
  // Extract purchase history from the transaction history page
  // Extract book information from the search results
  const history: Transaction[] = await page.evaluate(() => {
    const historyElements = Array.from(
      document.querySelectorAll(".AccountOrderSummary-orderRow")
    );

    return historyElements.map((element) => {
      const orderNumber = Number(
        element
          .querySelector(
            ".AccountOrderSummary-orderNumber > .AccountOrderSummary-orderData > a"
          )
          ?.textContent?.trim()
          .replace(/\n|\t/g, "") || "Missing Order Number"
      );
      const numberOfItems =
        element
          .querySelector(
            ".AccountOrderSummary-orderNumItems > .AccountOrderSummary-orderData"
          )
          ?.textContent?.trim()
          .replace(/\t|/g, "")
          .replace(/\n\n/g, ", ") || "N/A";
      const date =
        element
          .querySelector(
            ".AccountOrderSummary-orderDate > .AccountOrderSummary-orderData"
          )
          ?.textContent?.trim() || "No Date Available";
      const orderStatus =
        element
          .querySelector(
            ".AccountOrderSummary-orderStatus > .AccountOrderSummary-orderData"
          )
          ?.textContent?.trim() || "Order Status Not Available";
      const price =
        element
          .querySelector(
            ".AccountOrderSummary-orderPrice > .AccountOrderSummary-orderData"
          )
          ?.textContent?.trim() || "No Price Available";

      return {
        orderNumber,
        numberOfItems,
        date,
        orderStatus,
        price,
      };
    });
  });

  return history;
}
