// imports the command line arguments parser and the bookCrawler functions
const commandLineArgs = require("command-line-args");
import { crawlThriftBooksStore } from "./search";
import { crawlPurchaseHistory } from "./purchases";

// defines the command line arguments
const optionDefinitions = [
  { name: "mode", alias: "m", type: Number },
  { name: "searchString", alias: "s", type: String },
  { name: "username", alias: "u", type: String },
  { name: "password", alias: "p", type: String },
];

const options: any = commandLineArgs(optionDefinitions);

// checks the mode and calls the appropriate function
if (options.mode === 1 && options.searchString) {
  console.log("Crawling ThriftBooks Store for: " + options.searchString);
  crawlThriftBooksStore(options.searchString);
} else if (options.mode === 2 && options.username && options.password) {
  console.log("Crawling ThriftBooks Purchase History for: " + options.username);
  crawlPurchaseHistory(options.username, options.password);
  console.log("Crawled purchase history for: " + options.username);
} else {
  console.log("Invalid mode or missing required arguments.");
}
