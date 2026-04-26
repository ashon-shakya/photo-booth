import { renderClassicStrip, renderNewspaper, renderColumns, renderPolaroid, renderFilmReel, renderMagazine, renderScrapbook, loadPhotos } from './renderers';
import type { RenderFn } from './renderers';

export const RENDERERS: Record<string, RenderFn> = {
  'classic-strip': renderClassicStrip,
  'newspaper':     renderNewspaper,
  'columns':       renderColumns,
  'polaroid':      renderPolaroid,
  'film-reel':     renderFilmReel,
  'magazine':      renderMagazine,
  'scrapbook':     renderScrapbook,
};

export async function renderTemplate(
  templateId: string,
  photoUrls: string[],
  width: number,
  height: number
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const photos = await loadPhotos(photoUrls);
  RENDERERS[templateId](ctx, photos, width, height);
  return canvas.toDataURL('image/png');
}
