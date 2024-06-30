import express from 'express'

const app = express()

app.listen(8002, ()=>{
    console.log("Order Service Listening on 8002");
})