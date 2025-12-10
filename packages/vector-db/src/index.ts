import * as lancedb from "@lancedb/lancedb";
import * as arrow from "apache-arrow";

/** Embedding dimensions for text-embedding-3-small */
const EMBEDDING_DIMENSIONS = 1536;

const TABLE_NAME = "documentation_chunks";

console.log("LANCEDB_API_KEY:", process.env.LANCEDB_API_KEY);
export const vectorDb = await lancedb.connect({
  uri: "db://gitbee-6iajyo",
  apiKey: process.env.LANCEDB_API_KEY!,
  region: "us-east-1",
});

// Schema for documentation chunks with embeddings
const documentationSchema = new arrow.Schema([
  new arrow.Field("id", new arrow.Utf8(), false),
  new arrow.Field("text", new arrow.Utf8(), false),
  new arrow.Field(
    "vector",
    new arrow.FixedSizeList(
      EMBEDDING_DIMENSIONS,
      new arrow.Field("item", new arrow.Float32())
    ),
    false
  ),
  new arrow.Field("owner", new arrow.Utf8(), false),
  new arrow.Field("repo", new arrow.Utf8(), false),
  new arrow.Field("chunk_index", new arrow.Int32(), false),
  new arrow.Field("header_path", new arrow.Utf8(), false),
  new arrow.Field("doc_type", new arrow.Utf8(), false),
]);

// Initialize table
const tableNames = await vectorDb.tableNames();
console.log("Existing tables:", tableNames);
if (!tableNames.includes(TABLE_NAME)) {
  await vectorDb.createEmptyTable(TABLE_NAME, documentationSchema);
  console.log(`Table '${TABLE_NAME}' created successfully.`);
}

export interface ChunkData {
  id: string;
  text: string;
  vector: number[];
  owner: string;
  repo: string;
  chunk_index: number;
  header_path: string;
  doc_type: string;
}

export async function insertChunks(chunks: ChunkData[]): Promise<void> {
  if (chunks.length === 0) {
    console.log("[insertChunks] No chunks to insert");
    return;
  }

  const table = await vectorDb.openTable(TABLE_NAME);
  // Convert to record format for LanceDB
  const records = chunks.map((chunk) => ({
    id: chunk.id,
    text: chunk.text,
    vector: chunk.vector,
    owner: chunk.owner,
    repo: chunk.repo,
    chunk_index: chunk.chunk_index,
    header_path: chunk.header_path,
    doc_type: chunk.doc_type,
  }));
  await table.add(records);
  console.log(
    `[insertChunks] Inserted ${chunks.length} chunks into ${TABLE_NAME}`
  );
}

export async function deleteRepoChunks(
  owner: string,
  repo: string
): Promise<void> {
  const table = await vectorDb.openTable(TABLE_NAME);
  await table.delete(`owner = '${owner}' AND repo = '${repo}'`);
  console.log(`Deleted all chunks for ${owner}/${repo}`);
}

export async function searchSimilar(
  queryVector: number[],
  owner: string,
  repo: string,
  limit: number = 5,
  docType?: string
): Promise<ChunkData[]> {
  const table = await vectorDb.openTable(TABLE_NAME);

  let whereClause = `owner = '${owner}' AND repo = '${repo}'`;
  if (docType) {
    whereClause += ` AND doc_type = '${docType}'`;
  }

  const results = await table
    .vectorSearch(queryVector)
    .where(whereClause)
    .limit(limit)
    .toArray();

  return results as unknown as ChunkData[];
}

export async function repoHasChunks(
  owner: string,
  repo: string
): Promise<boolean> {
  const table = await vectorDb.openTable(TABLE_NAME);

  const results = await table
    .query()
    .where(`owner = '${owner}' AND repo = '${repo}'`)
    .limit(1)
    .toArray();

  return results.length > 0;
}
