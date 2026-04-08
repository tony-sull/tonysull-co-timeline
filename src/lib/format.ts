const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const dateCompactFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

export function formatDateCompact(date: Date): string {
  return dateCompactFormatter.format(date);
}

/** ISO 8601 string for datetime attributes */
export function isoDate(date: Date): string {
  return date.toISOString();
}

/** Extract displayable hostname from a URL */
export function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Convert bare `#hashtag` tokens in markdown source to `[#hashtag](/tags/hashtag)` links.
 * Skips content inside backtick code spans and fenced code blocks.
 * Only matches tags that start with a letter (avoids #123, ##heading, etc.).
 */
export function linkifyHashtags(md: string): string {
  const result: string[] = [];
  // Split on fenced code blocks first; process only the non-code segments.
  const fenceRe = /(^```[\s\S]*?^```)/m;
  const parts = md.split(fenceRe);
  for (const part of parts) {
    if (part.startsWith('```')) {
      result.push(part);
    } else {
      // Within non-fenced text, skip inline code spans (`...`) while linkifying the rest.
      result.push(
        part.replace(/(`[^`]+`)|(?<!\w)#([a-zA-Z][a-zA-Z0-9_-]*)/g, (_match, code, tag) => {
          if (code !== undefined) return code;
          return `[#${tag}](/tags/${encodeURIComponent(tag)})`;
        }),
      );
    }
  }
  return result.join('');
}
