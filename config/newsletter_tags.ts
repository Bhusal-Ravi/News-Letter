

export const NEWSLETTER_TAGS = [
    {
        category: 'worldnews',
        tags: 'International relations, diplomacy, wars, military conflicts, peace negotiations, sanctions, territorial disputes between nations and geopolitical alliances',
        articles_per_tag: 3
    },
    {
        category: 'technews',
        tags: 'Artificial intelligence breakthroughs, machine learning models, AI regulation and policy, major tech company announcements, robotics, semiconductor industry',
        articles_per_tag: 3
    },
    
]

export type NewsletterTag = typeof NEWSLETTER_TAGS[number]
