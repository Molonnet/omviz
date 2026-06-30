/* =============================================================
   navLinks — единый источник правды для основной навигации.
   Используется и в Header, и в Footer.

   Почему отдельный файл, а не const внутри Header:
   Header и Footer показывают один и тот же список ссылок.
   Если добавляем/убираем секцию портфолио — правка должна быть
   в одном месте, иначе списки разъедутся.

   icon: null | 'chevron-down' — опциональная иконка справа от
   текста. Сейчас все ссылки без иконок (Resume раньше имел
   chevron-down как «внешний pdf»-маркер, убрали — резюме открывается
   в лайтбоксе, а не как файл, поэтому downward-маркер вводит
   в заблуждение).
   ============================================================= */

export type NavIconName = 'chevron-down' | null;

export interface NavLink {
  label: string;
  href: string;
  icon: NavIconName;
}

export const navLinks: NavLink[] = [
  { label: 'About me',    href: '#about',    icon: null },
  { label: 'Archviz',     href: '#archviz',  icon: null },
  /* TODO: вернуть когда секция Product Viz будет наполнена реальными
     карточками + модалкой (см. PortfolioProductVizModal по образцу
     PortfolioArchvizModal). Параллельно раскомментировать рендер
     <PortfolioSectionExtended /> в index.astro. */
  // { label: 'Product Viz', href: '#product',  icon: null },
  /* TODO: вернуть когда появится real resume.pdf в /public + лайтбокс
     (close / download / print / share buttons по обсуждению). */
  // { label: 'Resume',      href: '/resume.pdf', icon: null },
];
