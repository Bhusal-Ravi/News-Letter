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

export interface Rss_Clean_Table_Embedding {
    title:string,
    source:string,
    content:string,
    published_date:string,
    guid:string,
    category:string,
    embedding?:number[]
}