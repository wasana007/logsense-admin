import { describe, it, expect } from 'vitest';
import { sortByDateDesc } from './sortByDate';
import type { LogDocument } from '../types/log';

const makelog = (createdAt?: string): LogDocument =>
  ({
    createdAt,
  }) as LogDocument;

describe('sortByDateDesc', () => {
  it('should sort logs by date descending', () => {
    const logs = [
      makelog('2024-01-01T00:00:00Z'),
      makelog('2024-03-01T00:00:00Z'),
      makelog('2024-02-01T00:00:00Z'),
    ];
    const result = sortByDateDesc(logs);
    expect(result[0].createdAt).toBe('2024-03-01T00:00:00Z');
    expect(result[1].createdAt).toBe('2024-02-01T00:00:00Z');
    expect(result[2].createdAt).toBe('2024-01-01T00:00:00Z');
  });

  it('should return empty array when given empty array', () => {
    expect(sortByDateDesc([])).toEqual([]);
  });

  it('should handle logs with undefined createdAt without crashing', () => {
    const logs = [makelog(undefined), makelog('2024-01-01T00:00:00Z')];
    expect(() => sortByDateDesc(logs)).not.toThrow();
  });

  it('should handle all logs with undefined createdAt without crashing', () => {
    const logs = [makelog(undefined), makelog(undefined)];
    expect(() => sortByDateDesc(logs)).not.toThrow();
  });

  it('should not mutate the original array', () => {
    const logs = [makelog('2024-01-01T00:00:00Z'), makelog('2024-03-01T00:00:00Z')];
    const original = [...logs];
    sortByDateDesc(logs);
    expect(logs[0].createdAt).toBe(original[0].createdAt);
  });
});
