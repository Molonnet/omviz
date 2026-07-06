/* =============================================================
   aboutContent — single source of truth для секции About.
   Импортируется и десктопным AboutSection.astro, и мобильным
   AboutSectionMobile.astro — чтобы списки и картинки не двоились.

   Тексты — копия 1:1 из Figma. Пунктуация важна:
     - в competencies — `;` в конце пунктов
     - в strengths — `.` в конце пунктов
   ============================================================= */

export const competencies: string[] = [
  'Autodesk 3ds Max;',
  'Advanced 3D modeling skills (high/low poly);',
  'V-Ray and Corona Renderer;',
  'Physically accurate materials and shading;',
  'UVW mapping and precise texture placement;',
  'Studio and architectural lighting;',
  'AutoCAD workflows and integration with 3ds Max;',
  'Understanding of architectural CAD drawings;',
  'Advanced post-production in Adobe Photoshop and Affinity;',
  'AI-assisted ideation and concept development.',
];

export const strengths: string[] = [
  'Talented and passionate, consistently striving for excellence.',
  'Self-motivated and proactive, taking initiative and responsibility.',
  'Detail-oriented and resourceful in problem-solving.',
  'Creative thinker with an eye for detail.',
  'Collaborative team player.',
  'Skilled in managing multiple tasks and projects simultaneously.',
  'Excellent communicator, adaptable to internal processes.',
  'Strong interest in the latest digital trends.',
  'Quick learner, adaptable to new tools and technologies.',
  'Authorized to work in the U.S.',
];

/* =============================================================
   Картинки About — читаем из public/images/about/.
   ВАЖНО: fs работает только на сервере (build-time в Astro).
   Импортировать этот модуль можно ТОЛЬКО из .astro файлов
   во frontmatter — никак не из client-side script-ов.
   ============================================================= */

import fs from 'node:fs';
import path from 'node:path';

const aboutDir = path.join(process.cwd(), 'public/images/about');

export interface AboutImage {
  src: string;
  /** alt пустой = декоративная картинка для скринридеров.
      Это ок: лента — визуальный приём, а не информативное
      содержание. Самостоятельные работы — в PortfolioSection
      со своим набором alt'ов. */
  alt: '';
}

export const aboutImages: AboutImage[] = fs
  .readdirSync(aboutDir)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort()
  .map((f) => ({ src: `/images/about/${f}`, alt: '' as const }));
