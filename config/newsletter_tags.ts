

export const NEWSLETTER_TAGS = [
    {
        category: 'worldnews',
        description: 'International relations, diplomacy, wars, military conflicts, peace negotiations, sanctions, territorial disputes between nations and geopolitical alliances',
        articlesPerTag: 3
    },
    {
        category: 'technews',
        description: 'Artificial intelligence breakthroughs, machine learning models, AI regulation and policy, major tech company announcements, robotics, semiconductor industry',
        articlesPerTag: 3
    },
    
]

export type NewsletterTag = typeof NEWSLETTER_TAGS[number]
