const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

require('./init'); // Init MongoDB connection

const Message = require('./models/message');

io.on('connection', socket => {
  socket.on('message_sent', async (content, fn) => {
    const msg = new Message(content);

    try {
      const result = await msg.save();

      console.log(
        `Message sent by ${content.sender} to ${
          content.sender
        } saved under _id ${result._id}`
      );
    } catch (err) {
      console.log(err);
    }
  });
});

http.listen(PORT, () => console.log(`listening on *:${PORT}`));
