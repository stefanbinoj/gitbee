export type DocKey = "readme" | "contributing" | "code_of_conduct" | "security";
export const DEFAULT_TARGETS: DocKey[] = [
  "readme",
  "contributing",
  "code_of_conduct",
  "security",
];

export const COMMON_DIRS = ["", ".github", "docs"]; // check in this order

export const maxDepth = 3;

// Chunking configuration (in tokens)
export const MAX_CHUNK_TOKENS = 512; // ~2000 characters - balanced for documentation
export const CHUNK_OVERLAP_TOKENS = 100; // ~20% overlap for context continuity
export const MIN_SECTION_TOKENS = 10; // Skip sections with fewer tokens than this
