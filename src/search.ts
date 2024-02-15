import { waitForKeypress } from "./utility";
const playwright = require("playwright");

interface Book {
  name: string;
  price: string;
  author: string;
}

export async function crawlThriftBooksStore(
  searchString: string
): Promise<void> {
  // Crawling ThriftBooks store based on search string

  // Initialize chromium browser and page
  const browser = await playwright["chromium"].launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the ThriftBooks store search page
    await page.goto(
      `https://www.thriftbooks.com/browse/?b.search=${encodeURIComponent(
        searchString
      )}`
    );

    // Extract book information from the search results
    const books: Book[] = await extractBooks(page);

    // Print the formatted JSON array of books
    console.log("array of books", JSON.stringify(books, null, 2));
  } catch (error) {
    console.error("Error occurred while crawling ThriftBooks store:", error);
  } finally {
    // Close the browser
    await browser.close();
  }
}

async function extractBooks(page: any): Promise<Book[]> {
  // Extract book information from the search results
  const books: Book[] = await page.evaluate(() => {
    const bookElements = Array.from(
      document.querySelectorAll(".AllEditionsItem-tile")
    );
    console.log("bookElements", bookElements.length);

    return bookElements.map((element) => {
      const name =
        element
          .querySelector(".AllEditionsItem-tileTitle > a")
          ?.textContent?.trim() || "Missing Title";
      const price =
        element
          .querySelector(".SearchResultListItem-dollarAmount")
          ?.textContent?.trim() || "No Price Available";
      const author =
        element
          .querySelector(".SearchResultListItem-bottomSpacing > a")
          ?.textContent?.trim() || "No Author Available";

      return {
        name,
        price,
        author,
      };
    });
  });

  return books;
}
