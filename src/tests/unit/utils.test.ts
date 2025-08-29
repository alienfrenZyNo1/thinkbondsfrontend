import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('Utils test', () => {
  it('should merge class names correctly', () => {
    const result = cn('class1', 'class2');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });
});
