export type DocKey = "readme" | "contributing" | "code_of_conduct" | "security";
export const DEFAULT_TARGETS: DocKey[] = [
  "readme",
  "contributing",
  "code_of_conduct",
  "security",
];

export const COMMON_DIRS = ["", ".github", "docs", "guides"]; // check in this order

export const maxDepth = 3;
