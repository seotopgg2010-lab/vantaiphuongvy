export function videoEmbedUrl(input: string): string | null {
  try {
    const url = new URL(input);
    if (url.protocol !== 'https:') return null;
    const host = url.hostname.toLowerCase();
    if (host === 'youtu.be' || ['youtube.com', 'www.youtube.com', 'www.youtube-nocookie.com'].includes(host)) {
      const id = host === 'youtu.be' ? url.pathname.slice(1) : url.pathname.startsWith('/embed/') ? url.pathname.split('/')[2] : url.searchParams.get('v');
      return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(host)) {
      const id = url.pathname.split('/').filter(Boolean).pop();
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    }
    return null;
  } catch { return null; }
}
