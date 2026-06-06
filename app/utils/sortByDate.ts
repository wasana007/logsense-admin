import type { LogDocument } from "../types/log";

export function sortByDateDesc(logs: LogDocument[]): LogDocument[] {
  return [...logs].sort(
    (a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime(),
  );
}
