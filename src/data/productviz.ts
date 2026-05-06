/* =============================================================
   Данные секции Product Visualization (PortfolioSectionExtended).

   ┌─ Что здесь редактировать ────────────────────────────────────
   │ 1. heading — большой заголовок секции.
   │ 2. body    — параграф под заголовком.
   │ 3. label   — серая подпись слева ("Objects & Details").
   │ 4. cards   — массив карточек (по дизайну = 3, можно больше).
   │
   │ Картинки кладём в:
   │   public/images/productviz/
   │ И прописываем путь в поле cover каждой карточки.
   │ Если cover = null — рендерится плейсхолдер с названием.
   └──────────────────────────────────────────────────────────────
   ============================================================= */

export type ProductVizCard = {
  title: string;       // подпись под картинкой
  cover: string | null;// абсолютный URL обложки или null
  href: string;        // куда ведёт «Read more»
};

export type ProductVizGroup = {
  heading: string;     // большой заголовок секции
  body: string;        // параграф под заголовком
  label: string;       // серая подпись слева от карточек
  cards: ProductVizCard[];
};

export const PRODUCTVIZ_GROUP: ProductVizGroup = {
  heading: 'product visualization',
  body: 'I produced high-quality 3D visualizations of products and objects for commercial and promotional use. My work included precise modeling, realistic materials, and advanced lighting to convey form, texture, and context. I handled full production, including rendering in V-Ray and Corona and post-production in Photoshop, with a focus on clarity, photorealism, and brand consistency.',
  label: 'Objects & Details',
  cards: [
    { title: 'Title', cover: null, href: '#product' },
    { title: 'Title', cover: null, href: '#product' },
    { title: 'Title', cover: null, href: '#product' },
  ],
};
