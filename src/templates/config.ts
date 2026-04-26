export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  aspectRatio: number; // width / height of the output canvas
  accent: string;
  gradient: string;
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'classic-strip',
    name: 'Classic Strip',
    description: 'Timeless vertical film strip — just like the real thing',
    icon: '🎞️',
    aspectRatio: 0.38,
    accent: '#f5c842',
    gradient: 'linear-gradient(135deg, #1a1a1a, #3a3a3a)',
  },
  {
    id: 'newspaper',
    name: 'Newspaper',
    description: 'Vintage broadsheet front page with your headline',
    icon: '📰',
    aspectRatio: 0.78,
    accent: '#c8b89a',
    gradient: 'linear-gradient(135deg, #b8a98a, #d4c9ae)',
  },
  {
    id: 'columns',
    name: 'Columns',
    description: 'Three bold side-by-side columns',
    icon: '▦',
    aspectRatio: 1.6,
    accent: '#6ab3ff',
    gradient: 'linear-gradient(135deg, #0f2a4a, #1a3d6e)',
  },
  {
    id: 'polaroid',
    name: 'Polaroid Wall',
    description: 'Scattered polaroids on a warm cork board',
    icon: '📸',
    aspectRatio: 1.25,
    accent: '#ff9f6b',
    gradient: 'linear-gradient(135deg, #8b6f4e, #a0836a)',
  },
  {
    id: 'film-reel',
    name: 'Film Reel',
    description: 'Cinematic horizontal strip with sprocket holes',
    icon: '🎬',
    aspectRatio: 3.2,
    accent: '#ff6b6b',
    gradient: 'linear-gradient(135deg, #0d0d0d, #1a0a0a)',
  },
  {
    id: 'magazine',
    name: 'Magazine Cover',
    description: 'Glossy magazine layout with hero and thumbnails',
    icon: '✨',
    aspectRatio: 0.72,
    accent: '#b36aff',
    gradient: 'linear-gradient(135deg, #1a0a2e, #2d1054)',
  },
  {
    id: 'scrapbook',
    name: 'Scrapbook',
    description: 'Overlapping taped photos on textured paper',
    icon: '📔',
    accent: '#ff6ab3',
    aspectRatio: 1.0,
    gradient: 'linear-gradient(135deg, #f0e8d8, #e8d9c0)',
  },
];
