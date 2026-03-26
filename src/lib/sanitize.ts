const ALLOWED_PROTOCOLS = ['https:', 'http:'];

export function sanitizeUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return parsed.href;
    }
    return null;
  } catch {
    return null;
  }
}

export function getYouTubeThumbnail(url: string | undefined | null): string | null {
  if (!url) return null;

  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1);
    }

    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v');
    }

    return null;
  } catch {
    return null;
  }
}
