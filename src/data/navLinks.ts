/* =============================================================
   navLinks — единый источник правды для основной навигации.
   Используется и в Header, и в Footer.

   Почему отдельный файл, а не const внутри Header:
   Header и Footer показывают один и тот же список ссылок.
   Если добавляем/убираем секцию портфолио — правка должна быть
   в одном месте, иначе списки разъедутся.

   icon: null | 'chevron-down' — опциональная иконка справа от
   текста (например, у Resume стоит ↓, потому что это внешний
   pdf, а не якорь страницы).
   ============================================================= */

export type NavIconName = 'chevron-down' | null;

export interface NavLink {
  label: string;
  href: string;
  icon: NavIconName;
}

export const navLinks: NavLink[] = [
  { label: 'About me',    href: '#about',     icon: null },
  { label: 'Archviz',     href: '#archviz',   icon: null },
  { label: 'Product Viz', href: '#product',   icon: null },
  { label: 'Drawings',    href: '#drawings',  icon: null },
  { label: 'Resume',      href: '/resume.pdf', icon: 'chevron-down' },
];
