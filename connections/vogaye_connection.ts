import dotenv from 'dotenv'
dotenv.config()

import {VoyageAIClient} from 'voyageai'
export const client= new VoyageAIClient({apiKey:process.env.VOYAGE_API_KEY})

 

// async function checkVoyageConnection(){
//     try{
//         const res=await client.embed({
//             input:"Connection",
//             model:'voyage-4-lite'
//         })
        
//         console.log('Voyage Connected')
//     }catch(error){
//         console.log(error)
//     }
// }

// checkVoyageConnection()