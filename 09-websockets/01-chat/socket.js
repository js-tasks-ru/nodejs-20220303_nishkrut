// const socketIO = require('socket.io');


const Session = require('./models/Session');
const Message = require('./models/Message');
const User = require('./models/User');

function socket(server) {
  const io = require('socket.io')(server, {
    allowEIO3: true, // false by default
  });


  io.use(async function(socket, next) {
    const {token} = socket.handshake.query;

    if (!token) {
      return next(new Error('anonymous sessions are not allowed'));
    }

    const session = await Session.findOne({token: token});
    if (!session) {
      return next(new Error('wrong or expired session token'));
    }

    const user = await User.findById(session.user);

    socket.user = user;
    next();
  });

  io.on('connection', function(socket) {
    // console.log('connection  ', socket);
    socket.on('message', async (msg) => {
      // console.log(socket.user);

      const message =new Message({
        date: new Date(),
        text: msg,
        chat: socket.user.id,
        user: socket.user.displayName,
      });

      await message.save();
      // new Error("anonymous sessions are not allowed")
    });
  });

  return io;
}

module.exports = socket;

/*
На каждое сообщения пользователя, пришедшее по протоколу Websocket (событие message) необходимо сохранять сообщение в базу, передав 4 значения:
date – текущая дата
text – текст сообщения
chat – идентификатор чата, являющийся идентификатором текущего пользователя (т.е. user.id)
user – имя (displayName пользователя)*/
