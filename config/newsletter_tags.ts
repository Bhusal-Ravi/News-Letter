

export const NEWSLETTER_TAGS = [
   {
    category: 'worldnews',
    tags: 'geopolitics, economy and trade, humanitarian issues, environment and climate, elections and governance, science and health, culture and society',
    articles_per_tag: 3
},
{
    category: 'technews',
    tags: 'artificial intelligence, cybersecurity, startups and venture capital, consumer technology, policy and regulation, science and research, space and engineering',
    articles_per_tag: 3
},
    
]

export type NewsletterTag = typeof NEWSLETTER_TAGS[number]
