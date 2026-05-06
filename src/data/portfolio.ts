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
  name: string;          // что в табе лайтбокса
  heading: string;       // заголовок в правой колонке лайтбокса
  body: string;          // описание в правой колонке лайтбокса
  cover: string | null;  // абс. URL обложки для коллажа на лэндинге
  images: string[];      // абс. URL картинок для лайтбокса
};

const CATEGORIES_META: Omit<PortfolioCategory, 'images'>[] = [
  {
    slug: 'building-exteriors',
    name: 'Building Exteriors',
    heading: 'Facades & exteriors',
    body: 'Exterior visualizations of commercial and residential buildings, from concept renderings to photoreal night and daylight scenes.',
  },
  {
    slug: 'public-spaces',
    name: 'Public Spaces',
    heading: 'Public & themed spaces',
    body: 'Banking branches, lobbies, themed commercial spaces — built around clear circulation, comfort and a coherent visual language.',
  },
  {
    slug: 'office-workspaces',
    name: 'Office Workspaces',
    heading: 'Offices & corporate spaces',
    body: 'Workspaces for banks, corporate clients and creative studios — focused on brand identity, lighting and ergonomic spatial planning.',
  },
  {
    slug: 'residential-spaces',
    name: 'Residential Spaces',
    heading: 'Residential interiors',
    body: 'Full-cycle residential interiors — material selection, lighting, 3D modeling and final visualization, often delivered solo.',
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
