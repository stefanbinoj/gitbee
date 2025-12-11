/** Maximum tokens per chunk (~2000 characters) - balanced for documentation */
export const MAX_CHUNK_TOKENS = 256;

/** Token overlap between chunks (~20%) for context continuity */
export const CHUNK_OVERLAP_TOKENS = 50;

/** Minimum tokens required for a section to be included */
export const MIN_SECTION_TOKENS = 10;
