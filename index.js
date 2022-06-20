require('dotenv').config() // sử dụng cho file env
const express = require('express')
const mongoose = require("mongoose")
const cors = require('cors') // cho phép truy cập từ domain khác

const { PORT } = require('./library/constant')
const app = express()
// router
const AccountRouter = require('./api/routers/userRoute')
const PostRoute = require('./api/routers/postRoute')
const CommentRoute = require('./api/routers/commentRoute')
const likeRoute = require('./api/routers/likeRoute')
const shareRoute = require('./api/routers/shareRoute')
const notificationRoute = require('./api/routers/notificationRoute')
const friendRequest = require('./api/routers/friendRequestRoute')
const { Server } = require("socket.io");
const userOnline = require('./models/userOnline')

app.use(express.json())
app.use(cors({ credentials: true, origin: true })); // để client có thể gửi thông tin withCredential: true
app.use('/api', AccountRouter)
app.use('/api', PostRoute)
app.use('/api', CommentRoute)
app.use('/api', likeRoute)
app.use('/api', shareRoute)
app.use('/api', notificationRoute)
app.use('/api', friendRequest)
// mongodb://localhost:27017/dacntt2 sẽ lỗi "connect ECONNREFUSED ::1:27017"


// mongoose.connect("mongodb://0.0.0.0:27017/dacntt2",
mongoose.connect("mongodb+srv://dacntt2:dacntt2@socialnetworktdt.x9hcb.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {

    console.log("da ket noi thanh cong db")
  })
  .catch((e) => console.log("Khong the ket noi toi db server: " + e.message));

const httpServer = app.listen(PORT, () => console.log("http://localhost:" + PORT))


// const io = require('./library/socketio').init(httpServer);

// io.on('connection', (socket) => {
//   console.log('Connection success', socket.id);
// })
let onlineUsers = [];
// const addNewUser = (userId, socketId) => {
//     userOnline.findOne({userId:userId, socketId:socketId})
//     .then((dataUserOnline)=>{
//       if(!dataUserOnline){
//         console.log("da vao ")
//         let newUserOn = new userOnline({
//           userId:userId,
//           socketId: socketId
//       })
//       newUserOn.save()
//       }
//     })
// };

const removeUser = (socketId) => {
  console.log("socketId 123 ", socketId)
  userOnline.deleteMany({ socketId: socketId })
    .then(() => {
      console.log("remove success")
    })
  // onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  userOnline.findOne({userId: userId})
  .then(dataUserId=>{
    return dataUserId
  })
};

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
})
// console.log("New client connected " + socket.id); 
io.on("connection", (socket) => { ///Handle khi có connect từ client tới
  socket.on("newUser",async(idNewUser) => {
    dataUserOnline = await userOnline.findOne({userId:idNewUser, socketId:socket.id})
    if(!dataUserOnline){
        await new userOnline({
          userId:idNewUser,
          socketId: socket.id
      }).save()
    }
  // socket.on("newUser", (idNewUser) => {
  //   console.log(idNewUser, socket.id)
  //   userOnline.findOne({ userId: idNewUser, socketId: socket.id })
  //     .then((dataUserOnline) => {
  //       console.log("da vao2 ", dataUserOnline)
  //       if (!dataUserOnline) {
  //         console.log("da vao ")
  //         let newUserOnline = new userOnline({
  //           userId: idNewUser,
  //           socketId: socket.id
  //         }).save()
  //       }
  //     })
    console.log("123123", idNewUser, socket.id)
  });

// socket.on('createNewNoti', (dataUserId)=>{
//   console.log("lalalalaal")
//   userOnline.findOne({userId: dataUserId})
//   .then(dataUserId=>{
//     console.log("234234234", dataUserId)
//     io.to(dataUserId.socketId).emit("receive_message",'đã bình luận bài viết của bạn')
//   })

// })

socket.on("disconnect", () => {
  console.log(" da vao díconec", socket.id)
  removeUser(socket.id)
});

});

const IoObject = io;
module.exports.IoObject = IoObject


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