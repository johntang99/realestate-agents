export interface ServiceTypeData {
  slug: string;
  title: string;
  titleCn: string;
  description: string;
  descriptionCn: string;
  keyServices: string[];
  keyServicesCn: string[];
  portfolioCategory: string;
}

export const serviceTypes: ServiceTypeData[] = [
  {
    slug: 'home',
    title: 'Interior Design for Homes',
    titleCn: '住宅室内设计',
    description: 'Transform your home into a sanctuary that reflects your personality and lifestyle. Jin Pang Homes\'s residential design service covers everything from full home renovations to targeted room refreshes — all with the same level of care and craftsmanship.',
    descriptionCn: '将您的家改造成反映您个性和生活方式的静谧之所。Jin Pang Homes 的住宅设计服务涵盖从全屋翻新到针对性房间焕新的一切——均以同等程度的关心和工艺完成。',
    keyServices: ['Full home redesign', 'Kitchen & bath renovation', 'Furniture selection & procurement'],
    keyServicesCn: ['全屋重新设计', '厨房与浴室翻新', '家具选购与采购'],
    portfolioCategory: 'residential',
  },
  {
    slug: 'office',
    title: 'Office Interior Design',
    titleCn: '办公室室内设计',
    description: 'A well-designed office is more than an aesthetic choice — it\'s a strategic business decision. Jin Pang Homes creates corporate environments that communicate your brand values, attract top talent, and inspire the work that happens within them.',
    descriptionCn: '精心设计的办公室不仅仅是审美选择——它是一个战略性的商业决策。Jin Pang Homes 打造传达您品牌价值观、吸引顶尖人才并激励其中工作的企业环境。',
    keyServices: ['Corporate headquarters design', 'Open-plan workspace', 'Executive suites & boardrooms'],
    keyServicesCn: ['企业总部设计', '开放式工作空间', '行政套房与董事会议室'],
    portfolioCategory: 'commercial',
  },
  {
    slug: 'exhibition',
    title: 'Exhibition & Event Design',
    titleCn: '展览与活动设计',
    description: 'Exhibition and event spaces present a unique design challenge: create an environment that enhances the experience without competing with it. Jin Pang Homes has designed gallery exhibitions, trade show installations, and special events for clients across New York.',
    descriptionCn: '展览和活动空间呈现出独特的设计挑战：创造一个增强体验而不与之竞争的环境。Jin Pang Homes 为纽约各地的客户设计了画廊展览、贸易展安装和特别活动。',
    keyServices: ['Gallery & museum exhibitions', 'Trade show installations', 'Art installations & events'],
    keyServicesCn: ['画廊与博物馆展览', '贸易展安装', '艺术装置与活动'],
    portfolioCategory: 'exhibition',
  },
  {
    slug: 'restaurant',
    title: 'Restaurant & Hospitality Design',
    titleCn: '餐厅与酒店设计',
    description: 'Restaurant interiors set the stage for memorable dining experiences. Jin Pang Homes designs hospitality spaces that are as functional for operators as they are beautiful for guests — balancing ambiance, durability, and brand identity.',
    descriptionCn: '餐厅室内设计为难忘的用餐体验奠定舞台。Jin Pang Homes 设计对运营商功能实用、对客人美观赏心悦目的餐饮空间——平衡氛围、耐用性和品牌形象。',
    keyServices: ['Restaurant interior design', 'Hotel lobby & common areas', 'Bar & lounge design'],
    keyServicesCn: ['餐厅室内设计', '酒店大堂与公共区域', '酒吧与休息区设计'],
    portfolioCategory: 'commercial',
  },
  {
    slug: 'medical',
    title: 'Medical & Wellness Interior Design',
    titleCn: '医疗与健康室内设计',
    description: 'Medical and wellness spaces must be functional, compliant, and calming for patients. Jin Pang Homes brings warmth and design intention to clinical environments — creating spaces where patients feel cared for from the moment they arrive.',
    descriptionCn: '医疗和健康空间必须对患者功能实用、符合法规并令人安心。Jin Pang Homes 为临床环境带来温暖和设计意图——创造患者从到达那一刻就感到被关怀的空间。',
    keyServices: ['Medical practice interiors', 'Wellness studio design', 'Patient-centered environments'],
    keyServicesCn: ['医疗实践室内设计', '健康工作室设计', '以患者为中心的环境'],
    portfolioCategory: 'commercial',
  },
  {
    slug: 'retail',
    title: 'Retail Interior Design',
    titleCn: '零售室内设计',
    description: 'Retail design is the physical expression of your brand. Jin Pang Homes creates retail environments that draw customers in, communicate your brand story, and drive purchasing decisions through thoughtful spatial design.',
    descriptionCn: '零售设计是您品牌的实体表达。Jin Pang Homes 打造吸引客户、传达您的品牌故事并通过周到的空间设计推动购买决策的零售环境。',
    keyServices: ['Boutique & showroom design', 'Visual merchandising', 'Brand environment design'],
    keyServicesCn: ['精品店与展厅设计', '视觉营销', '品牌环境设计'],
    portfolioCategory: 'commercial',
  },
];

export function getServiceTypeBySlug(slug: string): ServiceTypeData | undefined {
  return serviceTypes.find(s => s.slug === slug);
}
