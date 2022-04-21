
const express = require('express')
const mongoose= require("mongoose")

const app = express()


const {test, PORT} = require('./library/constant')

console.log(PORT, test)

mongoose.connect("mongodb://localhost:27017/dacntt2",  
  // {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex: true}
  {useNewUrlParser:true, useUnifiedTopology:true}
)
const db = mongoose.connection;
db.on("error",(err)=>{
    console.log(err);
})

db.once('open',()=>{
    console.log(" database  da duoc ket noi");
})

app.use(express.json())
app.use('/', require('./api/routers/userRoute'))
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })