export type SortDirection = "ascending" | "descending";
export type SortKey = string; // This makes it compatible with any string

export type SortConfig = {
  key: SortKey;
  direction: SortDirection;
};
