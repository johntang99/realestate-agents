# BAAM System G2 — REA Content Contracts
# Part 3 of 3: Collection Contracts (C1–C8)

> **Document:** REA_CONTENT_CONTRACTS_PART3.md
> **System:** BAAM System G2 — Real Estate Agent (REA Premium)
> **Version:** 1.0
> **Date:** March 2026
> **Part:** 3 of 3 — Collection Contracts
> **Cursor usage:** Attach during Phase 2 when building collection pages and admin editors

---

## Collection Contracts Index

- [C1: case-studies/](#c1-case-studies)
- [C2: testimonials.json (array)](#c2-testimonials)
- [C3: blog/ (Knowledge Center posts)](#c3-blog-posts)
- [C4: neighborhoods/](#c4-neighborhoods)
- [C5: market-reports/](#c5-market-reports)
- [C6: properties/](#c6-properties)
- [C7: resources/ (Gated Downloads)](#c7-gated-downloads)
- [C8: Hub Pages — case-studies.json, testimonials-page.json, resources.json](#c8-hub-pages)

---

## C1: case-studies/

**Collection path:** `content/jinpang-homes/en/case-studies/[slug].json`
**Admin editor:** Case Studies Editor (dedicated sidebar item — NOT in Content Editor)
**Route:** `/[locale]/case-studies/[slug]`
**Hub page:** `/[locale]/case-studies` (configured via C8)

### Schema

```typescript
interface CaseStudy {
  slug: string                        // URL-safe: "first-time-buyer-port-jervis"
  title: string                       // Display title
  titleZh?: string                    // Chinese title (optional at launch)
  transactionType: CaseStudyType
  outcomeHeadline: string             // "Found a 3BR under asking in a competitive market"
  outcomeHeadlineZh?: string
  clientProfile: string               // Anonymous descriptor: "First-time buyer couple, relocating from NYC"
  location: string                    // "Port Jervis, NY"
  priceRange: string                  // "$280,000–$320,000"
  result: {
    purchasePrice?: string            // "$295,000" (if buyer case)
    listPrice?: string                // "$289,900" (listing price at time)
    salePrice?: string                // "$301,000" (if seller case)
    daysOnMarket?: number
    saleToListRatio?: string          // "103.8%"
    keyWin: string                    // One-sentence outcome: "Secured for $5K below asking with seller credits"
    keyWinZh?: string
  }
  thumbnailImage: string
  heroImage: string
  situation: string                   // Rich text: the problem/challenge the client faced
  strategy: string                    // Rich text: what Jin did and why
  outcome: string                     // Rich text: the full result story
  clientQuote: string                 // Direct testimonial from this client
  clientQuoteAttribution: string      // "— Buyer, Port Jervis, 2025" (no full name required)
  clientConsentNote: string           // "Shared with client's permission." (always required)
  keyTakeaways: string[]              // 3 bullet insights from this transaction
  relatedServices: string[]           // ["buying", "first-time-buyers", "negotiation"]
  relatedCaseStudySlugs: string[]
  publishDate: string                 // "2025-11-01"
  featured: boolean
  locale: string
  seo: {
    title: string
    description: string
  }
}

type CaseStudyType =
  | "buyer"
  | "seller"
  | "investor"
  | "relocator"
  | "international-buyer"
  | "first-time-buyer"
```

### Seed Items (4 — one per primary type)

**Case 1: First-Time Buyer**

```json
{
  "slug": "first-time-buyer-port-jervis",
  "title": "First-Time Win: 3BR Home in Port Jervis — $8,000 Under Asking",
  "transactionType": "first-time-buyer",
  "outcomeHeadline": "Guided a first-time buyer couple to their first home — under asking price, with $5,000 in seller credits.",
  "clientProfile": "First-time buyer couple, both in their early 30s, relocating from Queens, NY",
  "location": "Port Jervis, NY",
  "priceRange": "$280,000–$320,000",
  "result": {
    "purchasePrice": "$292,000",
    "listPrice": "$300,000",
    "daysOnMarket": 18,
    "saleToListRatio": "97.3%",
    "keyWin": "Secured $8,000 below asking with $5,000 seller credit toward closing costs — first home, first offer."
  },
  "thumbnailImage": "/images/cases/first-time-buyer-port-jervis-thumb.jpg",
  "heroImage": "/images/cases/first-time-buyer-port-jervis.jpg",
  "situation": "Maria and David had been renting in Queens for six years. They'd tried to buy twice before — once lost in a bidding war, once to an all-cash buyer. Their budget was firm at $310,000, and they needed a home within Metro-North commuting distance because David still went to the office three days a week. They were beginning to lose confidence in the process when they reached out to me through a mutual friend.",
  "strategy": "I started with a reality check on their search — they had been looking at homes that were already attracting multiple offers. I redirected their search toward properties that had sat on market for 15+ days without offers, which in this market indicated either a pricing issue or a perception problem we could work through with a strong inspection strategy.\n\nWe identified a 3BR Cape Cod in Port Jervis that had two price reductions and been on market for 22 days. The reason it sat: dated kitchen and a slightly unusual floor plan. The bones were excellent. I brought in an inspector before we wrote the offer — not as a contingency, but as due diligence — so we could write an informed offer with confidence rather than an uncertain one.\n\nWe offered $292,000 with a 30-day close and requested $5,000 in seller closing cost credits. The seller, who had already reduced twice, accepted the same day.",
  "outcome": "Maria and David closed 29 days later. Their monthly payment — with the 3.5% FHA loan I'd helped them structure with a SONYMA assistance grant — was $200 less per month than their Queens apartment rent.\n\nTwo months after closing, they painted the kitchen cabinets and installed new hardware. Total cost: $800. The house looks like a completely different home.",
  "clientQuote": "We'd been rejected twice before finding Jin. He didn't just help us find a house — he completely changed how we understood the buying process. He told us exactly where to look, what to offer, and why. We closed our first offer. I still can't believe it.",
  "clientQuoteAttribution": "— Buyer couple, Port Jervis, NY, November 2025",
  "clientConsentNote": "Shared with clients' permission.",
  "keyTakeaways": [
    "Properties with days on market over 15 often have negotiating room that competitive listings don't — targeting these strategically beats bidding wars.",
    "Pre-offer inspections (not as contingencies) allow buyers to write confident offers without open-ended uncertainty that sellers fear.",
    "SONYMA assistance programs are available for first-time buyers in New York that many buyers never learn about — eligibility is worth checking early."
  ],
  "relatedServices": ["buying", "first-time-buyers"],
  "relatedCaseStudySlugs": ["competitive-offer-middletown"],
  "publishDate": "2025-11-15",
  "featured": true,
  "locale": "en",
  "seo": {
    "title": "First-Time Buyer Case Study: 3BR Under Asking in Port Jervis | Jin Pang",
    "description": "How Jin Pang helped first-time buyers win their first offer — $8,000 under asking with seller credits — in Port Jervis, NY."
  }
}
```

**Case 2: Seller Above Asking**

```json
{
  "slug": "seller-above-asking-warwick",
  "title": "Warwick Colonial: Listed Friday, 5 Offers by Monday, Sold 4% Above Asking",
  "transactionType": "seller",
  "outcomeHeadline": "Strategic listing and launch weekend generated 5 competing offers — sold 4% above asking in 6 days.",
  "clientProfile": "Empty-nester couple downsizing after 18 years in their Warwick home",
  "location": "Warwick, NY",
  "priceRange": "$450,000–$550,000",
  "result": {
    "listPrice": "$479,000",
    "salePrice": "$498,500",
    "daysOnMarket": 6,
    "saleToListRatio": "104.1%",
    "keyWin": "5 competing offers in the first weekend — accepted at $498,500, $19,500 above asking, with no contingencies."
  },
  "thumbnailImage": "/images/cases/warwick-colonial-thumb.jpg",
  "heroImage": "/images/cases/warwick-colonial.jpg",
  "situation": "Robert and Linda had lived in their 4BR Warwick Colonial for 18 years. Their youngest had just finished college and they were ready to downsize — but they were nervous about pricing. A neighbor had listed a similar home six months earlier at $510,000 and eventually sold at $468,000 after two price reductions. They didn't want to repeat that experience.",
  "strategy": "The neighbor's mistake was clear: they listed too high, sat on market, and chased the price down — which signals desperation to buyers and kills negotiating power.\n\nI priced Robert and Linda's home at $479,000 — deliberately slightly below what comparables suggested was achievable — to create a competitive environment rather than a negotiation. I scheduled the listing to go live on a Thursday, with professional photography done two weeks prior, and an open house the following Saturday and Sunday.\n\nThe home had been meticulously maintained. I recommended three specific improvements: fresh exterior paint on shutters ($400), professional cleaning ($350), and furniture repositioning in the primary bedroom to make it photograph larger. Total seller preparation cost: $750.\n\nWe received five offers by Monday morning.",
  "outcome": "I presented all five offers to Robert and Linda with a clear comparison: price, contingencies, financing type, and close date flexibility. We selected an offer at $498,500 — $19,500 above asking — from a conventional buyer with full pre-approval and no inspection contingency.\n\nClosed in 35 days. Robert and Linda's net proceeds exceeded their most optimistic estimate by $22,000.",
  "clientQuote": "We were so worried about making the same mistake our neighbor made. Jin walked us through exactly why their strategy failed and what we were going to do differently. He was right about everything — price, timing, presentation. We couldn't be happier with the result.",
  "clientQuoteAttribution": "— Sellers, Warwick, NY, September 2025",
  "clientConsentNote": "Shared with clients' permission.",
  "keyTakeaways": [
    "Pricing slightly below market value to generate competition consistently outperforms pricing to leave room for negotiation — in competitive markets.",
    "Launch timing matters: a Thursday listing date with weekend open houses maximizes first-weekend traffic and creates the competitive pressure that drives multiple offers.",
    "Targeted low-cost improvements (paint, cleaning, furniture) that photograph well consistently deliver 5–10x ROI on seller net proceeds."
  ],
  "relatedServices": ["selling", "home-staging", "marketing"],
  "relatedCaseStudySlugs": ["quick-sale-port-jervis"],
  "publishDate": "2025-09-20",
  "featured": true,
  "locale": "en",
  "seo": {
    "title": "Seller Case Study: Warwick Colonial Sold 4% Above Asking in 6 Days | Jin Pang",
    "description": "How Jin Pang generated 5 competing offers and sold a Warwick, NY home $19,500 above asking in 6 days through strategic pricing and launch timing."
  }
}
```

**Case 3: Investor**

```json
{
  "slug": "multifamily-port-jervis-investor",
  "title": "Off-Market Duplex in Port Jervis: 7.2% CAP Rate in the First Year",
  "transactionType": "investor",
  "outcomeHeadline": "Sourced an off-market duplex for a NYC investor at below-market pricing — 7.2% CAP rate achieved in year one.",
  "clientProfile": "NYC-based investor, Chinese-American family, seeking first Orange County investment property",
  "location": "Port Jervis, NY",
  "priceRange": "$200,000–$280,000",
  "result": {
    "purchasePrice": "$235,000",
    "keyWin": "Off-market acquisition at $25,000 below comparable market pricing. Both units tenanted within 30 days of closing. Year-one CAP rate: 7.2%."
  },
  "thumbnailImage": "/images/cases/duplex-port-jervis-thumb.jpg",
  "heroImage": "/images/cases/duplex-port-jervis.jpg",
  "situation": "The Wei family had been investing in Manhattan and Brooklyn real estate for years. Their yields had compressed to 3–4% with property values at all-time highs. Their accountant suggested diversifying into higher-yield markets. A friend recommended Orange County — and Jin Pang specifically, because they wanted to work in Chinese with an agent who knew the investment landscape.",
  "strategy": "I explained the Port Jervis rental market to the Wei family in our first consultation — the inbound tenant demand from NYC commuters, the strong occupancy rates, and the price points that made legitimate yields achievable. I also told them honestly where the risks were: older housing stock requiring capital expenditure, and municipal code requirements they'd need to navigate.\n\nI found the duplex through my network — a landlord who had owned it for 22 years and wanted to sell quietly without listing. Both units were occupied with long-term tenants on month-to-month leases at below-market rents ($950/$975). Combined market rent was $2,400–$2,600.\n\nI negotiated a direct purchase at $235,000 — approximately $25,000 below what a listed duplex would have attracted in the current market — in exchange for a clean close with no buyer financing contingency.",
  "outcome": "We closed in 38 days. Within 60 days of closing, both tenants signed new 12-month leases at $1,150 and $1,200 respectively — a natural 20% rent increase without displacement. The Wei family's year-one NOI came out to $16,920 after expenses, on a $235,000 acquisition — a 7.2% CAP rate.\n\nAll communications with the Wei family were conducted entirely in Chinese — from property analysis to lease review.",
  "clientQuote": "我们在曼哈顿的投资回报越来越低。庞锦不仅帮我们找到了真正有价值的投资机会，整个过程都用中文沟通，让我们完全放心。第一年的回报率远超我们的预期。",
  "clientQuoteAttribution": "— Wei Family, Investors, Port Jervis, NY, March 2025",
  "clientConsentNote": "Shared with clients' permission. Original testimonial in Chinese.",
  "keyTakeaways": [
    "Off-market acquisitions in Orange County typically price 10–15% below listed equivalents — agent relationships are the primary source of these deals.",
    "Below-market rents at acquisition represent upside that can be captured through natural lease renewals without displacing long-term tenants.",
    "Chinese-speaking investors benefit significantly from working with a bilingual agent who can explain US-specific concepts (title insurance, escrow, lease structures) in full cultural context."
  ],
  "relatedServices": ["investing", "multifamily", "chinese-service"],
  "relatedCaseStudySlugs": ["str-warwick-acquisition"],
  "publishDate": "2025-03-20",
  "featured": true,
  "locale": "en",
  "seo": {
    "title": "Investor Case Study: Off-Market Duplex, 7.2% CAP Rate | Jin Pang Orange County",
    "description": "How Jin Pang sourced an off-market duplex in Port Jervis for a Chinese-American investor family — 7.2% CAP rate achieved in year one."
  }
}
```

**Case 4: Relocator**

```json
{
  "slug": "nyc-relocator-goshen",
  "title": "NYC Family Relocates to Goshen: Space, Schools, and $1,800/Month Savings",
  "transactionType": "relocator",
  "outcomeHeadline": "Helped a Brooklyn family find their Orange County home — closing in 52 days, fully remote.",
  "clientProfile": "Family of four relocating from Brooklyn, NY — both parents remote workers",
  "location": "Goshen, NY",
  "priceRange": "$380,000–$450,000",
  "result": {
    "purchasePrice": "$412,000",
    "daysOnMarket": 12,
    "keyWin": "Closed in 52 days on a property the buyers toured via video walkthrough. Monthly housing cost savings vs. Brooklyn: approximately $1,800/month."
  },
  "thumbnailImage": "/images/cases/goshen-relocator-thumb.jpg",
  "heroImage": "/images/cases/goshen-relocator.jpg",
  "situation": "The Chen family had been in Brooklyn for 11 years — a 1,100 sqft co-op they'd outgrown when their second child arrived. With both parents now fully remote, they were paying $3,900/month for a space that felt increasingly cramped. They wanted land, a good school district, and something they could actually afford. They found Jin Pang through a search for Chinese-speaking real estate agents near Port Jervis.",
  "strategy": "The Chen family's priorities were clear: school district first, then space, then price. I ruled out several areas that wouldn't meet their academic bar and focused our search on Goshen Central School District — consistently rated among the strongest in Orange County.\n\nBecause they were in Brooklyn and couldn't easily take days off for showings, I conducted every property tour by video — walking through each home on FaceTime, pointing out what the photos didn't show. Three homes, three video tours, 10 days.\n\nOn the third tour, they said yes. We wrote the offer that evening.",
  "outcome": "The Chens moved into a 2,100 sqft colonial on 0.4 acres in Goshen — four bedrooms, two-car garage, full basement — at $412,000. Their new mortgage and taxes combined to approximately $2,900/month. Their Brooklyn co-op maintenance and mortgage had been $4,700/month for less than half the space.\n\n$1,800/month in savings. 1,000 more square feet. A yard. A school district they're genuinely excited about.",
  "clientQuote": "We found Jin because we wanted someone who spoke Chinese, but we stayed because he was simply the best. He toured three homes for us on FaceTime and made us feel like we were there. We bought a house we'd never physically seen before offer day. It was perfect.",
  "clientQuoteAttribution": "— Chen Family, Goshen, NY, July 2025",
  "clientConsentNote": "Shared with clients' permission.",
  "keyTakeaways": [
    "Remote purchases via video tour are fully viable with a skilled local agent conducting thorough walkthroughs — buyers who wait to tour in person often lose properties to faster-moving buyers.",
    "School district boundaries are the most important variable for relocating families — neighborhood selection should start with district mapping, not property search.",
    "The monthly cost comparison between renting/owning in NYC vs. buying in Orange County is often the most compelling data point for fence-sitting relocators."
  ],
  "relatedServices": ["relocating", "buying", "chinese-service"],
  "relatedCaseStudySlugs": ["first-time-buyer-port-jervis"],
  "publishDate": "2025-07-10",
  "featured": true,
  "locale": "en",
  "seo": {
    "title": "Relocation Case Study: Brooklyn Family Moves to Goshen NY | Jin Pang",
    "description": "How Jin Pang helped a Brooklyn family relocate to Goshen, NY — purchased via video tour, closed in 52 days, $1,800/month in monthly housing savings."
  }
}
```

### Admin Form Fields (Case Studies Editor)

```
Collection: Case Studies
Actions: New Case Study / Save / Duplicate / Delete

Fields:
  slug:                 text, required, auto-generated from title, editable
  title:                text, required
  titleZh:              text, optional
  transactionType:      select ["buyer","seller","investor","relocator","international-buyer","first-time-buyer"]
  outcomeHeadline:      text, required, max 120 chars
  clientProfile:        text, required (anonymous descriptor)
  location:             text, required
  priceRange:           text, required
  result.purchasePrice: text, optional
  result.listPrice:     text, optional
  result.salePrice:     text, optional
  result.daysOnMarket:  number, optional
  result.saleToListRatio: text, optional
  result.keyWin:        text, required
  thumbnailImage:       image picker, required
  heroImage:            image picker, required
  situation:            rich text editor, required
  strategy:             rich text editor, required
  outcome:              rich text editor, required
  clientQuote:          textarea, required
  clientQuoteAttribution: text, required
  clientConsentNote:    text, required, default "Shared with client's permission."
  keyTakeaways:         array editor (text items), min 2 max 5
  relatedServices:      tag-input
  relatedCaseStudySlugs: tag-input (slugs)
  publishDate:          date picker
  featured:             toggle
  seo.title:            text
  seo.description:      textarea, max 160 chars
```

---

## C2: testimonials

**Storage:** `content/jinpang-homes/en/testimonials.json` — array of testimonial objects
**Admin editor:** Testimonials Editor (dedicated — add/edit/delete/reorder)
**Used on:** Testimonials page, Home rotating strip, service pages embedded sections

### Schema

```typescript
interface Testimonial {
  id: string                          // "t001", "t002" etc.
  clientName: string                  // "Sarah M." — first name + last initial only
  transactionType: TestimonialType
  neighborhood: string                // "Port Jervis, NY"
  date: string                        // "2025-10"
  rating: 1 | 2 | 3 | 4 | 5
  source: "google" | "zillow" | "realtor-com" | "direct"
  sourceUrl?: string                  // Link to original review if applicable
  body: string                        // The testimonial text
  bodyZh?: string                     // Chinese testimonial (for Chinese-speaking clients)
  featured: boolean
  language: "en" | "zh"              // Primary language of the testimonial
  tags?: string[]                     // ["first-time-buyer", "bilingual-service", "relocation"]
}

type TestimonialType =
  | "buyer"
  | "seller"
  | "investor"
  | "relocator"
  | "general"
```

### Seed JSON (15 testimonials — EN and ZH mix)

```json
[
  {
    "id": "t001",
    "clientName": "Sarah M.",
    "transactionType": "buyer",
    "neighborhood": "Port Jervis, NY",
    "date": "2025-11",
    "rating": 5,
    "source": "google",
    "body": "Jin made buying our first home an actually enjoyable experience — which I never thought I'd say. He found us a home we love, under our budget, on the first offer. He was available every time we had a question (which was constantly) and explained everything clearly. Can't recommend him enough.",
    "featured": true,
    "language": "en",
    "tags": ["first-time-buyer", "responsive"]
  },
  {
    "id": "t002",
    "clientName": "Robert & Linda K.",
    "transactionType": "seller",
    "neighborhood": "Warwick, NY",
    "date": "2025-09",
    "rating": 5,
    "source": "zillow",
    "body": "We received five offers in the first weekend and sold above asking — exactly what Jin predicted would happen if we followed his strategy. After watching our neighbor's home sit on market for months, we were nervous. Jin's approach was completely different: price right, launch strong, create competition. It worked perfectly.",
    "featured": true,
    "language": "en",
    "tags": ["seller", "above-asking", "strategic-pricing"]
  },
  {
    "id": "t003",
    "clientName": "Wei Family",
    "transactionType": "investor",
    "neighborhood": "Port Jervis, NY",
    "date": "2025-03",
    "rating": 5,
    "source": "direct",
    "body": "我们在曼哈顿的投资回报率越来越低，庞锦帮我们在波特杰维斯找到了一套收益率超过7%的两单元公寓。全程用中文沟通，非常顺畅。他对当地市场了如指掌，给了我们非常实际的建议。强烈推荐！",
    "bodyZh": "我们在曼哈顿的投资回报率越来越低，庞锦帮我们在波特杰维斯找到了一套收益率超过7%的两单元公寓。全程用中文沟通，非常顺畅。他对当地市场了如指掌，给了我们非常实际的建议。强烈推荐！",
    "featured": true,
    "language": "zh",
    "tags": ["investor", "bilingual-service", "chinese-client"]
  },
  {
    "id": "t004",
    "clientName": "David & Maria L.",
    "transactionType": "buyer",
    "neighborhood": "Port Jervis, NY",
    "date": "2025-11",
    "rating": 5,
    "source": "google",
    "body": "Third time trying to buy a home. First two times ended in heartbreak — lost to better offers. Jin completely changed our approach. He told us where to look, how to write the offer, and why. We got our first offer accepted. We literally cried at the closing table.",
    "featured": true,
    "language": "en",
    "tags": ["first-time-buyer", "competitive-market"]
  },
  {
    "id": "t005",
    "clientName": "Chen Family",
    "transactionType": "relocator",
    "neighborhood": "Goshen, NY",
    "date": "2025-07",
    "rating": 5,
    "source": "direct",
    "body": "We bought our Goshen home having only seen it on FaceTime. Jin walked us through every room, pointed out everything — the good and the small issues. He made us feel completely informed. Six months later, it's the best decision we've ever made. We saved $1,800 a month and have a yard.",
    "featured": true,
    "language": "en",
    "tags": ["relocator", "remote-purchase", "bilingual-service"]
  },
  {
    "id": "t006",
    "clientName": "张先生",
    "transactionType": "buyer",
    "neighborhood": "Middletown, NY",
    "date": "2025-06",
    "rating": 5,
    "source": "direct",
    "body": "作为从国内刚来美国的新移民，购房过程对我来说非常陌生。庞锦用中文详细解释了美国的购房流程、合同条款、产权保险等一切细节，让我完全理解并放心。最终我们以理想的价格购得了心仪的房子。非常感激！",
    "bodyZh": "作为从国内刚来美国的新移民，购房过程对我来说非常陌生。庞锦用中文详细解释了美国的购房流程、合同条款、产权保险等一切细节，让我完全理解并放心。最终我们以理想的价格购得了心仪的房子。非常感激！",
    "featured": true,
    "language": "zh",
    "tags": ["international-buyer", "bilingual-service", "chinese-client"]
  },
  {
    "id": "t007",
    "clientName": "Amanda T.",
    "transactionType": "seller",
    "neighborhood": "Newburgh, NY",
    "date": "2025-08",
    "rating": 5,
    "source": "zillow",
    "body": "Jin sold my Newburgh condo in 19 days for $3,000 above asking. He was direct about what I needed to fix before listing (not much), handled everything professionally, and kept me informed every step of the way. Simple, smooth, successful.",
    "featured": false,
    "language": "en",
    "tags": ["seller", "above-asking", "condo"]
  },
  {
    "id": "t008",
    "clientName": "Michael H.",
    "transactionType": "buyer",
    "neighborhood": "Middletown, NY",
    "date": "2025-10",
    "rating": 5,
    "source": "google",
    "body": "Jin found me a multifamily property that wasn't even on the market yet. His network in Orange County is real — he actually knows people, and that translated into an opportunity I wouldn't have found on Zillow. Closed at a price I was happy with. Would absolutely work with him again.",
    "featured": false,
    "language": "en",
    "tags": ["investor", "off-market", "multifamily"]
  },
  {
    "id": "t009",
    "clientName": "Jennifer & Paul S.",
    "transactionType": "relocator",
    "neighborhood": "Warwick, NY",
    "date": "2025-05",
    "rating": 5,
    "source": "realtor-com",
    "body": "We moved from New Jersey and didn't know Orange County at all. Jin gave us the real picture of every neighborhood — not just what sounded good. He was honest about school districts, about commute realities, about what different areas actually felt like. That honesty is rare and valuable.",
    "featured": false,
    "language": "en",
    "tags": ["relocator", "honest-guidance", "neighborhood-knowledge"]
  },
  {
    "id": "t010",
    "clientName": "李女士",
    "transactionType": "seller",
    "neighborhood": "Port Jervis, NY",
    "date": "2025-04",
    "rating": 5,
    "source": "direct",
    "body": "庞锦帮我卖掉了在波特杰维斯的房子，整个过程非常专业顺畅。他的定价策略很精准，上市后一周内就收到了满意的报价。用中文沟通让我们少了很多顾虑。结果超出了我的预期，非常满意！",
    "bodyZh": "庞锦帮我卖掉了在波特杰维斯的房子，整个过程非常专业顺畅。他的定价策略很精准，上市后一周内就收到了满意的报价。用中文沟通让我们少了很多顾虑。结果超出了我的预期，非常满意！",
    "featured": false,
    "language": "zh",
    "tags": ["seller", "bilingual-service", "chinese-client"]
  },
  {
    "id": "t011",
    "clientName": "Karen & Tom R.",
    "transactionType": "buyer",
    "neighborhood": "Goshen, NY",
    "date": "2025-12",
    "rating": 5,
    "source": "google",
    "body": "We were scared of the Orange County market after reading about competitive bidding wars. Jin completely settled our nerves — he showed us exactly where to look to avoid the frenzy, and we got a beautiful home in Goshen with room to negotiate. Strategic, calm, effective.",
    "featured": false,
    "language": "en",
    "tags": ["buyer", "competitive-market", "strategic"]
  },
  {
    "id": "t012",
    "clientName": "Daniel F.",
    "transactionType": "investor",
    "neighborhood": "Port Jervis, NY",
    "date": "2025-02",
    "rating": 5,
    "source": "zillow",
    "body": "I've bought investment properties in three states. Jin is the best agent I've worked with. He gave me data I could actually use — not just 'this is a great area.' He showed me rental comps, vacancy data, cap rate analysis for specific properties. That's what a real investment advisor looks like.",
    "featured": false,
    "language": "en",
    "tags": ["investor", "data-driven", "cap-rate"]
  },
  {
    "id": "t013",
    "clientName": "Grace Y.",
    "transactionType": "buyer",
    "neighborhood": "Middletown, NY",
    "date": "2026-01",
    "rating": 5,
    "source": "google",
    "body": "Jin was the only agent I found who truly offered bilingual service — not just translation, but genuine understanding of what a Chinese family looks for in a home. The school district research, the neighborhood feel, the feng shui considerations — he got it all without me having to explain myself.",
    "featured": false,
    "language": "en",
    "tags": ["buyer", "bilingual-service", "chinese-client", "cultural-fluency"]
  },
  {
    "id": "t014",
    "clientName": "James & Claire B.",
    "transactionType": "seller",
    "neighborhood": "Warwick, NY",
    "date": "2025-12",
    "rating": 5,
    "source": "realtor-com",
    "body": "Straightforward, professional, and delivered exactly what he promised. Listed our Warwick home, sold in 24 days at asking price. Jin was responsive every time we reached out and handled the inspection negotiation like a pro. You can tell he genuinely cares about his clients.",
    "featured": false,
    "language": "en",
    "tags": ["seller", "responsive", "professional"]
  },
  {
    "id": "t015",
    "clientName": "王先生 & 王太太",
    "transactionType": "relocator",
    "neighborhood": "Goshen, NY",
    "date": "2026-02",
    "rating": 5,
    "source": "direct",
    "body": "我们从纽约市搬到了戈申，庞锦帮助我们找到了一个完全符合我们需求的家园——好学区、大空间、安静的环境。他非常了解橙县的各个社区，给了我们很多实用的建议。有他的中文服务，整个搬迁过程变得轻松了很多。",
    "bodyZh": "我们从纽约市搬到了戈申，庞锦帮助我们找到了一个完全符合我们需求的家园——好学区、大空间、安静的环境。他非常了解橙县的各个社区，给了我们很多实用的建议。有他的中文服务，整个搬迁过程变得轻松了很多。",
    "featured": false,
    "language": "zh",
    "tags": ["relocator", "bilingual-service", "chinese-client", "family"]
  }
]
```

---

## C3: blog/ (Knowledge Center Posts)

**Collection path:** `content/jinpang-homes/en/blog/[slug].json`
**Admin editor:** Knowledge Center Editor (renamed from Blog Posts Editor)
**Route:** `/[locale]/blog/[slug]`

### Schema

```typescript
interface BlogPost {
  slug: string
  title: string
  titleZh?: string
  category: BlogCategory
  excerpt: string
  excerptZh?: string
  body: string                        // Rich text / MDX
  bodyZh?: string
  heroImage: string
  heroImageAlt: string
  authorName: string                  // "Jin Pang"
  authorSlug: string                  // "jin-pang"
  publishDate: string
  updatedDate?: string
  readTimeMinutes: number
  featured: boolean
  tags: string[]
  seo: {
    title: string
    description: string
    ogImage?: string
  }
  relatedPostSlugs?: string[]
  ctaSection?: {
    heading: string
    body: string
    ctaLabel: string
    ctaHref: string
  }
}

type BlogCategory =
  | "market-updates"
  | "buyer-guides"
  | "seller-guides"
  | "investor-insights"
  | "neighborhood-spotlights"
  | "relocation"
  | "lifestyle"
```

### Seed Posts (6 — launch minimum)

```json
[
  {
    "slug": "orange-county-market-report-march-2026",
    "title": "Orange County NY Real Estate Market Report — March 2026",
    "category": "market-updates",
    "excerpt": "Inventory remains constrained, prices continue their upward trend, and the commuter-driven demand from NYC shows no sign of cooling. Here's what the data says.",
    "heroImage": "/images/blog/market-report-march-2026.jpg",
    "heroImageAlt": "Orange County NY real estate market chart",
    "authorName": "Jin Pang",
    "authorSlug": "jin-pang",
    "publishDate": "2026-03-01",
    "readTimeMinutes": 6,
    "featured": true,
    "tags": ["market-data", "orange-county", "2026"],
    "seo": {
      "title": "Orange County NY Real Estate Market Report March 2026 | Jin Pang",
      "description": "March 2026 Orange County NY real estate market data: median prices, inventory, days on market, and Jin Pang's local analysis."
    }
  },
  {
    "slug": "buying-a-home-in-orange-county-complete-guide-2026",
    "title": "Buying a Home in Orange County, NY: Complete Guide for 2026",
    "category": "buyer-guides",
    "excerpt": "Everything you need to know before buying in Orange County — from pre-approval to closing, with specific guidance for the Port Jervis and greater Orange County market.",
    "heroImage": "/images/blog/buying-guide-orange-county.jpg",
    "heroImageAlt": "Family buying a home in Orange County NY",
    "authorName": "Jin Pang",
    "authorSlug": "jin-pang",
    "publishDate": "2026-02-15",
    "readTimeMinutes": 12,
    "featured": true,
    "tags": ["buying", "orange-county", "guide", "2026"],
    "seo": {
      "title": "Buying a Home in Orange County NY: Complete 2026 Guide | Jin Pang",
      "description": "Complete guide to buying a home in Orange County, NY in 2026. Pre-approval, neighborhoods, offers, inspections, and closing — from a local bilingual agent."
    }
  },
  {
    "slug": "port-jervis-orange-countys-best-kept-secret",
    "title": "Why Port Jervis Is Orange County's Best-Kept Secret",
    "category": "neighborhood-spotlights",
    "excerpt": "Most people haven't heard of Port Jervis. The ones who have moved here know something the rest don't: this tri-state border town is one of the most undervalued communities within 90 miles of New York City.",
    "heroImage": "/images/blog/port-jervis-overview.jpg",
    "heroImageAlt": "Port Jervis NY Delaware River view",
    "authorName": "Jin Pang",
    "authorSlug": "jin-pang",
    "publishDate": "2026-02-01",
    "readTimeMinutes": 8,
    "featured": false,
    "tags": ["port-jervis", "neighborhood", "relocation", "commuter"],
    "seo": {
      "title": "Port Jervis NY: Orange County's Best-Kept Secret | Jin Pang Real Estate",
      "description": "Port Jervis sits 75 miles from NYC with direct Metro-North rail. Median home prices under $300K. Here's why early movers are discovering it."
    }
  },
  {
    "slug": "nyc-to-port-jervis-commuters-complete-guide",
    "title": "NYC to Port Jervis: The Commuter's Complete Guide",
    "category": "relocation",
    "excerpt": "Metro-North rail, driving times, costs, and the honest reality of commuting between Port Jervis and New York City — from someone who helps NYC commuters relocate here every month.",
    "heroImage": "/images/blog/commuter-guide.jpg",
    "heroImageAlt": "Metro-North train in Orange County NY",
    "authorName": "Jin Pang",
    "authorSlug": "jin-pang",
    "publishDate": "2026-01-15",
    "readTimeMinutes": 7,
    "featured": false,
    "tags": ["commuter", "nyc", "port-jervis", "relocation", "metro-north"],
    "seo": {
      "title": "NYC to Port Jervis: Commuter's Complete Guide | Jin Pang",
      "description": "Everything NYC commuters need to know about commuting to Port Jervis — Metro-North schedule, costs, drive times, and what remote workers say about the transition."
    }
  },
  {
    "slug": "investment-properties-orange-county-ny-2026",
    "title": "Investment Properties in Orange County NY: What You Need to Know in 2026",
    "category": "investor-insights",
    "excerpt": "CAP rates, rental yields, short-term rental regulations, and the honest picture of investing in Orange County's growing market — from an agent who works with investors weekly.",
    "heroImage": "/images/blog/investment-orange-county.jpg",
    "heroImageAlt": "Investment property in Orange County NY",
    "authorName": "Jin Pang",
    "authorSlug": "jin-pang",
    "publishDate": "2026-01-01",
    "readTimeMinutes": 10,
    "featured": false,
    "tags": ["investment", "cap-rate", "rental", "orange-county", "2026"],
    "seo": {
      "title": "Investment Properties Orange County NY 2026 | Jin Pang Real Estate",
      "description": "Investing in Orange County NY real estate in 2026: CAP rates, rental yields, STR regulations, and market analysis from a local bilingual investment specialist."
    }
  },
  {
    "slug": "orange-county-real-estate-guide-chinese-2026",
    "title": "橙县纽约房地产完全指南 — 2026年",
    "titleZh": "橙县纽约房地产完全指南 — 2026年",
    "category": "buyer-guides",
    "excerpt": "为有意在纽约橙县购房的华人买家提供的完整指南——包括购房流程、贷款选择、学区分析和社区推荐。",
    "heroImage": "/images/blog/chinese-buyers-guide.jpg",
    "heroImageAlt": "华人家庭在橙县纽约购房指南",
    "authorName": "Jin Pang",
    "authorSlug": "jin-pang",
    "publishDate": "2026-02-20",
    "readTimeMinutes": 10,
    "featured": true,
    "tags": ["chinese", "buying", "orange-county", "international-buyer"],
    "seo": {
      "title": "橙县纽约房地产购房指南2026 | 庞锦地产",
      "description": "华人买家在纽约橙县购房的完整中文指南。购房流程、贷款选择、学区分析，由中英双语地产经纪人庞锦撰写。"
    }
  }
]
```

---

## C4: neighborhoods/

**Collection path:** `content/jinpang-homes/en/neighborhoods/[slug].json`
**Admin editor:** Neighborhoods Editor (reused from REB)
**Route:** `/[locale]/neighborhoods/[slug]`

### Schema

```typescript
interface Neighborhood {
  slug: string
  name: string
  nameZh?: string
  county: string
  state: string
  tagline: string
  taglineZh?: string
  lifestyleTags: string[]           // ["commuter-friendly", "family", "waterfront", "rural"]
  heroImage: string
  heroImageAlt: string
  overview: string                  // Rich text
  overviewZh?: string
  keyStats: {
    medianHomePrice: string
    pricePerSqft?: string
    avgDaysOnMarket?: string
    yoyPriceChange?: string
    medianRent?: string
    schoolDistrictRating?: string
    walkScore?: number
    commuteToNYC?: string
  }
  schools: {
    district: string
    rating: string
    topSchools?: string[]
    notes?: string
  }
  lifestyle: string
  lifestyleZh?: string
  insiderTake: string               // Jin's personal insight — the differentiator
  insiderTakeZh?: string
  amenities: string[]
  priceRange: string
  communityType: "urban" | "suburban" | "rural" | "waterfront"
  featuredImage2?: string
  publishDate: string
  seo: {
    title: string
    description: string
  }
}
```

### Seed Items (5 neighborhoods)

```json
[
  {
    "slug": "port-jervis",
    "name": "Port Jervis",
    "nameZh": "波特杰维斯",
    "county": "Orange County",
    "state": "NY",
    "tagline": "Tri-state charm with direct NYC rail access",
    "taglineZh": "三州交汇，直达纽约城铁",
    "lifestyleTags": ["commuter-friendly", "waterfront", "affordable", "historic"],
    "heroImage": "/images/neighborhoods/port-jervis-hero.jpg",
    "heroImageAlt": "Port Jervis NY Delaware River",
    "overview": "Port Jervis sits at the exact meeting point of New York, New Jersey, and Pennsylvania — a tri-state corner with a genuine character that most suburban towns never develop. The Delaware River runs alongside downtown, the historic buildings tell a story of a railroad boom town, and the Metro-North line runs directly to Penn Station.\n\nFor buyers priced out of more expensive suburban markets, Port Jervis offers something remarkable: detached single-family homes with yards at prices that feel almost impossible given the NYC rail access.",
    "keyStats": {
      "medianHomePrice": "$280,000",
      "avgDaysOnMarket": "32",
      "yoyPriceChange": "+9.2%",
      "medianRent": "$1,450/mo (2BR)",
      "schoolDistrictRating": "5/10",
      "commuteToNYC": "~90 min Metro-North"
    },
    "schools": {
      "district": "Port Jervis City School District",
      "rating": "5/10",
      "topSchools": ["Port Jervis High School", "Anna S. Kuhl Elementary"],
      "notes": "Improving district with new leadership initiatives. Private school alternatives available within 20-minute drive."
    },
    "lifestyle": "Port Jervis has a genuine downtown — restaurants, local shops, historic theaters. The Delaware River offers kayaking, fishing, and riverside walks. Proximity to NJ and PA adds cross-state shopping and recreation flexibility.",
    "insiderTake": "Port Jervis is where the yield investors and the first-time buyers who can do math tend to end up. The prices are still low relative to what they're becoming. The Metro-North connection is underappreciated. If I were buying for the first time on a budget and needed NYC access, this is where I'd be looking first.",
    "amenities": ["Metro-North Rail (Penn Station)", "Delaware River Recreation", "Tri-States Monument", "Local dining district", "Short-term rental activity"],
    "priceRange": "$180,000 – $380,000",
    "communityType": "urban",
    "publishDate": "2026-01-01",
    "seo": {
      "title": "Port Jervis NY Real Estate | Homes For Sale | Jin Pang",
      "description": "Explore Port Jervis, NY real estate — affordable homes with Metro-North rail to NYC. Browse listings, market data, and neighborhood insights from local agent Jin Pang."
    }
  },
  {
    "slug": "middletown",
    "name": "Middletown",
    "nameZh": "米德尔顿",
    "county": "Orange County",
    "state": "NY",
    "tagline": "Orange County's commercial hub with broad housing selection",
    "taglineZh": "橙县商业中心，房源选择多样",
    "lifestyleTags": ["commuter-friendly", "commercial", "diverse", "convenient"],
    "heroImage": "/images/neighborhoods/middletown-hero.jpg",
    "heroImageAlt": "Middletown NY downtown",
    "overview": "Middletown is Orange County's largest city and commercial center. It has the most active real estate market in the county — the widest range of price points, property types, and buyer demographics. The Chinese-American community in Orange County is centered here, with Chinese grocery stores, restaurants, and cultural organizations.",
    "keyStats": {
      "medianHomePrice": "$360,000",
      "avgDaysOnMarket": "28",
      "yoyPriceChange": "+10.5%",
      "medianRent": "$1,750/mo (2BR)",
      "schoolDistrictRating": "5/10",
      "commuteToNYC": "~70 min drive (I-84 E)"
    },
    "schools": {
      "district": "Middletown City School District",
      "rating": "5/10",
      "notes": "Largest district in Orange County. Many families in Middletown use private schools — St. Joseph's, Valley Central, and others are within easy driving distance."
    },
    "lifestyle": "Middletown has Orange County's most complete urban amenity set — major retail (Galleria at Crystal Run), diverse dining, medical centers, and the most developed Chinese-American community infrastructure in the area.",
    "insiderTake": "Middletown is where I send clients who need complete services, the most property choice, or who value the Chinese-American community infrastructure. It's also where I find the best multifamily investment deals — the inventory is largest and the buyer competition is most predictable.",
    "amenities": ["Galleria at Crystal Run", "Orange Regional Medical Center", "Chinese restaurants and grocery stores", "Wallkill Valley Rail Trail", "Major retail corridors"],
    "priceRange": "$220,000 – $650,000",
    "communityType": "urban",
    "publishDate": "2026-01-01",
    "seo": {
      "title": "Middletown NY Real Estate | Homes For Sale | Jin Pang",
      "description": "Middletown NY real estate — Orange County's largest market with the widest price range. Chinese-American community hub. Browse listings and market data with Jin Pang."
    }
  },
  {
    "slug": "warwick",
    "name": "Warwick",
    "nameZh": "沃里克",
    "county": "Orange County",
    "state": "NY",
    "tagline": "Hudson Valley charm with top-rated schools and wine country lifestyle",
    "taglineZh": "哈德逊河谷风情，顶级学区与葡萄酒乡生活",
    "lifestyleTags": ["family", "top-schools", "wine-country", "outdoor-recreation", "STR-friendly"],
    "heroImage": "/images/neighborhoods/warwick-hero.jpg",
    "heroImageAlt": "Warwick NY downtown village",
    "overview": "Warwick is consistently one of Orange County's most desirable communities — a true Hudson Valley village with a charming downtown, excellent schools, farm wineries, apple orchards, and genuine community character. It attracts buyers who want the best of suburban Orange County.",
    "keyStats": {
      "medianHomePrice": "$480,000",
      "avgDaysOnMarket": "22",
      "yoyPriceChange": "+11.8%",
      "medianRent": "$2,200/mo (3BR SFH)",
      "schoolDistrictRating": "8/10",
      "commuteToNYC": "~65 min drive (I-87 S or I-84 E)"
    },
    "schools": {
      "district": "Warwick Valley Central School District",
      "rating": "8/10",
      "topSchools": ["Warwick Valley High School", "Warwick Valley Middle School"],
      "notes": "Consistently one of Orange County's highest-rated public school districts. Primary reason many families specifically target Warwick."
    },
    "lifestyle": "Farm wineries (Warwick Valley Winery, Applewood Winery), Apple Ridge Orchards, Greenwood Lake for boating and fishing, charming Main Street dining, excellent hiking. Active STR market for weekend visitors.",
    "insiderTake": "Warwick is where families who do their school district research end up. It's also where investors who want STR income look — Warwick's weekend tourism market is real and growing. The downside: you pay a premium for both. Worth it for the schools and the lifestyle.",
    "amenities": ["Warwick Valley Winery", "Applewood Winery", "Greenwood Lake", "Warwick Farmers Market", "Apple Ridge Orchards", "Hiking trails"],
    "priceRange": "$350,000 – $1,200,000",
    "communityType": "suburban",
    "publishDate": "2026-01-01",
    "seo": {
      "title": "Warwick NY Real Estate | Homes For Sale | Jin Pang",
      "description": "Warwick NY real estate — top-rated schools, Hudson Valley charm, and wine country lifestyle. Browse Warwick homes for sale with local agent Jin Pang."
    }
  },
  {
    "slug": "goshen",
    "name": "Goshen",
    "nameZh": "戈申",
    "county": "Orange County",
    "state": "NY",
    "tagline": "Orange County's county seat — small-town feel, strong schools, growing popularity",
    "taglineZh": "橙县县城，小镇氛围，优质学区，日益受欢迎",
    "lifestyleTags": ["family", "good-schools", "historic", "suburban"],
    "heroImage": "/images/neighborhoods/goshen-hero.jpg",
    "heroImageAlt": "Goshen NY village green",
    "overview": "Goshen is Orange County's county seat — a small, tight-knit village with genuine character, good schools, and prices that sit in the sweet spot between Port Jervis affordability and Warwick premium. Families who want good schools without paying Warwick prices consistently end up here.",
    "keyStats": {
      "medianHomePrice": "$420,000",
      "avgDaysOnMarket": "25",
      "yoyPriceChange": "+10.2%",
      "medianRent": "$1,950/mo (3BR SFH)",
      "schoolDistrictRating": "7/10",
      "commuteToNYC": "~65 min drive (I-84 E)"
    },
    "schools": {
      "district": "Goshen Central School District",
      "rating": "7/10",
      "topSchools": ["Goshen High School", "Goshen Intermediate School"],
      "notes": "Strong district with smaller class sizes than urban Orange County schools. Popular alternative for families who want good schools at lower price points than Warwick."
    },
    "lifestyle": "Historic Goshen has one of the oldest horse racing tracks in the US (Historic Track), a charming village green, and genuine community events. Growing restaurant scene and active local organizations.",
    "insiderTake": "Goshen is the smart value play in Orange County's family market. You get 80% of the Warwick school quality at 85% of the price. It's also where I find the most first-time buyer success — prices are achievable and competition is slightly less intense than Warwick.",
    "amenities": ["Historic Track", "Goshen village green", "Orange County Government Center", "Local dining and shops", "Easy I-84 access"],
    "priceRange": "$300,000 – $750,000",
    "communityType": "suburban",
    "publishDate": "2026-01-01",
    "seo": {
      "title": "Goshen NY Real Estate | Homes For Sale | Jin Pang",
      "description": "Goshen NY real estate — Orange County county seat with strong schools and suburban character. Browse Goshen homes for sale with local agent Jin Pang."
    }
  },
  {
    "slug": "newburgh",
    "name": "Newburgh",
    "nameZh": "纽堡",
    "county": "Orange County",
    "state": "NY",
    "tagline": "Historic Hudson River city — gentrification in progress, strong yield opportunities",
    "taglineZh": "哈德逊河畔历史名城，士绅化进行中，投资回报显著",
    "lifestyleTags": ["investor-opportunity", "waterfront", "arts", "gentrifying", "affordable"],
    "heroImage": "/images/neighborhoods/newburgh-hero.jpg",
    "heroImageAlt": "Newburgh NY waterfront",
    "overview": "Newburgh is Orange County's most interesting market story. A historic Hudson River city with stunning 19th century architecture, a growing arts scene, and prices still dramatically below its potential — it's at an inflection point that early investors are capturing.",
    "keyStats": {
      "medianHomePrice": "$320,000",
      "avgDaysOnMarket": "30",
      "yoyPriceChange": "+12.1%",
      "medianRent": "$1,600/mo (2BR)",
      "schoolDistrictRating": "4/10",
      "commuteToNYC": "~70 min drive; Stewart Airport nearby"
    },
    "schools": {
      "district": "Newburgh Enlarged City School District",
      "rating": "4/10",
      "notes": "School district is the primary concern for family buyers. Most family-oriented buyers in Newburgh either use private schools or focus on the Towns of Newburgh (separate from City of Newburgh, with different schools)."
    },
    "lifestyle": "Newburgh Waterfront has undergone dramatic transformation — restaurants, breweries, galleries. The historic district has stunning architecture. Stewart International Airport is a significant amenity for frequent travelers.",
    "insiderTake": "Newburgh is an investor story more than a family story right now. The trajectory is clear — the waterfront transformation is real, the architecture is genuinely remarkable, and the prices are still low enough to generate real yields. Family buyers should focus on Towns of Newburgh, not City of Newburgh, for school district purposes.",
    "amenities": ["Newburgh Waterfront", "Stewart International Airport", "Historic district architecture", "Arts galleries", "Beacon NY nearby (ferry access)", "Hudson Valley craft beverage scene"],
    "priceRange": "$180,000 – $550,000",
    "communityType": "urban",
    "publishDate": "2026-01-01",
    "seo": {
      "title": "Newburgh NY Real Estate | Homes For Sale | Jin Pang",
      "description": "Newburgh NY real estate — Hudson River waterfront city with strong investment opportunities and a growing arts scene. Browse listings with local agent Jin Pang."
    }
  }
]
```

---

## C5: market-reports/

**Collection path:** `content/jinpang-homes/en/market-reports/[slug].json`
**Admin editor:** Market Reports Editor (reused from REB)
**Route:** `/[locale]/market-reports/[slug]`

### Schema

```typescript
interface MarketReport {
  slug: string                        // "orange-county-march-2026"
  title: string
  titleZh?: string
  reportMonth: string                 // "March 2026"
  reportArea: string                  // "Orange County, NY"
  heroImage: string
  excerpt: string
  excerptZh?: string
  keyStats: {
    medianSalePrice: string
    medianSalePriceChange: string     // "+9.2% YoY"
    activeInventory: string
    inventoryChange: string
    avgDaysOnMarket: string
    domChange: string
    listToSaleRatio: string
    newListings: string
    closedSales: string
  }
  analysis: string                    // Rich text — Jin's interpretation
  analysisZh?: string
  neighborhoodHighlights?: {
    neighborhood: string
    highlight: string
  }[]
  investorNote?: string
  buyerNote?: string
  sellerNote?: string
  downloadPdfUrl?: string
  publishDate: string
  featured: boolean
  seo: {
    title: string
    description: string
  }
}
```

### Seed Item (1 — March 2026)

```json
{
  "slug": "orange-county-march-2026",
  "title": "Orange County NY Real Estate Market Report — March 2026",
  "reportMonth": "March 2026",
  "reportArea": "Orange County, NY",
  "heroImage": "/images/market-reports/march-2026-hero.jpg",
  "excerpt": "Inventory remains constrained, median prices continue their upward trend, and the commuter-driven demand from NYC shows no sign of cooling. March 2026 market data and analysis.",
  "keyStats": {
    "medianSalePrice": "$398,000",
    "medianSalePriceChange": "+9.2% YoY",
    "activeInventory": "342 homes",
    "inventoryChange": "-18% vs March 2025",
    "avgDaysOnMarket": "28 days",
    "domChange": "-4 days vs March 2025",
    "listToSaleRatio": "99.1%",
    "newListings": "187",
    "closedSales": "156"
  },
  "analysis": "March 2026 continues the trend we've seen building since mid-2024: constrained inventory meeting sustained buyer demand driven by NYC-area migration and local population growth.\n\nThe 18% year-over-year inventory decline is the most significant data point this month. With just 342 active listings across a county of 420,000 residents, there simply aren't enough homes for the number of qualified buyers in the market. This supply-demand imbalance is the primary driver of the 9.2% median price increase — and it's structural, not cyclical.\n\nFor buyers: get pre-approved and be ready to move. Multiple-offer situations are the norm for correctly priced properties in Warwick, Goshen, and well-located Port Jervis listings. Properties with any deferred maintenance or pricing issues are sitting longer — creating opportunities for buyers willing to take on cosmetic work.\n\nFor sellers: the market is still strongly in your favor, but the days of any home selling instantly are behind us. Condition and pricing strategy matter more than they did 18 months ago. A home in excellent condition, correctly priced, and well-marketed will still generate competition.",
  "neighborhoodHighlights": [
    { "neighborhood": "Warwick", "highlight": "Lowest inventory month on record. Median up 11.8% YoY. Average 3 offers per listed property." },
    { "neighborhood": "Port Jervis", "highlight": "Most affordable entry point in the market. Strong investor activity. DOM shortening as commuter buyers discover Metro-North access." },
    { "neighborhood": "Middletown", "highlight": "Highest transaction volume. Multifamily inventory tight — yields holding at 5.5–7%." },
    { "neighborhood": "Newburgh", "highlight": "Fastest appreciating submarket at 12.1% YoY. Waterfront district transformation accelerating investor interest." }
  ],
  "investorNote": "Multifamily inventory is at its tightest point in three years. Off-market sourcing is increasingly the only path to yield-positive acquisitions. CAP rates in core areas holding at 5.5–7.5% gross — still significantly above comparable Orange County assets.",
  "buyerNote": "Pre-approval is non-negotiable before making offers. Cash buyers still have a meaningful advantage. For financed buyers, escalation clauses and inspection flexibility are the primary negotiating tools in competitive situations.",
  "sellerNote": "Correct pricing remains more important than ever. Overpriced listings are sitting 2–3x longer than correctly priced ones. A $10,000 price reduction after sitting 30 days costs more in net proceeds than pricing right from day one.",
  "publishDate": "2026-03-01",
  "featured": true,
  "seo": {
    "title": "Orange County NY Real Estate Market Report March 2026 | Jin Pang",
    "description": "March 2026 Orange County NY real estate market data: $398,000 median price (+9.2%), inventory -18%, 28-day DOM. Analysis from local agent Jin Pang."
  }
}
```

---

## C6: properties/

**Collection path:** `content/jinpang-homes/en/properties/[slug].json`
**Admin editor:** Properties panel in Content Editor (or dedicated Properties editor)

### Schema

```typescript
interface Property {
  slug: string
  mlsId?: string
  status: "active" | "pending" | "sold" | "coming-soon" | "for-rent"
  listPrice: number
  soldPrice?: number
  address: {
    street: string
    city: string
    state: string
    zip: string
    neighborhood?: string
    lat?: number
    lng?: number
  }
  propertyType: "single-family" | "condo" | "townhouse" | "multifamily" | "land" | "commercial"
  bedrooms: number
  bathrooms: number
  halfBathrooms?: number
  sqft?: number
  lotSqft?: number
  yearBuilt?: number
  garage?: string
  daysOnMarket?: number
  listDate?: string
  soldDate?: string
  description: string
  descriptionZh?: string
  features: string[]
  images: string[]
  heroImage: string
  virtualTourUrl?: string
  agentName: string                   // Always "Jin Pang" for REA
  agentSlug: string                   // "jin-pang"
  featured: boolean
  isSold: boolean
  saleToListRatio?: string
  seo: {
    title: string
    description: string
  }
}
```

### Seed Items (3 active + 2 sold)

*(Abbreviated — full property data entered via admin)*

```json
[
  {
    "slug": "42-oak-street-port-jervis",
    "status": "active",
    "listPrice": 279000,
    "address": { "street": "42 Oak Street", "city": "Port Jervis", "state": "NY", "zip": "12771", "neighborhood": "Port Jervis" },
    "propertyType": "single-family",
    "bedrooms": 3, "bathrooms": 2, "sqft": 1480, "lotSqft": 7200, "yearBuilt": 1962,
    "description": "Charming 3-bedroom colonial in the heart of Port Jervis. Updated kitchen, hardwood floors throughout, large backyard with deck. Walking distance to Metro-North station. One of the most affordable entries in the Port Jervis market.",
    "features": ["Hardwood floors", "Updated kitchen", "Large deck", "Fenced backyard", "Attached garage", "Metro-North walkable"],
    "images": ["/images/properties/42-oak-st-1.jpg", "/images/properties/42-oak-st-2.jpg"],
    "heroImage": "/images/properties/42-oak-st-1.jpg",
    "agentName": "Jin Pang", "agentSlug": "jin-pang",
    "featured": true, "isSold": false,
    "seo": { "title": "42 Oak Street Port Jervis NY 12771 | $279,000 | Jin Pang", "description": "3BR/2BA colonial in Port Jervis NY. Updated kitchen, hardwood floors, large backyard. Metro-North walkable. Listed at $279,000." }
  },
  {
    "slug": "88-highland-ave-goshen",
    "status": "sold",
    "listPrice": 419000,
    "soldPrice": 428000,
    "soldDate": "2026-01-15",
    "address": { "street": "88 Highland Avenue", "city": "Goshen", "state": "NY", "zip": "10924", "neighborhood": "Goshen" },
    "propertyType": "single-family",
    "bedrooms": 4, "bathrooms": 2.5, "sqft": 2100, "yearBuilt": 1998,
    "daysOnMarket": 11,
    "saleToListRatio": "102.1%",
    "description": "Sold above asking in 11 days. 4BR colonial in Goshen Central School District. Open floor plan, primary suite, finished basement.",
    "features": ["Open floor plan", "Primary suite", "Finished basement", "2-car garage", "Goshen Central SD"],
    "images": ["/images/properties/88-highland-1.jpg"],
    "heroImage": "/images/properties/88-highland-1.jpg",
    "agentName": "Jin Pang", "agentSlug": "jin-pang",
    "featured": true, "isSold": true,
    "seo": { "title": "88 Highland Ave Goshen NY — SOLD $428,000 | Jin Pang", "description": "Sold 102.1% of asking price in 11 days. 4BR colonial in Goshen NY, Goshen Central SD." }
  }
]
```

---

## C7: Gated Downloads

**Collection path:** `content/jinpang-homes/en/resources/[slug].json`
**Admin editor:** Gated Downloads Editor (dedicated sidebar item)
**Used on:** Resources hub page, inline gates on Buying/Selling/Relocating/Investing pages

### Schema

```typescript
interface GatedDownload {
  slug: string                        // "complete-buyer-guide"
  title: string
  titleZh?: string
  category: "buyer" | "seller" | "investor" | "relocator" | "general"
  description: string
  descriptionZh?: string
  icon: string
  coverImage?: string
  pdfUrl: string                      // Upload to Supabase Storage → URL here
  emailSubjectLine: string            // Subject line for delivery email
  emailBodyPreview: string            // Brief preview of what's in the guide
  active: boolean
  sortOrder: number
}
```

### Seed Items (6 guides)

```json
[
  {
    "slug": "complete-buyer-guide",
    "title": "Complete Buyer's Guide to Orange County, NY",
    "titleZh": "橙县纽约完整购房指南",
    "category": "buyer",
    "description": "Everything you need to know about buying a home in Orange County — from pre-approval to closing, in plain language.",
    "descriptionZh": "关于在橙县纽约购房您需要了解的一切——从预批款到过户，用简单易懂的语言解释。",
    "icon": "BookOpen",
    "pdfUrl": "",
    "emailSubjectLine": "Your Orange County Buyer's Guide from Jin Pang",
    "emailBodyPreview": "Here's your complete guide to buying a home in Orange County, NY. Inside you'll find...",
    "active": true,
    "sortOrder": 1
  },
  {
    "slug": "first-time-buyer-guide",
    "title": "First-Time Buyer Guide",
    "titleZh": "首次购房完整指南",
    "category": "buyer",
    "description": "A step-by-step walkthrough of the entire buying process, written specifically for first-time buyers.",
    "icon": "Home",
    "pdfUrl": "",
    "emailSubjectLine": "Your First-Time Buyer Guide from Jin Pang",
    "emailBodyPreview": "Congratulations on starting your homebuying journey! Here's your complete guide...",
    "active": true,
    "sortOrder": 2
  },
  {
    "slug": "seller-complete-guide",
    "title": "Seller's Complete Guide",
    "titleZh": "完整卖房指南",
    "category": "seller",
    "description": "From preparing your home to closing — everything you need to sell your Orange County home for the most.",
    "icon": "TrendingUp",
    "pdfUrl": "",
    "emailSubjectLine": "Your Seller's Guide from Jin Pang",
    "emailBodyPreview": "Here's your complete seller's guide for the Orange County market...",
    "active": true,
    "sortOrder": 3
  },
  {
    "slug": "relocation-guide",
    "title": "Complete Orange County Relocation Guide",
    "titleZh": "橙县完整搬迁指南",
    "category": "relocator",
    "description": "Neighborhoods, schools, commute routes, lifestyle — everything you need before making the move to Orange County.",
    "descriptionZh": "社区、学区、通勤路线、生活方式——在搬迁至橙县之前您需要了解的一切。",
    "icon": "MapPin",
    "pdfUrl": "",
    "emailSubjectLine": "Your Orange County Relocation Guide from Jin Pang",
    "emailBodyPreview": "Welcome! Here's everything you need to know before relocating to Orange County, NY...",
    "active": true,
    "sortOrder": 4
  },
  {
    "slug": "international-buyer-guide",
    "title": "International & Chinese Buyer Guide (EN + 中文)",
    "titleZh": "外籍及华人购房指南（中英双语）",
    "category": "buyer",
    "description": "A complete guide for overseas families and Chinese-speaking buyers navigating the US real estate purchase process.",
    "descriptionZh": "为海外家庭和华人买家提供的完整美国房产购买流程指南（中英双语）。",
    "icon": "Globe",
    "pdfUrl": "",
    "emailSubjectLine": "Your International Buyer Guide from Jin Pang | 庞锦国际买家指南",
    "emailBodyPreview": "Here is your complete guide for international buyers in the US real estate market...",
    "active": true,
    "sortOrder": 5
  },
  {
    "slug": "investment-market-report",
    "title": "Orange County Investment Market Report — Q1 2026",
    "category": "investor",
    "description": "CAP rates, rental yields, STR data, and investment analysis for Orange County, NY — updated quarterly.",
    "icon": "BarChart2",
    "pdfUrl": "",
    "emailSubjectLine": "Your Orange County Investment Market Report from Jin Pang",
    "emailBodyPreview": "Here's the Q1 2026 Orange County investment market data...",
    "active": true,
    "sortOrder": 6
  }
]
```

---

## C8: Hub Pages

### case-studies.json

**File:** `content/jinpang-homes/en/pages/case-studies.json`

```json
{
  "seo": {
    "title": "Real Estate Case Studies | Jin Pang | Orange County NY",
    "description": "Real transaction stories from Jin Pang's Orange County real estate practice — buyers, sellers, investors, and relocators. Honest outcomes, specific results."
  },
  "hero": {
    "headline": "Real Transactions. Real Results.",
    "subline": "Not marketing claims — actual case studies with strategies, outcomes, and client quotes.",
    "image": "/images/case-studies-hero.jpg"
  },
  "filterConfig": {
    "types": ["buyer", "seller", "investor", "relocator", "international-buyer", "first-time-buyer"],
    "typeLabels": {
      "buyer": "Buyer Stories",
      "seller": "Seller Stories",
      "investor": "Investor Stories",
      "relocator": "Relocation Stories",
      "international-buyer": "International Buyers",
      "first-time-buyer": "First-Time Buyers"
    }
  },
  "startYourStory": {
    "heading": "Ready to Write Your Own Success Story?",
    "subheading": "Let's talk about what you're trying to accomplish.",
    "ctaLabel": "Schedule a Consultation",
    "ctaHref": "/en/contact"
  }
}
```

### testimonials-page.json

**File:** `content/jinpang-homes/en/pages/testimonials.json`

```json
{
  "seo": {
    "title": "Client Testimonials | Jin Pang Real Estate | Orange County NY",
    "description": "What buyers, sellers, investors, and Chinese-speaking clients say about working with Jin Pang in Orange County, NY. 90+ five-star reviews."
  },
  "hero": {
    "headline": "What My Clients Say",
    "subline": "Real reviews from buyers, sellers, investors, and Chinese-speaking clients across Orange County.",
    "image": "/images/testimonials-hero.jpg"
  },
  "aggregateStats": {
    "averageRating": "4.9",
    "totalReviews": "90+",
    "sources": [
      { "name": "Google", "count": "45+" },
      { "name": "Zillow", "count": "28+" },
      { "name": "Realtor.com", "count": "17+" }
    ]
  },
  "filterConfig": {
    "types": ["buyer", "seller", "investor", "relocator", "general"],
    "languages": ["en", "zh"],
    "enableNeighborhoodFilter": true
  },
  "leaveReviewCta": {
    "heading": "Had a Great Experience?",
    "subheading": "Your review helps other buyers and sellers find the right agent.",
    "googleReviewUrl": "https://g.page/r/[jin-pang-google-place-id]/review",
    "ctaLabel": "Leave a Google Review"
  },
  "workWithMeCta": {
    "heading": "Ready to Add Your Story?",
    "ctaLabel": "Let's Talk",
    "ctaHref": "/en/contact"
  }
}
```

### resources.json (Gated Downloads Hub)

**File:** `content/jinpang-homes/en/pages/resources.json`

```json
{
  "seo": {
    "title": "Free Real Estate Guides & Resources | Jin Pang | Orange County NY",
    "description": "Download free buyer guides, seller guides, relocation guides, and investment reports for Orange County, NY real estate. Bilingual resources available."
  },
  "hero": {
    "headline": "Free Resources & Guides",
    "subline": "Download any guide — just leave your email and I'll send it right over.",
    "image": "/images/resources-hero.jpg"
  },
  "intro": "Every guide here was written personally — not generated, not repurposed. They're the answers to the questions I hear most often from buyers, sellers, investors, and families relocating to Orange County.",
  "categories": [
    { "id": "buyer", "label": "Buying Guides", "labelZh": "购房指南" },
    { "id": "seller", "label": "Selling Guides", "labelZh": "卖房指南" },
    { "id": "relocator", "label": "Relocation Guides", "labelZh": "搬迁指南" },
    { "id": "investor", "label": "Investment Reports", "labelZh": "投资报告" }
  ],
  "gateFormConfig": {
    "fields": ["firstName", "email"],
    "submitLabel": "Send Me the Guide",
    "submitLabelZh": "发送指南",
    "confirmationMessage": "Check your email! Your guide is on its way.",
    "confirmationMessageZh": "请查收邮件！您的指南已发送。"
  }
}
```

---

## DB Schema Additions for REA

These tables are ADDED to the base REB schema for REA-specific features:

```sql
-- Gated download capture
CREATE TABLE gated_downloads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  email text NOT NULL,
  first_name text,
  guide_slug text NOT NULL,
  download_sent boolean DEFAULT false,
  locale text DEFAULT 'en'
);

-- Investor inquiry (from investing page form)
CREATE TABLE investor_inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  site_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  investment_type text,
  budget_range text,
  timeline text,
  current_portfolio text,
  goals text,
  preferred_language text DEFAULT 'en',
  status text DEFAULT 'new'
);

-- RLS policies
ALTER TABLE gated_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service full access gated_downloads" ON gated_downloads
  USING (auth.role() = 'service_role');
CREATE POLICY "Service full access investor_inquiries" ON investor_inquiries
  USING (auth.role() = 'service_role');
```

---

## Part 3 Done-Gate

Before starting Phase 0, verify all collection contracts are ready:

- [ ] 4 case study seed items created (buyer, seller, investor, relocator)
- [ ] 15 testimonials seed items created (mix of EN and ZH)
- [ ] 6 blog post seed items created
- [ ] 5 neighborhood seed items created
- [ ] 1 market report seed item created
- [ ] 5 property seed items created (3 active + 2 sold)
- [ ] 6 gated download items defined (PDFs placeholder — to be uploaded post-launch)
- [ ] Hub pages created: case-studies.json, testimonials.json, resources.json
- [ ] All collection JSON files seeded into Supabase `content_entries`
- [ ] DB schema additions (gated_downloads, investor_inquiries) run in Supabase
- [ ] Admin editors planned: Case Studies, Testimonials, Gated Downloads, Neighborhoods, Market Reports, Knowledge Center

---

*End of REA_CONTENT_CONTRACTS_PART3.md*
*Content contracts complete. Next: REA_PHASE_0.md*
