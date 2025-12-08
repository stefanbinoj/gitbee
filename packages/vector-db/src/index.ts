import * as lancedb from "@lancedb/lancedb"

export const vectorDb = await lancedb.connect({
  uri: "db://gitbee-6iajyo",
  apiKey: process.env.LANCEDB_API_KEY!,
  region: "us-east-1"
});


async function example1(db: string, tableName: string) {
  const data = [
    { vector: [3.1, 4.1], item: "foo", price: 10.0 },
    { vector: [5.9, 26.5], item: "bar", price: 20.0 },
  ];
  // Replace the table name with your table name.
  const tbl = await db.createTable(tableName, data, { mode: "overwrite" });
}
