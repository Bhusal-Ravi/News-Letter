import { Queue, Worker } from 'bullmq'
import { connection } from '../connections/reddis_connection'
import { client as client_db } from '../connections/db_connection'
import { client } from '../connections/db_connection'
import { Email_Type, Final_Rank_Table } from '../Types/Api_Types'
import { htmlMaker } from '../services/htmlMaker'
import { resend } from '../connections/resend_gmail_connection'



const emailQueue= new Queue('email',{connection})
const emailWorker= new Worker('email',async job=>{
        const email=job.name
       
        const data:Final_Rank_Table[]= job.data
      

        const techNews= data.filter(item=>item.category==='technews')

        const worldNews= data.filter(item=>item.category==='worldnews')

       const html= htmlMaker(worldNews,techNews,email)
       
        try{
             const { data, error }= await resend.emails.send({
            from:'newsletter@bhusalravi.com.np',
            to:email.trim(),
            subject:"Today's Breaking News",
            html: html
        })

        if (error) {
            console.error("EMAIL FAILED") 
            console.error(error) 
            return
        }

        }catch(error){
            
            console.error("WORKER ERROR") 
            console.error(error)
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

    }catch(error){
        console.log(error)
    }finally{
       db.release()
    }
    
}

