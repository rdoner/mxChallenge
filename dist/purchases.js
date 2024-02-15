"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crawlPurchaseHistory = void 0;
const utility_1 = require("./utility");
const playwright = require("playwright");
function crawlPurchaseHistory(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        // Initialize chromium browser and page
        const browser = yield playwright["chromium"].launch({ headless: false });
        const context = yield browser.newContext();
        const page = yield context.newPage();
        try {
            // Navigate to the ThriftBooks login page
            yield page.goto("https://www.thriftbooks.com/account/login/");
            yield page.waitForSelector('[class*="Input"]');
            // Fill in the login form and submit
            const emailInput = yield page.$$('[id*="ExistingAccount_EmailAddress"]');
            console.log("**** email", emailInput.length);
            yield emailInput[0].fill(username);
            const passwordInput = yield page.$$('[id*="ExistingAccount_Password"]');
            console.log("**** passwrod", passwordInput.length);
            console.log(password);
            yield passwordInput[0].fill(password);
            const loginButton = yield page.$$(".LoginBox-submitButton > input");
            console.log("**** loginbutton", loginButton.length);
            console.log(loginButton);
            yield loginButton[0].click();
            // Wait for the login to complete
            console.log("Logging in...");
            console.log("Please allow the login through the ThriftBooks mobile app MFA.");
            console.log("Press any key to continue after allowing the log in.");
            yield (0, utility_1.waitForKeypress)();
            // Navigate to the ThriftBooks account transaction history page
            yield page.goto("https://www.thriftbooks.com/account/ordersummary/");
            // Extract purchase history from the transaction history page
            const history = yield extractPurchaseHistory(page);
            // Print the formatted JSON array of transactions
            console.log("history", JSON.stringify(history, null, 2));
        }
        catch (error) {
            console.error("Error occurred while crawling ThriftBooks transaction history:", error);
        }
        finally {
            // Close the browser
            yield browser.close();
        }
    });
}
exports.crawlPurchaseHistory = crawlPurchaseHistory;
function extractPurchaseHistory(page) {
    return __awaiter(this, void 0, void 0, function* () {
        // Extract purchase history from the transaction history page
        // Extract book information from the search results
        const history = yield page.evaluate(() => {
            const historyElements = Array.from(document.querySelectorAll(".AccountOrderSummary-orderRow"));
            return historyElements.map((element) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                const orderNumber = ((_b = (_a = element
                    .querySelector(".AccountOrderSummary-orderNumber > .AccountOrderSummary-orderData > a")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim().replace(/\n|\t/g, "")) || "Missing Title";
                const numberOfItems = ((_d = (_c = element
                    .querySelector(".AccountOrderSummary-orderNumItems > .AccountOrderSummary-orderData")) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim().replace(/\t|/g, "").replace(/\n\n/g, ", ")) || "No Type Available";
                const date = ((_f = (_e = element
                    .querySelector(".AccountOrderSummary-orderDate > .AccountOrderSummary-orderData")) === null || _e === void 0 ? void 0 : _e.textContent) === null || _f === void 0 ? void 0 : _f.trim()) || "No Date Available";
                const orderStatus = ((_h = (_g = element
                    .querySelector(".AccountOrderSummary-orderStatus > .AccountOrderSummary-orderData")) === null || _g === void 0 ? void 0 : _g.textContent) === null || _h === void 0 ? void 0 : _h.trim()) || "Balance Change Not Available";
                const price = ((_k = (_j = element
                    .querySelector(".AccountOrderSummary-orderPrice > .AccountOrderSummary-orderData")) === null || _j === void 0 ? void 0 : _j.textContent) === null || _k === void 0 ? void 0 : _k.trim()) || "No Balance Available";
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
    });
}
