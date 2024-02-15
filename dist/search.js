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
exports.crawlThriftBooksStore = void 0;
const playwright = require("playwright");
function crawlThriftBooksStore(searchString) {
    return __awaiter(this, void 0, void 0, function* () {
        // Crawling ThriftBooks store based on search string
        // Initialize chromium browser and page
        const browser = yield playwright["chromium"].launch({ headless: false });
        const context = yield browser.newContext();
        const page = yield context.newPage();
        try {
            // Navigate to the ThriftBooks store search page
            yield page.goto(`https://www.thriftbooks.com/browse/?b.search=${encodeURIComponent(searchString)}`);
            // Extract book information from the search results
            const books = yield extractBooks(page);
            // Print the formatted JSON array of books
            console.log("array of books", JSON.stringify(books, null, 2));
        }
        catch (error) {
            console.error("Error occurred while crawling ThriftBooks store:", error);
        }
        finally {
            // Close the browser
            // await browser.close();
        }
    });
}
exports.crawlThriftBooksStore = crawlThriftBooksStore;
function extractBooks(page) {
    return __awaiter(this, void 0, void 0, function* () {
        // Extract book information from the search results
        const books = yield page.evaluate(() => {
            const bookElements = Array.from(document.querySelectorAll(".SearchContentResults-tilesContainer"));
            console.log("bookElements", bookElements.length);
            // //filter so that we are only considering books and not music or other content
            // bookElements.filter(
            //   (element) =>
            //     element.querySelector(".platform_img.win") !== null ||
            //     element.querySelector(".platform_img.mac") !== null ||
            //     element.querySelector(".platform_img.linux") !== null
            // );
            return bookElements.map((element) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                const name = ((_b = (_a = element.querySelector(".title")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || "Missing Title";
                const price = ((_d = (_c = element.querySelector(".discount_final_price")) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim()) ||
                    "No Price Available";
                const originalPrice = ((_f = (_e = element
                    .querySelector(".discount_original_price")) === null || _e === void 0 ? void 0 : _e.textContent) === null || _f === void 0 ? void 0 : _f.trim()) || "N/A";
                const salePercent = ((_h = (_g = element.querySelector(".discount_pct")) === null || _g === void 0 ? void 0 : _g.textContent) === null || _h === void 0 ? void 0 : _h.trim()) ||
                    "Not on Sale";
                const link = element.getAttribute("href") || "No Link Available";
                return {
                    name,
                    price,
                    link,
                    originalPrice,
                    salePercent,
                };
            });
        });
        return books;
    });
}
