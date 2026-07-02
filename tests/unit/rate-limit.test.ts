import { describe, expect, it } from 'vitest';
import { checkRateLimit } from '@/lib/rate-limit';

describe('rate limiter', () => {
  it('allows requests below the limit and blocks after limit', () => {
    const key = `test-${Date.now()}-${Math.random()}`;
    expect(checkRateLimit(key, { limit: 2, windowMs: 60000 }).allowed).toBe(true);
    expect(checkRateLimit(key, { limit: 2, windowMs: 60000 }).allowed).toBe(true);
    expect(checkRateLimit(key, { limit: 2, windowMs: 60000 }).allowed).toBe(false);
  });
});
