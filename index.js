require('dotenv').config() // sử dụng cho file env
const express = require('express')
const mongoose = require("mongoose")

const { PORT } = require('./library/constant')
const app = express()
// router
const AccountRouter = require('./api/routers/userRoute')
const PostRoute = require('./api/routers/postRoute')
const CommentRoute = require('./api/routers/commentRoute')
const likeRoute = require('./api/routers/likeRoute')
const shareRoute = require('./api/routers/shareRoute') 

app.use(express.json())
app.use('/api', AccountRouter)
app.use('/api', PostRoute)
app.use('/api', CommentRoute)
app.use('/api', likeRoute )
app.use('/api', shareRoute)
// mongodb://localhost:27017/dacntt2 sẽ lỗi "connect ECONNREFUSED ::1:27017"
mongoose.connect("mongodb://0.0.0.0:27017/dacntt2",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const httpServer = app.listen(PORT, () => console.log("http://localhost:" + PORT))
  })
  .catch((e) => console.log("Khong the ket noi toi db server: " + e.message));



// db.once('open',()=>{
//     console.log(" database  da duoc ket noi");
// })

// app.use(express.json())
// app.use('/api', require('./api/routers/userRoute'))
// app.use('/api', require('./api/routers/commentRoute'))
// app.use('/api', require('./api/routers/likeRoute'))
// app.use('/api', require('./api/routers/shareRoute'))

// app.listen(PORT, () => {
//     console.log(`Example app listening on port ${PORT}`)
//   })