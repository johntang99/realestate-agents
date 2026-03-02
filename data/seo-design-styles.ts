export interface DesignStyleData {
  slug: string;
  title: string;
  titleCn: string;
  description: string;
  descriptionCn: string;
  characteristics: string[];
  characteristicsCn: string[];
  portfolioStyle: string;
}

export const designStyles: DesignStyleData[] = [
  {
    slug: 'modern',
    title: 'Modern Interior Design',
    titleCn: '现代室内设计',
    description: 'Modern interior design celebrates simplicity, clean lines, and the honest use of materials. Jin Pang Homes\'s modern projects strip away the unnecessary to reveal spaces that feel simultaneously spare and deeply comfortable.',
    descriptionCn: '现代室内设计颂扬简约、简洁线条和材料的真实使用。Jin Pang Homes 的现代项目剥去不必要的元素，呈现出既简洁又深度舒适的空间。',
    characteristics: ['Clean lines', 'Neutral palettes', 'Open floor plans', 'Natural light focus', 'Minimal ornamentation'],
    characteristicsCn: ['简洁线条', '中性色调', '开放式平面', '自然光焦点', '极简装饰'],
    portfolioStyle: 'modern',
  },
  {
    slug: 'transitional',
    title: 'Transitional Interior Design',
    titleCn: '过渡风格室内设计',
    description: 'Transitional design finds the sweet spot between traditional elegance and contemporary comfort. This is Jin Pang Homes\'s most requested style — because it works beautifully in both classic and modern homes.',
    descriptionCn: '过渡风格设计找到了传统优雅与当代舒适之间的甜蜜点。这是 Jin Pang Homes 最受欢迎的风格——因为它在经典和现代住宅中都非常出色。',
    characteristics: ['Balanced traditional & contemporary', 'Warm neutrals', 'Layered textiles', 'Refined classic forms', 'Collected-over-time feel'],
    characteristicsCn: ['传统与当代平衡', '温暖中性色', '层次丰富纺织品', '精致经典形式', '随时间积累的感觉'],
    portfolioStyle: 'transitional',
  },
  {
    slug: 'minimalist',
    title: 'Minimalist Interior Design',
    titleCn: '极简主义室内设计',
    description: 'True minimalism is not empty — it\'s intentional. Every object in a Jin Pang Homes minimalist project earns its place through function, beauty, or both. The result is spaces that feel peaceful, uncluttered, and quietly luxurious.',
    descriptionCn: '真正的极简主义不是空洞的——而是有意为之的。Jin Pang Homes 极简项目中的每件物品都通过功能、美感或两者兼具来赢得其位置。结果是感觉宁静、整洁和静静奢华的空间。',
    characteristics: ['Radical simplicity', 'Monochromatic palettes', 'Hidden storage', 'High-quality single materials', 'Negative space as design element'],
    characteristicsCn: ['极致简约', '单色调色板', '隐形储物', '高品质单一材料', '负空间作为设计元素'],
    portfolioStyle: 'minimalist',
  },
  {
    slug: 'contemporary',
    title: 'Contemporary Interior Design',
    titleCn: '当代室内设计',
    description: 'Contemporary design reflects the moment — it\'s always evolving. Jin Pang Homes\'s contemporary projects incorporate current materials, forms, and technologies while maintaining the timelessness that ensures a home won\'t feel dated in five years.',
    descriptionCn: '当代设计反映当下——它始终在进化。Jin Pang Homes 的当代项目融合当前材料、形式和技术，同时保持确保五年后家居不会显得过时的永恒性。',
    characteristics: ['Current design trends', 'Bold material choices', 'Mixed textures', 'Statement pieces', 'Technology integration'],
    characteristicsCn: ['当前设计趋势', '大胆材料选择', '混合质感', '声明性单品', '技术整合'],
    portfolioStyle: 'contemporary',
  },
  {
    slug: 'east-west-fusion',
    title: 'East-West Fusion Interior Design',
    titleCn: '东西融合室内设计',
    description: 'Jin Pang Homes\'s East-West fusion aesthetic is uniquely its own — born from 25 years working with clients whose lives bridge Eastern and Western culture. These spaces feel at once global and deeply personal.',
    descriptionCn: 'Jin Pang Homes 的东西融合美学是独一无二的——源于25年与跨越东西方文化生活的客户合作的经验。这些空间感觉既国际化又极具个人色彩。',
    characteristics: ['Eastern proportions & balance', 'Western material palette', 'Natural materials', 'Wabi-sabi appreciation', 'Cultural artifacts as design elements'],
    characteristicsCn: ['东方比例与平衡', '西方材料色板', '天然材料', '侘寂美学欣赏', '文化艺术品作为设计元素'],
    portfolioStyle: 'east-west',
  },
  {
    slug: 'classic',
    title: 'Classic Interior Design',
    titleCn: '经典室内设计',
    description: 'Classic design draws from the rich traditions of European and American decorating history. In Jin Pang Homes\'s hands, classic design is never stuffy — it\'s elevated, warm, and entirely livable.',
    descriptionCn: '经典设计汲取欧美装饰历史的丰富传统。在 Jin Pang Homes 的手中，经典设计从不沉闷——它是高雅、温暖且完全宜居的。',
    characteristics: ['Symmetry & proportion', 'Rich color palettes', 'Period-inspired furniture', 'Layered textiles & patterns', 'Antiques & heirlooms'],
    characteristicsCn: ['对称与比例', '丰富色彩调色板', '仿时期家具', '层次丰富纺织品与图案', '古董与传家宝'],
    portfolioStyle: 'classic',
  },
];

export function getDesignStyleBySlug(slug: string): DesignStyleData | undefined {
  return designStyles.find(s => s.slug === slug);
}
