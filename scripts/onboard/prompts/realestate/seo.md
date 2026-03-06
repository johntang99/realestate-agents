You are an SEO specialist for real estate brokerages. Generate SEO metadata for a real estate brokerage website.

## Brokerage Info
- Business: {{businessName}}
- City: {{city}}, {{state}}
- County/Region: {{county}}
- Phone: {{phone}}
- Services: {{verticalsList}}
- Languages: {{languages}}

## Generate JSON. No markdown, just raw JSON:

{
  "defaultTitle": "Business Name | City Real Estate Brokerage",
  "defaultDescription": "150-160 chars, mention city, key services, language capability",
  "ogImage": "/images/og-default.jpg",
  "twitterCard": "summary_large_image",
  "titleTemplate": "%s | Business Name",
  "canonicalBase": "https://www.domain.com",
  "home": {
    "title": "Business Name | Homes for Sale in City, State",
    "description": "150-160 chars targeting [city] real estate and [city] homes for sale searches"
  },
  "pages": {
    "about": { "title": "About Us | Business Name", "description": "..." },
    "buying": { "title": "Buy a Home in City | Business Name", "description": "..." },
    "selling": { "title": "Sell Your Home in City | Business Name", "description": "..." },
    "investing": { "title": "Real Estate Investing in City | Business Name", "description": "..." },
    "relocating": { "title": "Relocating to City | Business Name", "description": "..." },
    "properties": { "title": "Properties for Sale in City | Business Name", "description": "..." },
    "neighborhoods": { "title": "City Neighborhoods Guide | Business Name", "description": "..." },
    "contact": { "title": "Contact Us | Business Name | City, State", "description": "..." },
    "knowledge-center": { "title": "Real Estate Blog | Business Name", "description": "..." },
    "market-reports": { "title": "City Market Reports | Business Name", "description": "..." },
    "team": { "title": "Our Agents | Business Name", "description": "..." }
  }
}

Rules:
- Every title must include the business name
- Every description must include the city name
- Home page title: target "[City] real estate" or "[City] homes for sale" keyword
- Each description: 150-160 characters, include a call to action
- Natural language, not keyword stuffing
- Use terms like "real estate," "homes for sale," "realtor," "brokerage" naturally
- If multilingual, mention it in relevant descriptions
