const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

require('./init'); // Init MongoDB connection

const USERS_CHATS = {};

const Message = require('./models/message');

io.on('connection', socket => {
  socket.on('user_connected', async (content, fn) => {
    USERS_CHATS[content.userId] = socket.id;
  });

  socket.on('message_sent', async (content, fn) => {
    USERS_CHATS[content.sender] = socket.id;

    const msg = new Message(content);

    try {
      const result = await msg.save();

      console.log(
        `Message sent by ${content.sender} to ${
          content.receiver
        } saved under _id ${result._id}`
      );

      // Send back the full message object saved in the DB.
      fn(result);

      const receiverSocketId = USERS_CHATS[content.receiver];

      if (receiverSocketId) {
        io.sockets.connected[receiverSocketId].emit(
          'message_received',
          result
        );
      }
    } catch (err) {
      console.log(err);
    }
  });
});

http.listen(PORT, () => console.log(`listening on *:${PORT}`));
