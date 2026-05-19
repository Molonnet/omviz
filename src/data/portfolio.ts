/* =============================================================
   Данные секции Portfolio.

   ┌─ Что здесь редактировать ────────────────────────────────────
   │ 1. heading / body — текст, который появится в лайтбоксе
   │    рядом с активной картинкой (правая колонка модалки).
   │ 2. categories — порядок и список категорий.
   │ Сами картинки добавляй/удаляй В ПАПКЕ:
   │     public/images/portfolio/<slug>/
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
    heading: 'Facades & exteriors',
    body: [
      'Exterior visualizations of commercial and residential buildings, from concept renderings to photoreal night and daylight scenes.',
      'I focus on materiality, atmosphere and how a façade reads at different distances — close-up texture, mid-shot composition, long-range silhouette against sky and surroundings.',
      'Each scene is built with a real lighting setup, accurate proportions and considered camera framing — so the result holds up next to a real photograph, not just a render.',
    ],
  },
  {
    slug: 'public-spaces',
    name: 'Public Spaces',
    mobileName: 'Publics',
    heading: 'Public & themed spaces',
    body: [
      'Banking branches, lobbies, themed commercial spaces — built around clear circulation, comfort and a coherent visual language.',
      'I work closely with brand guidelines and adapt them into spatial scenarios: where the eye lands first, how a customer moves through the room, where light and material create pauses.',
      'The visualization stage is where these decisions get tested — by the time a project goes on site, the client already knows exactly how the space will feel.',
    ],
  },
  {
    slug: 'office-workspaces',
    name: 'Office Workspaces',
    mobileName: 'Offices',
    heading: 'Offices & corporate spaces',
    body: [
      'Workspaces for banks, corporate clients and creative studios — focused on brand identity, lighting and ergonomic spatial planning.',
      'I treat an office as a stage for daily work: zoning that supports focus and collaboration, lighting that holds up through a long day, materials that age well under heavy use.',
      'Renderings are used both as a design tool during the project and as presentation material — so they have to be technically honest and visually convincing at the same time.',
    ],
  },
  {
    slug: 'residential-spaces',
    name: 'Residential Spaces',
    mobileName: 'Residentials',
    heading: 'Residential interiors',
    body: [
      'Full-cycle residential interiors — material selection, lighting, 3D modeling and final visualization, often delivered solo.',
      'I take projects from a first layout sketch all the way to a photoreal scene the client can walk through in their head: choosing finishes, planning lighting scenarios, dialing in furniture and decor.',
      'Working solo on residential lets me keep a single design voice across every decision — the visualization simply makes that voice visible before anything is built.',
    ],
  },
];

const PORTFOLIO_ROOT = path.join(process.cwd(), 'public/images/portfolio');

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

  const toUrl = (f: string) => `/images/portfolio/${slug}/${f}`;

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
    'I designed and delivered interior and exterior projects for commercial, corporate, and residential clients.',
    'My work combined practical solutions with brand identity, spatial planning, and user-centered approaches.',
    'I completed full-cycle design, including material selection, lighting, 3D modeling, and visualization, and often worked independently on residential interiors.',
    'Projects included banking branches, offices, and themed commercial spaces, focusing on creating comfortable, clear, and visually coherent environments.',
  ],
  readMoreHref: '#archviz',
  readMoreLabel: 'Read more',
};
