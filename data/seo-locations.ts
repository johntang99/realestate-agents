export interface LocationData {
  slug: string;
  city: string;
  cityCn: string;
  state: string;
  region: string;
  regionCn: string;
  description: string;
  descriptionCn: string;
  serviceHighlights: string[];
  serviceHighlightsCn: string[];
  nearbyLocations: string[];
}

export const locations: LocationData[] = [
  {
    slug: 'new-york',
    city: 'New York',
    cityCn: '纽约',
    state: 'NY',
    region: 'Manhattan, Brooklyn, Queens, Bronx, Staten Island',
    regionCn: '曼哈顿、布鲁克林、皇后区、布朗克斯、史坦顿岛',
    description: 'Jin Pang Homes brings 25 years of interior design excellence to New York City. From Manhattan penthouses to Brooklyn brownstones, we create timeless spaces tailored to the city\'s unique architecture and lifestyle.',
    descriptionCn: 'Jin Pang Homes 为纽约市带来25年的室内设计卓越经验。从曼哈顿顶层公寓到布鲁克林褐石建筑，我们打造适合这座城市独特建筑和生活方式的永恒空间。',
    serviceHighlights: ['Residential lofts & penthouses', 'Corporate headquarters design', 'Gallery & exhibition design'],
    serviceHighlightsCn: ['住宅阁楼与顶层公寓', '企业总部设计', '画廊与展览设计'],
    nearbyLocations: ['manhattan', 'brooklyn', 'flushing'],
  },
  {
    slug: 'manhattan',
    city: 'Manhattan',
    cityCn: '曼哈顿',
    state: 'NY',
    region: 'Upper West Side, Upper East Side, Midtown, SoHo, TriBeCa, Chelsea',
    regionCn: '上西区、上东区、中城、苏豪区、翠贝卡、切尔西',
    description: 'Manhattan\'s iconic architecture and demanding aesthetic call for a designer who understands the city\'s unique character. Jin Pang Homes has designed dozens of Manhattan residences — from prewar classics to glass-tower penthouses.',
    descriptionCn: '曼哈顿标志性的建筑和严苛的审美需要一位了解这座城市独特个性的设计师。Jin Pang Homes 已为数十个曼哈顿住宅进行了设计——从战前经典建筑到玻璃塔顶层公寓。',
    serviceHighlights: ['Prewar apartment renovations', 'Modern penthouse design', 'Commercial office spaces'],
    serviceHighlightsCn: ['战前公寓翻新', '现代顶层公寓设计', '商业办公空间'],
    nearbyLocations: ['new-york', 'brooklyn', 'hoboken'],
  },
  {
    slug: 'brooklyn',
    city: 'Brooklyn',
    cityCn: '布鲁克林',
    state: 'NY',
    region: 'Brooklyn Heights, DUMBO, Park Slope, Williamsburg, Carroll Gardens',
    regionCn: '布鲁克林高地、当必布、公园坡、威廉斯堡、卡罗尔花园',
    description: 'Brooklyn\'s brownstones, converted warehouses, and waterfront apartments have a character all their own. Jin Pang Homes brings the same refined eye to Brooklyn that makes Manhattan residences unforgettable.',
    descriptionCn: '布鲁克林的褐石建筑、改建仓库和滨水公寓有其独特的个性。Jin Pang Homes 将同样精致的眼光带到布鲁克林，使其住宅令人难忘。',
    serviceHighlights: ['Historic brownstone renovation', 'Warehouse loft conversion', 'Family home design'],
    serviceHighlightsCn: ['历史褐石建筑翻新', '仓库阁楼改造', '家庭住宅设计'],
    nearbyLocations: ['manhattan', 'new-york', 'hoboken'],
  },
  {
    slug: 'flushing',
    city: 'Flushing',
    cityCn: '法拉盛',
    state: 'NY',
    region: 'Flushing, Bayside, Fresh Meadows, Whitestone, College Point',
    regionCn: '法拉盛、贝赛、新鲜草原、白石、大学点',
    description: 'Serving the vibrant Flushing community with bilingual interior design services. Jin Pang Homes understands the cultural preferences and lifestyle needs of our Chinese-American clients — offering full consultations in both English and Chinese.',
    descriptionCn: '以双语室内设计服务服务充满活力的法拉盛社区。Jin Pang Homes 了解华裔美国客户的文化偏好和生活方式需求——提供中英文全程咨询服务。',
    serviceHighlights: ['Bilingual design consultations', 'East-West fusion interiors', 'Commercial spaces for Asian businesses'],
    serviceHighlightsCn: ['双语设计咨询', '东西融合室内设计', '亚裔企业商业空间'],
    nearbyLocations: ['new-york', 'queens', 'bayside'],
  },
  {
    slug: 'greenwich',
    city: 'Greenwich',
    cityCn: '格林威治',
    state: 'CT',
    region: 'Greenwich, Cos Cob, Old Greenwich, Riverside',
    regionCn: '格林威治、科斯科布、老格林威治、河滨',
    description: 'Greenwich\'s estates and waterfront properties demand a level of design sophistication that matches their scale. Jin Pang Homes has worked with dozens of Greenwich families to create homes that honor the town\'s heritage while embracing contemporary elegance.',
    descriptionCn: '格林威治的庄园和水滨房产需要与其规模相称的设计精致度。Jin Pang Homes 与数十个格林威治家庭合作，打造尊重城镇传统同时拥抱当代优雅的家园。',
    serviceHighlights: ['Estate interior design', 'Full home renovation', 'Custom furniture sourcing'],
    serviceHighlightsCn: ['庄园室内设计', '全屋翻新', '定制家具采购'],
    nearbyLocations: ['orange-county', 'stamford', 'new-york'],
  },
  {
    slug: 'orange-county',
    city: 'Orange County',
    cityCn: '威彻斯特',
    state: 'NY',
    region: 'Port Jervis, Middletown, Warwick, Mamaroneck, White Plains',
    regionCn: '斯卡斯代尔、布朗克斯维尔、拉奇蒙特、马马罗内克、怀特普莱恿',
    description: 'Orange County\'s suburban elegance — large homes, generous proportions, and lush surroundings — creates perfect conditions for Jin Pang Homes\'s signature blend of comfort and sophistication.',
    descriptionCn: '威彻斯特的郊区优雅——宽敞的房屋、慷慨的比例和郁郁葱葱的环境——为 Jin Pang Homes 标志性的舒适与精致融合创造了完美条件。',
    serviceHighlights: ['Suburban home interiors', 'Kitchen & bath renovation', 'Home office design'],
    serviceHighlightsCn: ['郊区住宅室内设计', '厨房与浴室翻新', '家庭办公室设计'],
    nearbyLocations: ['greenwich', 'new-york', 'stamford'],
  },
  {
    slug: 'hoboken',
    city: 'Hoboken',
    cityCn: '霍博肯',
    state: 'NJ',
    region: 'Hoboken, Jersey City, Weehawken',
    regionCn: '霍博肯、泽西市、维霍肯',
    description: 'With stunning Manhattan skyline views and a community of design-conscious professionals, Hoboken and Jersey City offer a unique canvas for Jin Pang Homes\'s work — modern, sophisticated, and built for real life.',
    descriptionCn: '拥有令人惊叹的曼哈顿天际线景观和一批注重设计的专业人士，霍博肯和泽西市为 Jin Pang Homes 的工作提供了独特的画布——现代、精致，并为真实生活而建。',
    serviceHighlights: ['Urban apartment design', 'Open-plan living', 'Modern minimalist interiors'],
    serviceHighlightsCn: ['城市公寓设计', '开放式生活空间', '现代极简室内设计'],
    nearbyLocations: ['new-york', 'manhattan', 'brooklyn'],
  },
  {
    slug: 'stamford',
    city: 'Stamford',
    cityCn: '斯坦福',
    state: 'CT',
    region: 'Stamford, Darien, New Canaan, Norwalk',
    regionCn: '斯坦福、达里恩、新迦南、诺沃克',
    description: 'Stamford and the Connecticut Gold Coast are home to some of the most refined residential design in the Northeast. Jin Pang Homes serves this discerning clientele with full-service design that matches the market\'s sophistication.',
    descriptionCn: '斯坦福和康涅狄格黄金海岸拥有东北部一些最精致的住宅设计。Jin Pang Homes 以全案设计服务这些挑剔的客户，与市场的精致度相匹配。',
    serviceHighlights: ['Luxury home design', 'Corporate office interiors', 'Transitional style expertise'],
    serviceHighlightsCn: ['豪华住宅设计', '企业办公室室内设计', '过渡风格专业知识'],
    nearbyLocations: ['greenwich', 'orange-county', 'new-york'],
  },
];

export function getLocationBySlug(slug: string): LocationData | undefined {
  return locations.find(l => l.slug === slug);
}
