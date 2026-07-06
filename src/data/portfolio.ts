/* =============================================================
   Данные секции Portfolio.

   ┌─ Что здесь редактировать ────────────────────────────────────
   │ 1. heading / body — текст, который появится в лайтбоксе
   │    рядом с активной картинкой (правая колонка модалки).
   │ 2. categories — порядок и список категорий.
   │ Сами картинки добавляй/удаляй В ПАПКЕ:
   │     public/images/archviz/<slug>/
   │
   │ Правила именования:
   │  • cover.jpg / cover-anything.jpg  → ОБЛОЖКА на лэндинге.
   │    Этот файл НЕ показывается в лайтбоксе.
   │  • Все остальные файлы (любые имена) → лайтбокс,
   │    отсортированы по алфавиту имени.
   │  • Если файла cover.* нет → обложкой станет ПЕРВАЯ
   │    картинка по алфавиту (она же — первая в лайтбоксе).
   └──────────────────────────────────────────────────────────────

   Slug должен совпадать с именем папки 1-в-1.
   ============================================================= */

import fs from 'node:fs';
import path from 'node:path';

export type PortfolioCategory = {
  slug: string;
  name: string;          // длинное имя — таб десктопной модалки, alt/aria, документация
  mobileName?: string;   // короткое имя для мобильной модалки. Если нет — фолбэк на name.
  heading: string;       // заголовок в правой колонке лайтбокса
  body: string[];        // описание в правой колонке: МАССИВ абзацев.
                         // Рендерится через join('\n\n') + CSS white-space: pre-line,
                         // чтобы line-clamp на мобиле продолжал работать как clamp
                         // по строкам всего блока (а не по строкам отдельного <p>).
  cover: string | null;  // абс. URL обложки для коллажа на лэндинге
  images: string[];      // абс. URL картинок для лайтбокса
};

const CATEGORIES_META: Omit<PortfolioCategory, 'images'>[] = [
  {
    slug: 'building-exteriors',
    name: 'Building Exteriors',
    mobileName: 'Exteriors',
    heading: 'Facades & Exteriors',
    body: [
      'Exterior renderings for private houses, multi-unit residential complexes and a seaside resort.',
      'I build 3D models from CAD drawings and architectural plans in 3ds Max, then set up daylight and HDRI lighting in V-Ray/Corona to show materials, reflections and surroundings accurately.',
      'Each image is finished with compositing and color grading in Affinity.',
    ],
  },
  {
    slug: 'public-spaces',
    name: 'Public Spaces',
    mobileName: 'Publics',
    heading: 'Public & Themed Spaces',
    body: [
      'Interiors for banks, corporate lobbies and concept competitions.',
      'My work here includes the B1NK bank branch, which won a "Light Design" award for its logo-shaped sculpture in translucent stone with color-changing backlight. I also handle concept-driven projects, from a hexagon symbolizing time for Sberbank to an "old and new St. Petersburg" theme for MTC, and a first-place concept for Rosatom based on Möbius strips and molecular structures.',
      'I model each scene in detail in 3ds Max, set up materials and lighting in V-Ray/Corona and finish in Affinity.',
    ],
  },
  {
    slug: 'office-workspaces',
    name: 'Office Workspaces',
    mobileName: 'Offices',
    heading: 'Offices & Corporate Spaces',
    body: [
      'Corporate offices and executive suites, often built around a client\'s brand book and identity — including ForteBank, Sberbank, and the Capital Bank branch that won a "Brand & Image" award and earned the nickname "Onyx" for its backlit acrylic-stone welcome zone.',
      'I work directly from architect drawings, model accurate 3D scenes in 3ds Max, and render premium materials with realistic lighting in V-Ray/Corona. The goal is clear, professional images that help clients approve concepts.',
    ],
  },
  {
    slug: 'residential-spaces',
    name: 'Residential Spaces',
    mobileName: 'Residentials',
    heading: 'Residential Interiors',
    body: [
      'Homes handled end-to-end, from the first client meeting to the final render.',
      'With private clients I focus on the space itself — how it\'s laid out, how it works day to day, and how comfortable it is to live in. I develop the layout and design concept, then model it in 3ds Max and light it in V-Ray and Corona, with final compositing and retouching in Affinity.',
      'The renderings help clients see and adjust their interior before any work begins.',
    ],
  },
];

const PORTFOLIO_ROOT = path.join(process.cwd(), 'public/images/archviz');

/* Имя файла считается обложкой, если начинается на "cover" и далее
   точка или дефис: cover.jpg, cover-night.png, cover-01.webp.
   Регистр не важен. */
const COVER_FILENAME = /^cover[\.-]/i;

function readCategoryAssets(slug: string): { cover: string | null; images: string[] } {
  const dir = path.join(PORTFOLIO_ROOT, slug);
  if (!fs.existsSync(dir)) return { cover: null, images: [] };

  const all = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
    .sort();

  const toUrl = (f: string) => `/images/archviz/${slug}/${f}`;

  /* Ищем явную обложку. Если их несколько (например cover.jpg и cover-2.jpg)
     — берём первую по алфавиту, остальные молча игнорируем. */
  const coverFile = all.find((f) => COVER_FILENAME.test(f));
  const galleryFiles = all.filter((f) => f !== coverFile);

  /* Fallback: если cover.* нет — обложка = первая картинка из галереи.
     Тогда галерея остаётся как есть (включая эту картинку), и поведение
     совпадает с прежним. */
  const cover = coverFile ? toUrl(coverFile) : (galleryFiles[0] ? toUrl(galleryFiles[0]) : null);

  return { cover, images: galleryFiles.map(toUrl) };
}

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = CATEGORIES_META.map(
  (meta) => ({ ...meta, ...readCategoryAssets(meta.slug) }),
);

/* =============================================================
   ARCHVIZ_INTRO — заголовок + интро-абзацы для секции
   «Architectural Visualization». Один источник правды,
   из которого читают и десктопный PortfolioSection,
   и мобильный PortfolioSectionMobile.

   Тексты — копия 1:1 из Figma. Абзацы — массив строк, чтобы
   рендерить их через .map в <p>; в Figma между ними пустая
   строка (одна высота строки), это реализуется CSS-ом
   (см. PortfolioSection*.astro). readMoreHref пока ссылка-якорь
   на саму секцию — позже сюда можно подцепить открытие
   PortfolioSectionExtended.
   ============================================================= */
export const ARCHVIZ_INTRO = {
  heading: 'architectural visualization',
  paragraphs: [
    'I design spaces and bring them to life. As both a designer and a 3D visualizer, I take a project from the first idea (layout, concept, how the space works and feels) through to the final photorealistic image.',
    'I work with commercial, corporate, and residential clients, combining practical solutions with brand identity and a user-centered approach. Many years of interiors and exteriors, from private homes to award-winning banking and corporate interiors.',
    'Whether it is my own design or a brief from architects or designers, I handle the full pipeline: material selection, modeling, lighting and post-production, often working with private clients from the first meeting through to final delivery.',
  ],
  readMoreHref: '#archviz',
  readMoreLabel: 'Read more',
};
