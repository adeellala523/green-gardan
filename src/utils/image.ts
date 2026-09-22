/**
 * Optimized Image Utility for PageSpeed / Core Web Vitals
 * Provides responsive Unsplash URLs, modern format negotiation, and dimension helpers.
 */

export function getOptimizedImageUrl(
  url: string,
  width: number = 600,
  quality: number = 75
): string {
  if (!url) return '';
  if (!url.includes('images.unsplash.com')) return url;

  try {
    const parsed = new URL(url);
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('fit', 'crop');
    parsed.searchParams.set('w', width.toString());
    parsed.searchParams.set('q', quality.toString());
    return parsed.toString();
  } catch {
    // Fallback if URL parsing fails
    const cleanUrl = url.replace(/([?&])w=\d+/, '').replace(/([?&])q=\d+/, '');
    const delimiter = cleanUrl.includes('?') ? '&' : '?';
    return `${cleanUrl}${delimiter}auto=format&fit=crop&w=${width}&q=${quality}`;
  }
}

export function getUnsplashSrcSet(url: string, widths: number[] = [360, 640, 960, 1200]): string {
  if (!url || !url.includes('images.unsplash.com')) return '';
  return widths
    .map(w => `${getOptimizedImageUrl(url, w, 75)} ${w}w`)
    .join(', ');
}
