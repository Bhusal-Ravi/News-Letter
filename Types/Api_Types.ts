// export interface Voyage_Data_Type{
//     object:string,
//     embedding:number[],
//     index:number

// }

// export interface Voyage_Output_Type{
//     object:string,
//     data: Voyage_Data_Type[],
//     model:string,
    
// }

export interface Rss_Feed_Type {
    creator:string,
    title:string,
    link:string,
    pubDate:string,
    content:string,
    contentSnippet:string
    guid:string
    isoDate:string
}

export interface Rss_Clean_Table {
    title:string,
    source:string,
    content:string,
    published_date:string,
    guid:string,
    category:string
}


export interface Temp_Rank_Table {
    title:string,
    source:string,
    content:string,
    raw_content:string,
    published_date:string,
    guid:string,
    category:string,
    image_url:string
}

export interface Rss_Clean_Table_Embedding {
    title:string,
    source:string,
    content:string,
    published_date:string,
    guid:string,
    category:string,
    embedding?:number[]
}

export interface Tags {
    tags:string,
    category:string,
    embedding?:number[],
    articles_per_tag:number,

}


export interface Final_Rank_Table {
    guid:string,
    title:string,
    content:string,
    source:string,
    category:string,
    published_date:string,
    image_url:string
}


export interface Email_Type {
    id:string,
    email:string,
    subscribed:boolean,
    created_at:string,
    updated_at:string
}