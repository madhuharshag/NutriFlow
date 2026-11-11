/**
 * Simple in-memory sliding-window rate limiter per IP or user key.
 */
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

const MAX_CACHE_ENTRIES = 10_000;

function pruneExpiredEntries(now: number) {
  if (rateLimitMap.size <= MAX_CACHE_ENTRIES) return;
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.expiresAt) {
      rateLimitMap.delete(key);
    }
  }
}

export function checkRateLimit(key: string, limit = 60, windowMs = 60_000): boolean {
  const now = Date.now();
  pruneExpiredEntries(now);

  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.expiresAt) {
    rateLimitMap.set(key, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

export function resetRateLimits() {
  rateLimitMap.clear();
}
