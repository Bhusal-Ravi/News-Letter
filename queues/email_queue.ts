import { Queue, Worker } from 'bullmq'
import { connection } from '../connections/reddis_connection'
import { client as client_db } from '../connections/db_connection'
import { client } from '../connections/db_connection'
import { Email_Type, Final_Rank_Table } from '../Types/Api_Types'
import { htmlMaker } from '../services/htmlMaker'
import { resend } from '../connections/resend_gmail_connection'
import { createUnsubscribeLink } from '../utils/unsubscribeToken'
import { createRedirectLink } from '../utils/articleRedirect'



const emailQueue= new Queue('email',{connection})
const emailWorker= new Worker('email',async job=>{
        const email=job.name
       
        const data:Final_Rank_Table[]= job.data

        const newsWithRedirectLinks = await Promise.all(
            data.map(async item => {
                try {
                    const redirectUrl = await createRedirectLink(item.source)

                    return {
                        ...item,
                        redirect_url: redirectUrl,
                    }
                } catch (error) {
                    console.log('[EMAIL/WORKER] Failed to create redirect link', error)
                    return item
                }
            })
        )
      

        const techNews= newsWithRedirectLinks.filter(item=>item.category==='technews')

        const worldNews= newsWithRedirectLinks.filter(item=>item.category==='worldnews')

        const unsubscribeUrl = createUnsubscribeLink(email)

        const html= htmlMaker(techNews,worldNews,email,unsubscribeUrl)
       
        try{
             const { data, error }= await resend.emails.send({
            from:'Daily News <newsletter@bhusalravi.com.np>',
            to:email.trim(),
            subject:"Today's Breaking News",
            html: html,

            headers:{
                "List-Unsubscribe": `<${unsubscribeUrl}>`,
                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            }
        })

        if (error) {
            console.error("EMAIL FAILED") 
            console.error(error) 
            throw new Error(`Resend failed: ${error.message}`)
        }

        }catch(error){
            
            console.error("WORKER ERROR") 
            console.error(error)
            throw error 
        }
       

},{
    connection,
    limiter:{
        max: 1,
        duration: 1000,
    },
    
})

emailWorker.on('completed',async (job)=>{
    console.log(`Email sent to ${job.name} successfully`)
})







export async function startSendEmail(data:Final_Rank_Table[]){
    let db=await  client_db.connect()
    try{

        const get= await db.query(`select * from users where subscribed=$1`,[true])

        if(get.rowCount===0){
            return console.log("No users are subscribed yet")
        }

        const emails:Email_Type[]= get.rows
        
        for(let item of emails)
        {
            emailQueue.add(`${item.email}`,data, {
                            attempts: 5,
                            backoff: {
                            type: 'exponential',
                            delay: 3000,
                            jitter: 0.5,
                            },
            })
        }

        const guid= data.map((items=>items.guid))
        
        const update= await db.query(`update final_rank_table
                                      set sent=true where guid= Any($1::text[])`,[guid])

    }catch(error){
        console.log(error)
    }finally{
       db.release()
    }
    
}

