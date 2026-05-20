

export const NEWSLETTER_TAGS = [
   {
    category: 'worldnews',
    tags: 'geopolitics, economy and trade,war,killing, humanitarian issues, environment and climate, elections and governance, science and health, culture and society',
    articles_per_tag: 4
},
{
    category: 'technews',
    tags: 'artificial intelligence,compromised,cybersecurity, startups and venture capital, consumer technology, policy and regulation, science and research, space and engineering',
    articles_per_tag: 4
},
    
]

export type NewsletterTag = typeof NEWSLETTER_TAGS[number]
