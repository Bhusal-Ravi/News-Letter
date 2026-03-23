import Parser from 'rss-parser'

type CustomFeed= {
    foo:string
}

type CustomItem= {
    bar:number
}

const parser:Parser<CustomFeed,CustomItem>= new Parser({
      customFields: {
    feed: ['foo'],
            
    item: ['bar']
  }
})


async function handleRssFeed(){
    try{
        const result= await parser.parseURL(`http://feeds.bbci.co.uk/news/world/rss.xml`)
        console.log(result.items)

    }catch(error){
        console.log(error)
    }
}

handleRssFeed()