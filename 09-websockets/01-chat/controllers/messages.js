const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  if (typeof ctx.user === 'undefined' ) {
    ctx.status = 401;
    const err = {error: 'Пользователь не залогинен'};
    ctx.body = err;
    return;
  }

  const messageList = await Message.find({chat: ctx.user.id}, null, {limit: 20, sort: {date: -1}});
  const messages = [];

  for (const message of messageList) {
    const messageObj = {
      date: message.date.toISOString(),
      text: message.text,
      id: message.id,
      user: message.user,
    };
    messages.push(messageObj);
  }

  if (!messages) {
    return new Error('Not Found');
  }

  ctx.body = {messages};
};
