/**
 * Optimized Image Utility for PageSpeed / Core Web Vitals
 * Provides responsive Unsplash URLs, modern format negotiation, and dimension helpers.
 */

const KNOWN_BROKEN_IMAGE_MAP: Record<string, string> = {
  'photo-1592417817098-8f3d6eb228cc': 'photo-1523348837708-15d4a09cfac2',
  'photo-1508873696983-2df5293cb395': 'photo-1507290439931-a861b5a38200',
  'photo-1594488518042-4f367e9f6515': 'photo-1592150621744-aca64f48394a',
  'photo-1558904541-efa8c4a08931': 'photo-1557429287-b2e26467fc2b',
};

export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80';

export function sanitizeImageUrl(url: string): string {
  if (!url) return DEFAULT_FALLBACK_IMAGE;
  let clean = url;
  for (const [broken, replacement] of Object.entries(KNOWN_BROKEN_IMAGE_MAP)) {
    if (clean.includes(broken)) {
      clean = clean.replace(broken, replacement);
    }
  }
  return clean;
}

export function getOptimizedImageUrl(
  url: string,
  width: number = 600,
  quality: number = 75
): string {
  if (!url) return '';
  const safeUrl = sanitizeImageUrl(url);
  if (!safeUrl.includes('images.unsplash.com')) return safeUrl;

  try {
    const parsed = new URL(safeUrl);
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('fit', 'crop');
    parsed.searchParams.set('w', width.toString());
    parsed.searchParams.set('q', quality.toString());
    return parsed.toString();
  } catch {
    // Fallback if URL parsing fails
    const cleanUrl = safeUrl.replace(/([?&])w=\d+/, '').replace(/([?&])q=\d+/, '');
    const delimiter = cleanUrl.includes('?') ? '&' : '?';
    return `${cleanUrl}${delimiter}auto=format&fit=crop&w=${width}&q=${quality}`;
  }
}

export function getUnsplashSrcSet(url: string, widths: number[] = [360, 640, 960, 1200]): string {
  if (!url) return '';
  const safeUrl = sanitizeImageUrl(url);
  if (!safeUrl.includes('images.unsplash.com')) return '';
  return widths
    .map(w => `${getOptimizedImageUrl(safeUrl, w, 75)} ${w}w`)
    .join(', ');
}

