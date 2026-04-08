/**
 * Cache header helpers for the timeline theme.
 *
 * Mirrors the approach in ~/Playground/indiepub but kept local to this theme
 * so it can diverge as needed.
 */

interface ResponseLike {
  headers: Headers;
}

interface Entry {
  updatedAt?: Date | null;
  publishedAt?: Date | null;
  createdAt: Date;
}

const CACHE = {
  COLLECTION: 'public, max-age=0, s-maxage=60, stale-while-revalidate=600',
  ENTRY: 'public, max-age=0, s-maxage=30, stale-while-revalidate=300',
  STATIC: 'public, max-age=0, s-maxage=300, stale-while-revalidate=600',
  PRIVATE: 'private, no-store, must-revalidate',
} as const;

function latestTimestamp(entries: Entry[]): Date | null {
  if (entries.length === 0) return null;
  return entries.reduce((max, e) => {
    const t = e.updatedAt ?? e.publishedAt ?? e.createdAt;
    return t > max ? t : max;
  }, new Date(0));
}

/**
 * Set cache headers for a collection page (homepage, /notes, /articles, etc.)
 */
export function setCollectionCacheHeaders(response: ResponseLike, isAdmin: boolean, entries: Entry[]) {
  if (isAdmin) {
    response.headers.set('Cache-Control', CACHE.PRIVATE);
    return;
  }
  response.headers.set('Cache-Control', CACHE.COLLECTION);
  const latest = latestTimestamp(entries);
  if (latest && latest.getTime() > 0) {
    response.headers.set('Last-Modified', latest.toUTCString());
  }
}

/**
 * Set cache headers for a single entry page (/posts/[slug]).
 */
export function setEntryCacheHeaders(response: ResponseLike, entry: Entry) {
  response.headers.set('Cache-Control', CACHE.ENTRY);
  const lastMod = entry.updatedAt ?? entry.publishedAt ?? entry.createdAt;
  response.headers.set('Last-Modified', lastMod.toUTCString());
}

/**
 * Set cache headers for mostly-static pages (about, etc.)
 */
export function setStaticCacheHeaders(response: ResponseLike) {
  response.headers.set('Cache-Control', CACHE.STATIC);
}
