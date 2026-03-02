import type { FooterSection, Locale } from './types';

export function getDefaultFooter(locale: Locale): FooterSection {
  const isEnglish = locale === 'en';

  return {
    brand: {
      logoText: 'BIZ',
      name: 'Business Name',
      description: isEnglish
        ? 'Helping customers with high-quality, professional service.'
        : '以高品质、专业的服务支持客户需求。',
    },
    quickLinks: [
      { text: isEnglish ? 'About Us' : '关于我们', url: `/${locale}/about` },
      { text: isEnglish ? 'Services' : '服务项目', url: `/${locale}/services` },
      { text: isEnglish ? 'Conditions' : '治疗病症', url: `/${locale}/conditions` },
      { text: isEnglish ? 'Case Studies' : '案例研究', url: `/${locale}/case-studies` },
      { text: isEnglish ? 'Getting Started' : '新用户指南', url: `/${locale}/new-patients` },
      { text: isEnglish ? 'Blog' : '博客', url: `/${locale}/blog` },
      { text: isEnglish ? 'Contact' : '联系我们', url: `/${locale}/contact` },
    ],
    services: [
      { text: isEnglish ? 'Featured Services' : '特色服务', url: `/${locale}/services` },
      { text: isEnglish ? 'Plans & Packages' : '方案与套餐', url: `/${locale}/services` },
      { text: isEnglish ? 'How It Works' : '服务流程', url: `/${locale}/services` },
      { text: isEnglish ? 'Support' : '支持与帮助', url: `/${locale}/contact` },
    ],
    contact: {
      addressLines: [
        isEnglish ? 'Address line 1' : '地址第一行',
        isEnglish ? 'City, State ZIP' : '城市, 省/州 邮编',
      ],
      phone: '(000) 000-0000',
      phoneLink: 'tel:+10000000000',
      email: 'info@example.com',
      emailLink: 'mailto:info@example.com',
    },
    hours: ['Mon-Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 2:00 PM'],
    legalLinks: [
      { text: isEnglish ? 'Privacy Policy' : '隐私政策', url: `/${locale}/privacy` },
      { text: isEnglish ? 'Terms of Service' : '服务条款', url: `/${locale}/terms` },
    ],
    copyright: isEnglish
      ? '© {year} Business Name. All rights reserved.'
      : '© {year} Business Name. 版权所有。',
  };
}
