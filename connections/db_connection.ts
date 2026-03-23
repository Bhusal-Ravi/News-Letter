import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const { Pool, Client } = pg

export const client = new Pool()

client.query('SELECT NOW()', (err, res) => {
  try{
    console.log('Db connected successfully')
  }catch(error){
    console.log(error)
  }
})