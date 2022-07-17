var io;
const { Server } = require("socket.io");
module.exports = {
  init: (server) => {
    const io = new Server(server, {
        cors: {
          origin: "*",
      }
      }).listen(server)
    // io = require('socket.io').listen(server); io.origins('*:*');
    return io;
  },
  get: () => {

    if (!io) {
      console.log('chưa khởi tạo socket')
    }
    return io;
  }
};