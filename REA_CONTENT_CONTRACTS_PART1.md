# BAAM System G2 — REA Content Contracts
# Part 1 of 3: Global Contracts (G1–G6)

> **Document:** REA_CONTENT_CONTRACTS_PART1.md
> **System:** BAAM System G2 — Real Estate Agent (REA Premium)
> **Version:** 1.0
> **Date:** March 2026
> **Part:** 1 of 3 — Global Contracts
> **Cursor usage:** Attach during Phase 0B (theme) and Phase 0C (global seed data)
> **Reference:** `@REA_COMPLETE_PLAN.md` for architecture context

---

## How to Read This Document

Each contract has four parts:

1. **Schema** — TypeScript interface. Every field typed and explained.
2. **Seed JSON (EN)** — Realistic data for Jin Pang / jinpanghomes.com. Not placeholders.
3. **Seed JSON (ZH)** — Chinese locale version. Native Chinese — not translated from English.
4. **Admin Form Fields** — Exact fields that appear in the ContentEditor / Site Settings panel.

**File location convention:**
```
content/[site-id]/en/[global-name].json      ← English locale
content/[site-id]/zh/[global-name].json      ← Chinese locale
content/[site-id]/en/pages/[slug].json       ← Page content
content/[site-id]/en/[collection]/[slug].json ← Collection items
```

**Site ID for Jin Pang:** `jinpang-homes`

---

## Global Contracts Index

- [G1: site.json](#g1-sitejson) — Agent identity, license, compliance, integrations
- [G2: header.json](#g2-headerjson) — Logo, navigation CTA, phone, topbar
- [G3: footer.json](#g3-footerjson) — Links, contact, compliance block
- [G4: navigation.json](#g4-navigationjson) — Full nav structure with dropdowns
- [G5: seo.json](#g5-seojson) — Default SEO, OG, Twitter card defaults
- [G6: theme.json](#g6-themejson) — Full design token set (colors, typography, spacing, effects)

---

## G1: site.json

**File:** `content/jinpang-homes/en/site.json`  
**Chinese:** `content/jinpang-homes/zh/site.json`  
**Admin location:** Site Settings → General  
**Purpose:** Single source of truth for all agent identity, compliance text, and integrations. Zero hardcoded agent info anywhere in page components — everything references this file.

### Schema

```typescript
interface SiteConfig {
  id: string                          // Matches _sites.json key: "jinpang-homes"
  name: string                        // Agent's professional name
  businessName: string                // DBA or brokerage-affiliated name for compliance
  tagline: string                     // Short tagline ≤ 10 words
  subtagline?: string                 // Optional longer tagline
  phone: string                       // Primary voice phone, formatted: (845) 555-0100
  smsPhone: string                    // SMS-capable number (may be same as phone)
  email: string                       // Primary contact email
  wechatId?: string                   // WeChat ID (optional — for Chinese market)
  wechatQrImage?: string              // WeChat QR code image URL
  address: {
    street: string                    // "21 Painted Apron Ter"
    city: string                      // "Port Jervis"
    state: string                     // "NY"
    zip: string                       // "12771"
    full: string                      // Single-line formatted address
    mapsUrl: string                   // Google Maps deep link
    mapsEmbedUrl: string              // Embed URL for <iframe>
    lat?: number                      // For LocalBusiness schema.org
    lng?: number
  }
  license: {
    agentType: string                 // "Licensed Real Estate Salesperson" | "Licensed Real Estate Broker"
    licenseNumber: string             // NY state license number
    licenseState: string              // "NY"
    brokerageName: string             // Affiliated brokerage name (required by NY DOS)
    brokerageLicense: string          // Brokerage license number
    brokerName: string                // Principal broker's name
    mlsName: string                   // "OneKey MLS" | "Hudson Valley MLS" | etc.
    mlsMemberId?: string              // MLS member ID
  }
  social: {
    facebook?: string
    instagram?: string
    linkedin?: string
    youtube?: string
    twitter?: string
    zillow?: string                   // Zillow profile URL — important for agents
    realtorCom?: string               // Realtor.com profile URL
    tiktok?: string
  }
  compliance: {
    mlsDisclaimer: string             // Full MLS/IDX disclaimer paragraph
    equalHousingText: string          // "Equal Housing Opportunity"
    fairHousingStatement: string      // Full fair housing pledge
    stateDisclosure: string           // NY DOS required advertising disclosure
    calculatorDisclaimer: string      // Required disclaimer for all financial calculators
  }
  officeHours: {
    weekdays: string                  // "Mon–Fri 9am–6pm"
    saturday: string                  // "Sat 10am–4pm"
    sunday: string                    // "Sun by appointment"
  }
  locale: string                      // "en"
  localesEnabled: string[]            // ["en", "zh"]
  stats: {
    totalVolume: string               // "$45M+" — display string
    totalTransactions: string         // "120+"
    yearsExperience: string           // "8+"
    fiveStarReviews: string           // "90+"
    neighborhoodsServed: string       // "12+"
  }
  responsePromise: string             // "I personally respond within 2 hours during business hours."
  integrations: {
    googleAnalyticsId?: string        // "G-XXXXXXXXXX"
    googleTagManagerId?: string       // "GTM-XXXXXXX"
    googleMapsApiKey?: string
    resendApiKey?: string             // Email delivery
    supabaseUrl: string
    supabaseAnonKey: string
    unsplashAccessKey?: string
    pexelsApiKey?: string
    idxProviderId?: string            // MLS/IDX provider ID
    crmWebhookUrl?: string            // CRM sink webhook
  }
}
```

### Seed JSON (EN)

```json
{
  "id": "jinpang-homes",
  "name": "Jin Pang",
  "businessName": "Jin Pang Real Estate",
  "tagline": "Your Port Jervis & Orange County Real Estate Expert",
  "subtagline": "Expert real estate guidance in English and Chinese — for buyers, sellers, and investors across Orange County, NY.",
  "phone": "(845) 555-0142",
  "smsPhone": "(845) 555-0142",
  "email": "jin@jinpanghomes.com",
  "wechatId": "jinpanghomes",
  "wechatQrImage": "",
  "address": {
    "street": "21 Painted Apron Ter",
    "city": "Port Jervis",
    "state": "NY",
    "zip": "12771",
    "full": "21 Painted Apron Ter, Port Jervis, NY 12771",
    "mapsUrl": "https://maps.google.com/?q=21+Painted+Apron+Ter+Port+Jervis+NY+12771",
    "mapsEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001.0000000000!2d-74.6931!3d41.3751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s21+Painted+Apron+Ter%2C+Port+Jervis%2C+NY+12771!5e0!3m2!1sen!2sus!4v1234567890",
    "lat": 41.3751,
    "lng": -74.6931
  },
  "license": {
    "agentType": "Licensed Real Estate Salesperson",
    "licenseNumber": "10401300000",
    "licenseState": "NY",
    "brokerageName": "Jin Pang Homes",
    "brokerageLicense": "10991200000",
    "brokerName": "Principal Broker Name",
    "mlsName": "OneKey MLS",
    "mlsMemberId": ""
  },
  "social": {
    "facebook": "https://www.facebook.com/jinpanghomes",
    "instagram": "https://www.instagram.com/jinpanghomes",
    "linkedin": "https://www.linkedin.com/in/jinpang-realtor",
    "youtube": "",
    "twitter": "",
    "zillow": "https://www.zillow.com/profile/jinpang",
    "realtorCom": "https://www.realtor.com/realestateagents/jinpang",
    "tiktok": ""
  },
  "compliance": {
    "mlsDisclaimer": "All listing information is from sources deemed reliable but is not guaranteed. Information is provided for consumers' personal, non-commercial use and may not be used for any purpose other than to identify prospective properties consumers may be interested in purchasing. All properties are subject to prior sale, change or withdrawal.",
    "equalHousingText": "Equal Housing Opportunity",
    "fairHousingStatement": "Jin Pang Real Estate is pledged to the letter and spirit of U.S. policy for the achievement of equal housing opportunity throughout the Nation. We encourage and support an affirmative advertising and marketing program in which there are no barriers to obtaining housing because of race, color, religion, sex, handicap, familial status, or national origin.",
    "stateDisclosure": "Jin Pang is a Licensed Real Estate Salesperson affiliated with Jin Pang Homes, a licensed real estate broker. The following are terms of a Listing agreement for Jin Pang to assist the seller(s) or an agreement for Jin Pang to assist the buyer(s).",
    "calculatorDisclaimer": "This calculator is for informational and educational purposes only. All calculations are estimates and do not constitute financial, legal, or mortgage advice. Please consult a licensed mortgage professional for personalized guidance. Interest rates and loan terms are subject to change and lender qualification requirements."
  },
  "officeHours": {
    "weekdays": "Mon–Fri 9am–6pm",
    "saturday": "Sat 10am–4pm",
    "sunday": "Sun by appointment"
  },
  "locale": "en",
  "localesEnabled": ["en", "zh"],
  "stats": {
    "totalVolume": "$45M+",
    "totalTransactions": "120+",
    "yearsExperience": "8+",
    "fiveStarReviews": "90+",
    "neighborhoodsServed": "12+"
  },
  "responsePromise": "I personally respond within 2 hours during business hours.",
  "integrations": {
    "googleAnalyticsId": "",
    "googleTagManagerId": "",
    "googleMapsApiKey": "",
    "resendApiKey": "",
    "supabaseUrl": "",
    "supabaseAnonKey": "",
    "unsplashAccessKey": "",
    "pexelsApiKey": "",
    "idxProviderId": "",
    "crmWebhookUrl": ""
  }
}
```

### Seed JSON (ZH)

```json
{
  "id": "jinpang-homes",
  "name": "庞锦",
  "businessName": "庞锦房地产",
  "tagline": "您在波特杰维斯及橙县的专业华人地产经纪人",
  "subtagline": "精通中英双语，为买家、卖家及投资者提供全方位橙县纽约房产服务。",
  "phone": "(845) 555-0142",
  "smsPhone": "(845) 555-0142",
  "email": "jin@jinpanghomes.com",
  "wechatId": "jinpanghomes",
  "wechatQrImage": "",
  "address": {
    "street": "21 Painted Apron Ter",
    "city": "Port Jervis",
    "state": "NY",
    "zip": "12771",
    "full": "21 Painted Apron Ter, Port Jervis, NY 12771",
    "mapsUrl": "https://maps.google.com/?q=21+Painted+Apron+Ter+Port+Jervis+NY+12771",
    "mapsEmbedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3001.0000000000!2d-74.6931!3d41.3751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s21+Painted+Apron+Ter%2C+Port+Jervis%2C+NY+12771!5e0!3m2!1sen!2sus!4v1234567890",
    "lat": 41.3751,
    "lng": -74.6931
  },
  "license": {
    "agentType": "纽约州持牌房产销售员",
    "licenseNumber": "10401300000",
    "licenseState": "NY",
    "brokerageName": "Jin Pang Homes",
    "brokerageLicense": "10991200000",
    "brokerName": "Principal Broker Name",
    "mlsName": "OneKey MLS",
    "mlsMemberId": ""
  },
  "social": {
    "facebook": "https://www.facebook.com/jinpanghomes",
    "instagram": "https://www.instagram.com/jinpanghomes",
    "linkedin": "https://www.linkedin.com/in/jinpang-realtor",
    "youtube": "",
    "twitter": "",
    "zillow": "https://www.zillow.com/profile/jinpang",
    "realtorCom": "https://www.realtor.com/realestateagents/jinpang",
    "tiktok": ""
  },
  "compliance": {
    "mlsDisclaimer": "所有挂牌信息来源被认为可靠，但不作保证。信息仅供消费者个人、非商业用途，不得用于识别潜在购房者以外的任何目的。所有房产均须在售出、变更或撤回前确认。",
    "equalHousingText": "机会均等住房",
    "fairHousingStatement": "庞锦房地产承诺遵守美国平等住房机会政策的文字与精神，在全国范围内实现平等住房机会。我们鼓励并支持积极的广告和营销计划，确保因种族、肤色、宗教、性别、残疾、家庭状况或原国籍而不受任何障碍地获得住房。",
    "stateDisclosure": "庞锦是纽约州持牌房产销售员，隶属于持牌房产经纪公司 Jin Pang Homes。",
    "calculatorDisclaimer": "本计算器仅供参考和教育目的。所有计算均为估算，不构成财务、法律或按揭建议。请咨询持牌按揭专业人士获取个性化指导。利率和贷款条款受市场变动和贷款人资格要求影响。"
  },
  "officeHours": {
    "weekdays": "周一至周五 上午9时至下午6时",
    "saturday": "周六 上午10时至下午4时",
    "sunday": "周日 预约服务"
  },
  "locale": "zh",
  "localesEnabled": ["en", "zh"],
  "stats": {
    "totalVolume": "4500万美元以上",
    "totalTransactions": "120笔以上",
    "yearsExperience": "8年以上",
    "fiveStarReviews": "90条以上五星好评",
    "neighborhoodsServed": "12个以上社区"
  },
  "responsePromise": "工作时间内，我本人承诺在2小时内回复您的咨询。",
  "integrations": {
    "googleAnalyticsId": "",
    "googleTagManagerId": "",
    "googleMapsApiKey": "",
    "resendApiKey": "",
    "supabaseUrl": "",
    "supabaseAnonKey": "",
    "unsplashAccessKey": "",
    "pexelsApiKey": "",
    "idxProviderId": "",
    "crmWebhookUrl": ""
  }
}
```

### Admin Form Fields

```
Section: Agent Identity
  name:               text, required
  businessName:       text, required
  tagline:            text, required, max 80 chars
  subtagline:         textarea, optional
  phone:              text, required, format hint: (845) 555-0000
  smsPhone:           text, required
  email:              email, required
  wechatId:           text, optional
  wechatQrImage:      image picker, optional

Section: Address
  address.street:     text, required
  address.city:       text, required
  address.state:      text, required, max 2 chars
  address.zip:        text, required
  address.full:       text, required (auto-populated helper)
  address.mapsUrl:    url, required
  address.mapsEmbedUrl: url, required
  address.lat:        number, optional
  address.lng:        number, optional

Section: License & Compliance
  license.agentType:          select ["Licensed Real Estate Salesperson", "Licensed Real Estate Broker"]
  license.licenseNumber:      text, required
  license.licenseState:       text, required
  license.brokerageName:      text, required
  license.brokerageLicense:   text, required
  license.brokerName:         text, required
  license.mlsName:            text, required
  license.mlsMemberId:        text, optional

Section: Social Links
  social.facebook:    url, optional
  social.instagram:   url, optional
  social.linkedin:    url, optional
  social.zillow:      url, optional (high priority for agents)
  social.realtorCom:  url, optional
  social.youtube:     url, optional
  social.tiktok:      url, optional

Section: Office Hours
  officeHours.weekdays:   text, required
  officeHours.saturday:   text, required
  officeHours.sunday:     text, required

Section: Career Stats
  stats.totalVolume:          text, required
  stats.totalTransactions:    text, required
  stats.yearsExperience:      text, required
  stats.fiveStarReviews:      text, required
  stats.neighborhoodsServed:  text, required
  responsePromise:            text, optional

Section: Compliance Text (protected — warn before editing)
  compliance.mlsDisclaimer:       textarea, required
  compliance.equalHousingText:    text, required
  compliance.fairHousingStatement: textarea, required
  compliance.stateDisclosure:     textarea, required
  compliance.calculatorDisclaimer: textarea, required

Section: Integrations (admin-only, hidden from staff role)
  integrations.googleAnalyticsId:  text, optional
  integrations.googleTagManagerId: text, optional
  integrations.googleMapsApiKey:   text, optional
  integrations.idxProviderId:      text, optional
  integrations.crmWebhookUrl:      url, optional
```

---

## G2: header.json

**File:** `content/jinpang-homes/en/header.json`  
**Chinese:** `content/jinpang-homes/zh/header.json`  
**Admin location:** Site Settings → Header  
**Purpose:** Controls everything visible in the site header: logo, nav links, primary CTA button, topbar (phone, email, social), announcement bar.

### Schema

```typescript
interface HeaderConfig {
  logo: {
    text: string                  // Agent name displayed as text logo
    image?: string                // Optional image logo URL
    imageAlt?: string
    tagline?: string              // Short tagline under name (optional)
    href: string                  // Logo links to: "/" (home)
  }
  topbar: {
    enabled: boolean
    phone: string                 // Display-formatted phone
    phoneHref: string             // "tel:+18455550142"
    smsHref: string               // "sms:+18455550142"
    email: string
    emailHref: string             // "mailto:jin@jinpanghomes.com"
    wechatLabel?: string          // "WeChat: jinpanghomes" — shows only on ZH locale
    showLanguageSwitcher: boolean // true
    socialLinks: {
      instagram?: string
      facebook?: string
      linkedin?: string
      zillow?: string
    }
  }
  nav: NavItem[]
  ctaButton: {
    label: string                 // "Book a Consultation"
    href: string                  // "/contact"
    variant: "primary" | "secondary" | "outline"
  }
  mobileCtaButton?: {
    label: string                 // Shorter label for mobile: "Book Now"
    href: string
  }
  announcementBar?: {
    enabled: boolean
    text: string
    linkLabel?: string
    linkHref?: string
    bgColor?: string              // CSS variable or hex — defaults to primary
  }
  transparentOnHero: boolean      // true — hero pages get transparent header
}

interface NavItem {
  label: string
  href?: string                   // If no href, this is a parent with children
  children?: NavItem[]
  highlight?: boolean             // Shows accent color — for "Book Consultation" type items
  externalLink?: boolean
}
```

### Seed JSON (EN)

```json
{
  "logo": {
    "text": "Jin Pang",
    "image": "",
    "imageAlt": "Jin Pang Real Estate",
    "tagline": "Port Jervis & Orange County",
    "href": "/en"
  },
  "topbar": {
    "enabled": true,
    "phone": "(845) 555-0142",
    "phoneHref": "tel:+18455550142",
    "smsHref": "sms:+18455550142",
    "email": "jin@jinpanghomes.com",
    "emailHref": "mailto:jin@jinpanghomes.com",
    "wechatLabel": "",
    "showLanguageSwitcher": true,
    "socialLinks": {
      "instagram": "https://www.instagram.com/jinpanghomes",
      "facebook": "https://www.facebook.com/jinpanghomes",
      "linkedin": "https://www.linkedin.com/in/jinpang-realtor",
      "zillow": "https://www.zillow.com/profile/jinpang"
    }
  },
  "nav": [
    {
      "label": "Properties",
      "children": [
        { "label": "For Sale", "href": "/en/properties" },
        { "label": "Sold Portfolio", "href": "/en/sold" },
        { "label": "Neighborhoods", "href": "/en/neighborhoods" }
      ]
    },
    {
      "label": "Buy",
      "href": "/en/buying"
    },
    {
      "label": "Sell",
      "href": "/en/selling"
    },
    {
      "label": "Invest",
      "href": "/en/investing"
    },
    {
      "label": "Relocate",
      "href": "/en/relocating"
    },
    {
      "label": "About",
      "children": [
        { "label": "My Story", "href": "/en/about" },
        { "label": "Case Studies", "href": "/en/case-studies" },
        { "label": "Testimonials", "href": "/en/testimonials" }
      ]
    },
    {
      "label": "Knowledge",
      "children": [
        { "label": "Blog", "href": "/en/blog" },
        { "label": "Market Reports", "href": "/en/market-reports" },
        { "label": "Resources & Guides", "href": "/en/resources" },
        { "label": "FAQ", "href": "/en/faq" }
      ]
    }
  ],
  "ctaButton": {
    "label": "Book a Consultation",
    "href": "/en/contact",
    "variant": "primary"
  },
  "mobileCtaButton": {
    "label": "Book Now",
    "href": "/en/contact"
  },
  "announcementBar": {
    "enabled": false,
    "text": "Now accepting new buyer and seller clients for Spring 2026.",
    "linkLabel": "Schedule a call →",
    "linkHref": "/en/contact",
    "bgColor": ""
  },
  "transparentOnHero": true
}
```

### Seed JSON (ZH)

```json
{
  "logo": {
    "text": "庞锦",
    "image": "",
    "imageAlt": "庞锦房地产",
    "tagline": "波特杰维斯 及 橙县",
    "href": "/zh"
  },
  "topbar": {
    "enabled": true,
    "phone": "(845) 555-0142",
    "phoneHref": "tel:+18455550142",
    "smsHref": "sms:+18455550142",
    "email": "jin@jinpanghomes.com",
    "emailHref": "mailto:jin@jinpanghomes.com",
    "wechatLabel": "微信: jinpanghomes",
    "showLanguageSwitcher": true,
    "socialLinks": {
      "instagram": "https://www.instagram.com/jinpanghomes",
      "facebook": "https://www.facebook.com/jinpanghomes",
      "linkedin": "https://www.linkedin.com/in/jinpang-realtor",
      "zillow": "https://www.zillow.com/profile/jinpang"
    }
  },
  "nav": [
    {
      "label": "房源",
      "children": [
        { "label": "在售房源", "href": "/zh/properties" },
        { "label": "成交记录", "href": "/zh/sold" },
        { "label": "社区指南", "href": "/zh/neighborhoods" }
      ]
    },
    { "label": "购房", "href": "/zh/buying" },
    { "label": "卖房", "href": "/zh/selling" },
    { "label": "投资", "href": "/zh/investing" },
    { "label": "搬迁", "href": "/zh/relocating" },
    {
      "label": "关于我",
      "children": [
        { "label": "我的故事", "href": "/zh/about" },
        { "label": "成功案例", "href": "/zh/case-studies" },
        { "label": "客户评价", "href": "/zh/testimonials" }
      ]
    },
    {
      "label": "资讯",
      "children": [
        { "label": "博客", "href": "/zh/blog" },
        { "label": "市场报告", "href": "/zh/market-reports" },
        { "label": "资源与指南", "href": "/zh/resources" },
        { "label": "常见问题", "href": "/zh/faq" }
      ]
    }
  ],
  "ctaButton": {
    "label": "预约咨询",
    "href": "/zh/contact",
    "variant": "primary"
  },
  "mobileCtaButton": {
    "label": "立即预约",
    "href": "/zh/contact"
  },
  "announcementBar": {
    "enabled": false,
    "text": "2026年春季现接受新客户预约，名额有限。",
    "linkLabel": "立即预约 →",
    "linkHref": "/zh/contact",
    "bgColor": ""
  },
  "transparentOnHero": true
}
```

### Admin Form Fields

```
Section: Logo
  logo.text:      text, required (agent name)
  logo.image:     image picker, optional
  logo.imageAlt:  text, optional
  logo.tagline:   text, optional, max 40 chars

Section: Topbar
  topbar.enabled:             toggle
  topbar.phone:               text, required
  topbar.phoneHref:           text, required (auto-format: tel:+1XXXXXXXXXX)
  topbar.smsHref:             text, required
  topbar.email:               email, required
  topbar.emailHref:           text, required
  topbar.wechatLabel:         text, optional
  topbar.showLanguageSwitcher: toggle
  topbar.socialLinks.instagram: url, optional
  topbar.socialLinks.facebook:  url, optional
  topbar.socialLinks.linkedin:  url, optional
  topbar.socialLinks.zillow:    url, optional

Section: Navigation
  nav:  nav-editor UI (add/remove/reorder items, toggle dropdown)

Section: CTA Button
  ctaButton.label:    text, required
  ctaButton.href:     text, required
  ctaButton.variant:  select ["primary", "secondary", "outline"]
  mobileCtaButton.label: text, optional
  mobileCtaButton.href:  text, optional

Section: Announcement Bar
  announcementBar.enabled:    toggle
  announcementBar.text:       text
  announcementBar.linkLabel:  text, optional
  announcementBar.linkHref:   text, optional

Section: Behavior
  transparentOnHero: toggle
```

---

## G3: footer.json

**File:** `content/jinpang-homes/en/footer.json`  
**Chinese:** `content/jinpang-homes/zh/footer.json`  
**Admin location:** Site Settings → Footer  
**Purpose:** Full footer layout — link columns, contact info, compliance block, license display, equal housing logo.

### Schema

```typescript
interface FooterConfig {
  tagline: string                   // Short footer tagline (different from header)
  columns: FooterColumn[]
  contact: {
    phone: string
    phoneHref: string
    smsHref: string
    email: string
    emailHref: string
    address: string                 // Single-line address
    officeHoursLabel: string        // "Office Hours"
    officeHours: {
      weekdays: string
      saturday: string
      sunday: string
    }
  }
  socialLinks: {
    instagram?: string
    facebook?: string
    linkedin?: string
    zillow?: string
    realtorCom?: string
    youtube?: string
  }
  compliance: {
    agentName: string
    agentLicense: string
    licenseState: string
    agentType: string
    brokerageName: string
    brokerageLicense: string
    equalHousingLogo: boolean       // true — always show EHO logo
    equalHousingText: string
    mlsDisclaimer: string
    copyright: string               // "© 2026 Jin Pang Real Estate. All rights reserved."
    poweredBy?: string              // "Technical Support by baamplatform.com"
  }
  legalLinks: {
    label: string
    href: string
  }[]
}

interface FooterColumn {
  heading: string
  links: {
    label: string
    href: string
    external?: boolean
  }[]
}
```

### Seed JSON (EN)

```json
{
  "tagline": "Your trusted real estate partner in Port Jervis and Orange County, NY.",
  "columns": [
    {
      "heading": "Services",
      "links": [
        { "label": "Buy a Home", "href": "/en/buying" },
        { "label": "Sell Your Home", "href": "/en/selling" },
        { "label": "Home Valuation", "href": "/en/home-valuation" },
        { "label": "Investing", "href": "/en/investing" },
        { "label": "Relocating", "href": "/en/relocating" }
      ]
    },
    {
      "heading": "Properties",
      "links": [
        { "label": "All Listings", "href": "/en/properties" },
        { "label": "Sold Portfolio", "href": "/en/sold" },
        { "label": "Neighborhoods", "href": "/en/neighborhoods" },
        { "label": "Case Studies", "href": "/en/case-studies" }
      ]
    },
    {
      "heading": "Resources",
      "links": [
        { "label": "Blog", "href": "/en/blog" },
        { "label": "Market Reports", "href": "/en/market-reports" },
        { "label": "Guides & Downloads", "href": "/en/resources" },
        { "label": "FAQ", "href": "/en/faq" },
        { "label": "Testimonials", "href": "/en/testimonials" }
      ]
    },
    {
      "heading": "Company",
      "links": [
        { "label": "About Jin Pang", "href": "/en/about" },
        { "label": "Contact", "href": "/en/contact" },
        { "label": "Zillow Profile", "href": "https://www.zillow.com/profile/jinpang", "external": true },
        { "label": "Realtor.com Profile", "href": "https://www.realtor.com/realestateagents/jinpang", "external": true }
      ]
    }
  ],
  "contact": {
    "phone": "(845) 555-0142",
    "phoneHref": "tel:+18455550142",
    "smsHref": "sms:+18455550142",
    "email": "jin@jinpanghomes.com",
    "emailHref": "mailto:jin@jinpanghomes.com",
    "address": "21 Painted Apron Ter, Port Jervis, NY 12771",
    "officeHoursLabel": "Office Hours",
    "officeHours": {
      "weekdays": "Mon–Fri 9am–6pm",
      "saturday": "Sat 10am–4pm",
      "sunday": "Sun by appointment"
    }
  },
  "socialLinks": {
    "instagram": "https://www.instagram.com/jinpanghomes",
    "facebook": "https://www.facebook.com/jinpanghomes",
    "linkedin": "https://www.linkedin.com/in/jinpang-realtor",
    "zillow": "https://www.zillow.com/profile/jinpang",
    "realtorCom": "https://www.realtor.com/realestateagents/jinpang",
    "youtube": ""
  },
  "compliance": {
    "agentName": "Jin Pang",
    "agentLicense": "10401300000",
    "licenseState": "NY",
    "agentType": "Licensed Real Estate Salesperson",
    "brokerageName": "Jin Pang Homes",
    "brokerageLicense": "10991200000",
    "equalHousingLogo": true,
    "equalHousingText": "Equal Housing Opportunity",
    "mlsDisclaimer": "All listing information is from sources deemed reliable but is not guaranteed. Information is provided for consumers' personal, non-commercial use and may not be used for any purpose other than to identify prospective properties consumers may be interested in purchasing.",
    "copyright": "© 2026 Jin Pang Real Estate. All rights reserved.",
    "poweredBy": "Technical Support by baamplatform.com"
  },
  "legalLinks": [
    { "label": "Privacy Policy", "href": "/en/privacy" },
    { "label": "Terms of Service", "href": "/en/terms" }
  ]
}
```

### Seed JSON (ZH)

```json
{
  "tagline": "您在波特杰维斯及纽约橙县值得信赖的房产合作伙伴。",
  "columns": [
    {
      "heading": "服务项目",
      "links": [
        { "label": "购房服务", "href": "/zh/buying" },
        { "label": "卖房服务", "href": "/zh/selling" },
        { "label": "房屋估值", "href": "/zh/home-valuation" },
        { "label": "投资房产", "href": "/zh/investing" },
        { "label": "搬迁服务", "href": "/zh/relocating" }
      ]
    },
    {
      "heading": "房源信息",
      "links": [
        { "label": "全部房源", "href": "/zh/properties" },
        { "label": "成交记录", "href": "/zh/sold" },
        { "label": "社区指南", "href": "/zh/neighborhoods" },
        { "label": "成功案例", "href": "/zh/case-studies" }
      ]
    },
    {
      "heading": "资讯资源",
      "links": [
        { "label": "博客", "href": "/zh/blog" },
        { "label": "市场报告", "href": "/zh/market-reports" },
        { "label": "指南与资料下载", "href": "/zh/resources" },
        { "label": "常见问题", "href": "/zh/faq" },
        { "label": "客户评价", "href": "/zh/testimonials" }
      ]
    },
    {
      "heading": "关于我",
      "links": [
        { "label": "庞锦简介", "href": "/zh/about" },
        { "label": "联系我们", "href": "/zh/contact" },
        { "label": "Zillow 主页", "href": "https://www.zillow.com/profile/jinpang", "external": true },
        { "label": "Realtor.com 主页", "href": "https://www.realtor.com/realestateagents/jinpang", "external": true }
      ]
    }
  ],
  "contact": {
    "phone": "(845) 555-0142",
    "phoneHref": "tel:+18455550142",
    "smsHref": "sms:+18455550142",
    "email": "jin@jinpanghomes.com",
    "emailHref": "mailto:jin@jinpanghomes.com",
    "address": "21 Painted Apron Ter, Port Jervis, NY 12771",
    "officeHoursLabel": "工作时间",
    "officeHours": {
      "weekdays": "周一至周五 9:00–18:00",
      "saturday": "周六 10:00–16:00",
      "sunday": "周日 预约服务"
    }
  },
  "socialLinks": {
    "instagram": "https://www.instagram.com/jinpanghomes",
    "facebook": "https://www.facebook.com/jinpanghomes",
    "linkedin": "https://www.linkedin.com/in/jinpang-realtor",
    "zillow": "https://www.zillow.com/profile/jinpang",
    "realtorCom": "https://www.realtor.com/realestateagents/jinpang",
    "youtube": ""
  },
  "compliance": {
    "agentName": "庞锦 (Jin Pang)",
    "agentLicense": "10401300000",
    "licenseState": "NY",
    "agentType": "纽约州持牌房产销售员",
    "brokerageName": "Jin Pang Homes",
    "brokerageLicense": "10991200000",
    "equalHousingLogo": true,
    "equalHousingText": "机会均等住房",
    "mlsDisclaimer": "所有挂牌信息来源被认为可靠，但不作保证。信息仅供消费者个人、非商业用途。",
    "copyright": "© 2026 庞锦房地产。版权所有。",
    "poweredBy": "Technical Support by baamplatform.com"
  },
  "legalLinks": [
    { "label": "隐私政策", "href": "/zh/privacy" },
    { "label": "服务条款", "href": "/zh/terms" }
  ]
}
```

### Admin Form Fields

```
Section: Footer Tagline
  tagline: text, required, max 120 chars

Section: Link Columns (array editor — add/remove/reorder columns and links)
  columns[n].heading:        text
  columns[n].links[n].label: text
  columns[n].links[n].href:  text
  columns[n].links[n].external: toggle

Section: Contact Block
  contact.phone:           text, required
  contact.phoneHref:       text, required
  contact.smsHref:         text, required
  contact.email:           email, required
  contact.address:         text, required
  contact.officeHoursLabel: text
  contact.officeHours.weekdays: text
  contact.officeHours.saturday: text
  contact.officeHours.sunday:   text

Section: Social Links
  socialLinks.instagram:  url, optional
  socialLinks.facebook:   url, optional
  socialLinks.linkedin:   url, optional
  socialLinks.zillow:     url, optional
  socialLinks.realtorCom: url, optional
  socialLinks.youtube:    url, optional

Section: Compliance (protected)
  compliance.agentName:         text, required
  compliance.agentLicense:      text, required
  compliance.licenseState:      text, required
  compliance.agentType:         text, required
  compliance.brokerageName:     text, required
  compliance.brokerageLicense:  text, required
  compliance.equalHousingLogo:  toggle
  compliance.copyright:         text, required
  compliance.mlsDisclaimer:     textarea, required

Section: Legal Links (array)
  legalLinks[n].label: text
  legalLinks[n].href:  text
```

---

## G4: navigation.json

**File:** `content/jinpang-homes/en/navigation.json`  
**Chinese:** `content/jinpang-homes/zh/navigation.json`  
**Admin location:** Site Settings → Navigation  
**Purpose:** Full navigation tree used by header nav, mobile drawer, footer link validation, and sitemap generation.

### Schema

```typescript
interface NavigationConfig {
  primary: NavItem[]              // Main header nav
  footer: FooterNavGroup[]        // Mirror of footer columns (reference only — actual footer in footer.json)
  breadcrumbRoots: {              // Used to generate breadcrumb schemas
    [key: string]: string         // e.g., { "blog": "Blog", "case-studies": "Case Studies" }
  }
  mobileDrawer: {
    showPhone: boolean
    showEmail: boolean
    showLanguageSwitcher: boolean
    showCta: boolean
  }
}

interface NavItem {
  id: string                      // Unique identifier for the nav item
  label: string
  href?: string
  children?: NavItem[]
  badge?: string                  // Optional badge: "New", "热门"
  icon?: string                   // Optional icon name
}
```

### Seed JSON (EN)

```json
{
  "primary": [
    {
      "id": "properties",
      "label": "Properties",
      "children": [
        { "id": "properties-all", "label": "All Listings", "href": "/en/properties" },
        { "id": "properties-sold", "label": "Sold Portfolio", "href": "/en/sold" },
        { "id": "properties-neighborhoods", "label": "Neighborhoods", "href": "/en/neighborhoods" }
      ]
    },
    { "id": "buying", "label": "Buy", "href": "/en/buying" },
    { "id": "selling", "label": "Sell", "href": "/en/selling" },
    { "id": "investing", "label": "Invest", "href": "/en/investing" },
    { "id": "relocating", "label": "Relocate", "href": "/en/relocating" },
    {
      "id": "about",
      "label": "About",
      "children": [
        { "id": "about-story", "label": "My Story", "href": "/en/about" },
        { "id": "about-cases", "label": "Case Studies", "href": "/en/case-studies" },
        { "id": "about-testimonials", "label": "Testimonials", "href": "/en/testimonials" }
      ]
    },
    {
      "id": "knowledge",
      "label": "Knowledge",
      "children": [
        { "id": "knowledge-blog", "label": "Blog", "href": "/en/blog" },
        { "id": "knowledge-reports", "label": "Market Reports", "href": "/en/market-reports" },
        { "id": "knowledge-resources", "label": "Resources & Guides", "href": "/en/resources" },
        { "id": "knowledge-faq", "label": "FAQ", "href": "/en/faq" }
      ]
    }
  ],
  "breadcrumbRoots": {
    "blog": "Blog",
    "market-reports": "Market Reports",
    "case-studies": "Case Studies",
    "neighborhoods": "Neighborhoods",
    "properties": "Properties"
  },
  "mobileDrawer": {
    "showPhone": true,
    "showEmail": true,
    "showLanguageSwitcher": true,
    "showCta": true
  }
}
```

### Seed JSON (ZH)

```json
{
  "primary": [
    {
      "id": "properties",
      "label": "房源",
      "children": [
        { "id": "properties-all", "label": "全部房源", "href": "/zh/properties" },
        { "id": "properties-sold", "label": "成交记录", "href": "/zh/sold" },
        { "id": "properties-neighborhoods", "label": "社区指南", "href": "/zh/neighborhoods" }
      ]
    },
    { "id": "buying", "label": "购房", "href": "/zh/buying" },
    { "id": "selling", "label": "卖房", "href": "/zh/selling" },
    { "id": "investing", "label": "投资", "href": "/zh/investing" },
    { "id": "relocating", "label": "搬迁", "href": "/zh/relocating" },
    {
      "id": "about",
      "label": "关于我",
      "children": [
        { "id": "about-story", "label": "我的故事", "href": "/zh/about" },
        { "id": "about-cases", "label": "成功案例", "href": "/zh/case-studies" },
        { "id": "about-testimonials", "label": "客户评价", "href": "/zh/testimonials" }
      ]
    },
    {
      "id": "knowledge",
      "label": "资讯",
      "children": [
        { "id": "knowledge-blog", "label": "博客", "href": "/zh/blog" },
        { "id": "knowledge-reports", "label": "市场报告", "href": "/zh/market-reports" },
        { "id": "knowledge-resources", "label": "资源与指南", "href": "/zh/resources" },
        { "id": "knowledge-faq", "label": "常见问题", "href": "/zh/faq" }
      ]
    }
  ],
  "breadcrumbRoots": {
    "blog": "博客",
    "market-reports": "市场报告",
    "case-studies": "成功案例",
    "neighborhoods": "社区指南",
    "properties": "房源"
  },
  "mobileDrawer": {
    "showPhone": true,
    "showEmail": true,
    "showLanguageSwitcher": true,
    "showCta": true
  }
}
```

---

## G5: seo.json

**File:** `content/jinpang-homes/en/seo.json`  
**Chinese:** `content/jinpang-homes/zh/seo.json`  
**Admin location:** Site Settings → SEO  
**Purpose:** Default SEO values. Every page overrides title/description — these are the site-wide fallbacks and OG image defaults.

### Schema

```typescript
interface SeoConfig {
  titleTemplate: string           // "{pageTitle} | Jin Pang — Port Jervis Real Estate"
  defaultTitle: string            // Used when page has no title
  defaultDescription: string
  defaultOgImage: string          // Absolute URL — agent photo or branded graphic
  defaultOgImageAlt: string
  siteUrl: string                 // "https://jinpanghomes.com" — no trailing slash
  twitterHandle?: string          // "@jinpanghomes"
  twitterCard: "summary" | "summary_large_image"
  locale: string                  // "en_US" | "zh_CN"
  alternateLocale: string         // The other locale
  robots: string                  // "index, follow"
  googleSiteVerification?: string
  bingSiteVerification?: string
  schemaOrg: {
    type: "RealEstateAgent"
    name: string
    url: string
    telephone: string
    email: string
    address: {
      streetAddress: string
      addressLocality: string
      addressRegion: string
      postalCode: string
      addressCountry: string
    }
    geo: {
      latitude: number
      longitude: number
    }
    priceRange?: string
    areaServed: string[]
    knowsLanguage: string[]
    memberOf?: string             // NAR, MLS name
  }
}
```

### Seed JSON (EN)

```json
{
  "titleTemplate": "{pageTitle} | Jin Pang — Port Jervis Real Estate",
  "defaultTitle": "Jin Pang | Port Jervis & Orange County NY Real Estate Agent",
  "defaultDescription": "Jin Pang is Port Jervis's top bilingual real estate agent serving buyers, sellers, and investors in Orange County NY. Expert service in English and Chinese 中文. Call (845) 555-0142.",
  "defaultOgImage": "https://jinpanghomes.com/og-default.jpg",
  "defaultOgImageAlt": "Jin Pang — Port Jervis & Orange County Real Estate Agent",
  "siteUrl": "https://jinpanghomes.com",
  "twitterHandle": "@jinpanghomes",
  "twitterCard": "summary_large_image",
  "locale": "en_US",
  "alternateLocale": "zh_CN",
  "robots": "index, follow",
  "googleSiteVerification": "",
  "bingSiteVerification": "",
  "schemaOrg": {
    "type": "RealEstateAgent",
    "name": "Jin Pang",
    "url": "https://jinpanghomes.com",
    "telephone": "+18455550142",
    "email": "jin@jinpanghomes.com",
    "address": {
      "streetAddress": "21 Painted Apron Ter",
      "addressLocality": "Port Jervis",
      "addressRegion": "NY",
      "postalCode": "12771",
      "addressCountry": "US"
    },
    "geo": {
      "latitude": 41.3751,
      "longitude": -74.6931
    },
    "priceRange": "$$",
    "areaServed": [
      "Port Jervis, NY",
      "Middletown, NY",
      "Goshen, NY",
      "Warwick, NY",
      "Newburgh, NY",
      "Huguenot, NY",
      "Sparrowbush, NY",
      "Orange County, NY"
    ],
    "knowsLanguage": ["en", "zh"],
    "memberOf": "OneKey MLS"
  }
}
```

### Seed JSON (ZH)

```json
{
  "titleTemplate": "{pageTitle} | 庞锦 — 波特杰维斯房产经纪",
  "defaultTitle": "庞锦 | 波特杰维斯及纽约橙县华人房产经纪人",
  "defaultDescription": "庞锦是波特杰维斯首席中英双语房产经纪人，为买家、卖家及投资者提供纽约橙县全方位专业服务。提供完整中文服务。联系电话：(845) 555-0142。",
  "defaultOgImage": "https://jinpanghomes.com/og-default-zh.jpg",
  "defaultOgImageAlt": "庞锦 — 波特杰维斯及橙县房产经纪人",
  "siteUrl": "https://jinpanghomes.com",
  "twitterHandle": "@jinpanghomes",
  "twitterCard": "summary_large_image",
  "locale": "zh_CN",
  "alternateLocale": "en_US",
  "robots": "index, follow",
  "googleSiteVerification": "",
  "bingSiteVerification": "",
  "schemaOrg": {
    "type": "RealEstateAgent",
    "name": "庞锦 (Jin Pang)",
    "url": "https://jinpanghomes.com/zh",
    "telephone": "+18455550142",
    "email": "jin@jinpanghomes.com",
    "address": {
      "streetAddress": "21 Painted Apron Ter",
      "addressLocality": "Port Jervis",
      "addressRegion": "NY",
      "postalCode": "12771",
      "addressCountry": "US"
    },
    "geo": {
      "latitude": 41.3751,
      "longitude": -74.6931
    },
    "priceRange": "$$",
    "areaServed": [
      "Port Jervis, NY",
      "Middletown, NY",
      "Goshen, NY",
      "Warwick, NY",
      "Newburgh, NY",
      "Orange County, NY"
    ],
    "knowsLanguage": ["en", "zh"],
    "memberOf": "OneKey MLS"
  }
}
```

### Admin Form Fields

```
Section: Title & Description
  titleTemplate:       text, required (hint: use {pageTitle} placeholder)
  defaultTitle:        text, required, max 60 chars
  defaultDescription:  textarea, required, max 160 chars

Section: Open Graph
  defaultOgImage:    image picker, required
  defaultOgImageAlt: text, required
  twitterHandle:     text, optional
  twitterCard:       select ["summary", "summary_large_image"]

Section: Site Info
  siteUrl:   url, required (no trailing slash)
  robots:    text, default "index, follow"
  googleSiteVerification: text, optional
  bingSiteVerification:   text, optional

Section: Schema.org Agent Data
  schemaOrg.priceRange:  text, optional ("$$")
  schemaOrg.areaServed:  tag-input array
  schemaOrg.knowsLanguage: tag-input array
  schemaOrg.memberOf:    text, optional
```

---

## G6: theme.json

**File:** `content/jinpang-homes/en/theme.json`  
**Note:** theme.json is locale-independent — one file applies to all locales.  
**Admin location:** Site Settings → Theme  
**Purpose:** Complete design token set. All visual values in the site derive from this file. No hardcoded hex in page components.

### Schema

```typescript
interface ThemeConfig {
  colors: ColorTokens
  typography: TypographyTokens
  borderRadius: BorderRadiusTokens
  spacing: SpacingTokens
  effects: EffectTokens
  layout: LayoutTokens
  components: ComponentTokens
}
```

### Full Seed JSON

```json
{
  "colors": {
    "primary":          "#18292F",
    "primaryLight":     "#EBF4F5",
    "primaryHover":     "#0F1D22",
    "secondary":        "#BFA880",
    "secondaryLight":   "#F5EFE4",
    "secondaryHover":   "#A88E68",
    "accent":           "#7BA99A",
    "accentDark":       "#4A7A6D",
    "accentLight":      "#D4EAE5",
    "backdropWarm":     "#F6F3EE",
    "backdropDark":     "#111E24",
    "backdropMid":      "#EEF2F0",
    "backdropWhite":    "#FFFFFF",
    "textPrimary":      "#1A2225",
    "textSecondary":    "#5A6B70",
    "textMuted":        "#8A9BA0",
    "textOnDark":       "#FFFFFF",
    "textOnDarkMuted":  "#A8BEC0",
    "border":           "#DDE3E1",
    "borderLight":      "#EEF0EE",
    "statusActive":     "#2E6B4F",
    "statusActiveBg":   "#EAF4EE",
    "statusSold":       "#8B3A2A",
    "statusSoldBg":     "#FBF0EE",
    "statusPending":    "#B8752A",
    "statusPendingBg":  "#FBF3E8",
    "statusComingSoon": "#18292F",
    "statusLease":      "#2563EB",
    "statusLeaseBg":    "#EFF5FE",
    "goldStar":         "#D4A843",
    "success":          "#2E6B4F",
    "successBg":        "#EAF4EE",
    "warning":          "#B8752A",
    "warningBg":        "#FBF3E8",
    "error":            "#8B3A2A",
    "errorBg":          "#FBF0EE"
  },
  "typography": {
    "displayFont":       "Cormorant Garamond",
    "headingFont":       "DM Serif Display",
    "bodyFont":          "Inter",
    "uiFont":            "DM Sans",
    "chineseFont":       "Noto Serif SC",
    "chineseBodyFont":   "Noto Sans SC",
    "displayWeight":     "400",
    "headingWeight":     "400",
    "bodyWeight":        "400",
    "uiWeight":          "500",
    "displayLineHeight": "1.05",
    "headingLineHeight": "1.15",
    "bodyLineHeight":    "1.65",
    "chineseLineHeight": "1.85",
    "scaleDisplay":  "72px",
    "scaleH1":       "52px",
    "scaleH2":       "40px",
    "scaleH3":       "30px",
    "scaleH4":       "22px",
    "scaleBody":     "17px",
    "scaleSmall":    "14px",
    "scaleCaption":  "12px",
    "scaleDisplayMobile": "44px",
    "scaleH1Mobile":      "36px",
    "scaleH2Mobile":      "28px"
  },
  "borderRadius": {
    "none":   "0px",
    "sm":     "4px",
    "md":     "8px",
    "lg":     "12px",
    "xl":     "16px",
    "xxl":    "24px",
    "pill":   "999px",
    "card":   "12px",
    "button": "8px",
    "badge":  "999px",
    "image":  "8px"
  },
  "spacing": {
    "sectionPaddingY":      "96px",
    "sectionPaddingYMd":    "72px",
    "sectionPaddingYSm":    "56px",
    "containerMaxWidth":    "1280px",
    "containerPaddingX":    "24px",
    "gridGapLg":            "32px",
    "gridGapMd":            "24px",
    "gridGapSm":            "16px",
    "cardPaddingLg":        "32px",
    "cardPaddingMd":        "24px",
    "cardPaddingSm":        "16px",
    "heroMinHeight":        "90vh",
    "heroMinHeightMobile":  "85vh",
    "topbarHeight":         "40px",
    "headerHeight":         "72px",
    "headerHeightScrolled": "60px",
    "stickyOffset":         "112px"
  },
  "effects": {
    "heroOverlayOpacity":         "0.42",
    "heroOverlayColor":           "#111E24",
    "cardHoverTranslateY":        "-4px",
    "cardHoverShadow":            "0 12px 40px rgba(24,41,47,0.14)",
    "transitionDefault":          "all 0.2s ease",
    "transitionSlow":             "all 0.35s ease",
    "shadowSm":                   "0 2px 8px rgba(24,41,47,0.06)",
    "shadowMd":                   "0 4px 16px rgba(24,41,47,0.10)",
    "shadowLg":                   "0 8px 32px rgba(24,41,47,0.12)",
    "shadowXl":                   "0 16px 48px rgba(24,41,47,0.14)",
    "imageDimOpacity":            "0.12",
    "imageOverlayGradient":       "linear-gradient(to top, rgba(17,30,36,0.75) 0%, rgba(17,30,36,0.20) 60%, transparent 100%)"
  },
  "layout": {
    "heroTextAlignment":      "left",
    "heroTextMaxWidth":       "640px",
    "statBarBgColor":         "primary",
    "testimonialCardStyle":   "bordered",
    "propertyCardRadius":     "12px",
    "propertyCardImgHeight":  "220px",
    "neighborhoodCardStyle":  "overlay",
    "blogCardStyle":          "clean",
    "detailSidebarWidth":     "360px"
  },
  "components": {
    "buttonPrimaryBg":        "primary",
    "buttonPrimaryText":      "textOnDark",
    "buttonPrimaryHoverBg":   "primaryHover",
    "buttonSecondaryBg":      "secondary",
    "buttonSecondaryText":    "backdropDark",
    "buttonOutlineBorder":    "primary",
    "buttonOutlineText":      "primary",
    "buttonRadius":           "button",
    "buttonPaddingY":         "12px",
    "buttonPaddingX":         "28px",
    "buttonFontSize":         "15px",
    "buttonFontWeight":       "600",
    "badgeStatusRadius":      "badge",
    "formInputBorder":        "border",
    "formInputFocusBorder":   "primary",
    "formInputRadius":        "md",
    "formInputPaddingY":      "10px",
    "formInputPaddingX":      "14px",
    "formLabelSize":          "14px",
    "formLabelWeight":        "500",
    "chipBg":                 "primaryLight",
    "chipText":               "primary",
    "chipRadius":             "badge"
  }
}
```

### Admin Form Fields

```
Section: Colors (grouped by role)
  Group: Brand Colors
    colors.primary:         color picker
    colors.primaryLight:    color picker
    colors.secondary:       color picker
    colors.secondaryLight:  color picker
    colors.accent:          color picker
    colors.accentDark:      color picker

  Group: Backgrounds
    colors.backdropWarm:    color picker
    colors.backdropDark:    color picker
    colors.backdropMid:     color picker

  Group: Text
    colors.textPrimary:     color picker
    colors.textSecondary:   color picker
    colors.textOnDark:      color picker

  Group: Status Colors (protected — warn before editing)
    colors.statusActive:    color picker
    colors.statusSold:      color picker
    colors.statusPending:   color picker

Section: Typography
  typography.displayFont:   text (Google Fonts name)
  typography.headingFont:   text
  typography.bodyFont:      text
  typography.uiFont:        text
  typography.chineseFont:   text
  typography.chineseBodyFont: text
  typography.bodyLineHeight:  text
  typography.chineseLineHeight: text

Section: Border Radius
  borderRadius.card:   text (px value)
  borderRadius.button: text
  borderRadius.image:  text

Section: Spacing
  spacing.sectionPaddingY:   text
  spacing.containerMaxWidth: text
  spacing.heroMinHeight:     text

Section: Effects
  effects.heroOverlayOpacity: number (0.0–1.0)
  effects.heroOverlayColor:   color picker

Section: Component Defaults
  components.buttonPrimaryBg:   select [color token names]
  components.buttonRadius:      select [radius token names]
  components.formInputRadius:   select [radius token names]
```

---

## CSS Variable Mapping (for `app/[locale]/layout.tsx`)

Cursor must inject all theme tokens as CSS variables in the layout file. Example mapping pattern:

```typescript
// In app/[locale]/layout.tsx — inject from theme.json
const cssVars = {
  // Colors
  '--color-primary':          theme.colors.primary,
  '--color-primary-light':    theme.colors.primaryLight,
  '--color-primary-hover':    theme.colors.primaryHover,
  '--color-secondary':        theme.colors.secondary,
  '--color-secondary-light':  theme.colors.secondaryLight,
  '--color-accent':           theme.colors.accent,
  '--color-accent-dark':      theme.colors.accentDark,
  '--color-backdrop-warm':    theme.colors.backdropWarm,
  '--color-backdrop-dark':    theme.colors.backdropDark,
  '--color-backdrop-mid':     theme.colors.backdropMid,
  '--color-text-primary':     theme.colors.textPrimary,
  '--color-text-secondary':   theme.colors.textSecondary,
  '--color-text-on-dark':     theme.colors.textOnDark,
  '--color-text-on-dark-muted': theme.colors.textOnDarkMuted,
  '--color-border':           theme.colors.border,
  '--color-gold-star':        theme.colors.goldStar,
  '--color-status-active':    theme.colors.statusActive,
  '--color-status-sold':      theme.colors.statusSold,
  '--color-status-pending':   theme.colors.statusPending,
  // Typography
  '--font-display':           theme.typography.displayFont,
  '--font-heading':           theme.typography.headingFont,
  '--font-body':              theme.typography.bodyFont,
  '--font-ui':                theme.typography.uiFont,
  '--font-chinese':           theme.typography.chineseFont,
  '--font-chinese-body':      theme.typography.chineseBodyFont,
  '--line-height-body':       theme.typography.bodyLineHeight,
  '--line-height-chinese':    theme.typography.chineseLineHeight,
  // Spacing
  '--section-padding-y':      theme.spacing.sectionPaddingY,
  '--container-max-width':    theme.spacing.containerMaxWidth,
  '--hero-min-height':        theme.spacing.heroMinHeight,
  '--header-height':          theme.spacing.headerHeight,
  '--sticky-offset':          theme.spacing.stickyOffset,
  // Border Radius
  '--radius-card':            theme.borderRadius.card,
  '--radius-button':          theme.borderRadius.button,
  '--radius-badge':           theme.borderRadius.badge,
  '--radius-image':           theme.borderRadius.image,
  // Effects
  '--hero-overlay-opacity':   theme.effects.heroOverlayOpacity,
  '--hero-overlay-color':     theme.effects.heroOverlayColor,
  '--shadow-md':              theme.effects.shadowMd,
  '--shadow-lg':              theme.effects.shadowLg,
  '--transition-default':     theme.effects.transitionDefault,
  '--image-overlay-gradient': theme.effects.imageOverlayGradient,
  // Components
  '--btn-padding-y':          theme.components.buttonPaddingY,
  '--btn-padding-x':          theme.components.buttonPaddingX,
  '--btn-font-size':          theme.components.buttonFontSize,
  '--btn-font-weight':        theme.components.buttonFontWeight,
  '--form-input-padding-y':   theme.components.formInputPaddingY,
  '--form-input-padding-x':   theme.components.formInputPaddingX,
}
```

---

## Part 1 Done-Gate

Before moving to Part 2 (Page Contracts), verify all global contracts are seeded:

- [ ] `content/jinpang-homes/en/site.json` — created with Jin Pang data
- [ ] `content/jinpang-homes/zh/site.json` — Chinese version created
- [ ] `content/jinpang-homes/en/header.json` — EN created
- [ ] `content/jinpang-homes/zh/header.json` — ZH created
- [ ] `content/jinpang-homes/en/footer.json` — EN created
- [ ] `content/jinpang-homes/zh/footer.json` — ZH created
- [ ] `content/jinpang-homes/en/navigation.json` — EN created
- [ ] `content/jinpang-homes/zh/navigation.json` — ZH created
- [ ] `content/jinpang-homes/en/seo.json` — EN created
- [ ] `content/jinpang-homes/zh/seo.json` — ZH created
- [ ] `content/jinpang-homes/en/theme.json` — created (single file, locale-independent)
- [ ] All JSON files seeded into Supabase `content_entries` via seed script
- [ ] CSS variables injecting correctly in `app/[locale]/layout.tsx`
- [ ] Admin Site Settings shows all panels (General, Header, Footer, Navigation, SEO, Theme)
- [ ] Language switcher toggles EN ↔ ZH and loads correct global files

---

*End of REA_CONTENT_CONTRACTS_PART1.md*
*Next: REA_CONTENT_CONTRACTS_PART2.md — Page Contracts (Home, About, Service Pages, Properties)*
