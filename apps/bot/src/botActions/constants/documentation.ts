import type { DocKey } from "@/botActions/types";

/** Documentation files to fetch from repositories */
export const DEFAULT_TARGETS: DocKey[] = [
  "readme",
  "contributing",
  "code_of_conduct",
  "security",
];

/** Directories to search for documentation files (in order of priority) */
export const COMMON_DIRS = ["", ".github", "docs"];

/** Maximum recursion depth when following links in documentation */
export const MAX_LINK_DEPTH = 3;
