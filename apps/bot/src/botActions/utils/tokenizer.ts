import { get_encoding } from "tiktoken";

// Initialize tokenizer (cl100k_base is used by text-embedding-3-small)
const tokenizer = get_encoding("cl100k_base");

export function countTokens(text: string): number {
  return tokenizer.encode(text).length;
}

/**
 * Encode text to token array
 */
export function encodeText(text: string): Uint32Array {
  return tokenizer.encode(text);
}

/**
 * Decode tokens back to text
 */
export function decodeTokens(tokens: Uint32Array): string {
  return new TextDecoder().decode(tokenizer.decode(tokens));
}
