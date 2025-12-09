import * as lancedb from "@lancedb/lancedb";
import * as arrow from "apache-arrow";

console.log("LANCEDB_API_KEY:", process.env.LANCEDB_API_KEY);
export const vectorDb = await lancedb.connect({
  uri: "db://gitbee-6iajyo",
  apiKey: process.env.LANCEDB_API_KEY!,
  region: "us-east-1",
});

const schema = new arrow.Schema([
  new arrow.Field("id", new arrow.Int32()),
  new arrow.Field("name", new arrow.Utf8()),
]);

const tableNames = await vectorDb.tableNames();
console.log("Existing tables:", tableNames);
if (!tableNames.includes("mdTable")) {
  await vectorDb.createEmptyTable("mdTable", schema);
  console.log("Table 'mdTable' created successfully.");
}
