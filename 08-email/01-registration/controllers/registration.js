const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const verificationToken = uuid();
  const {displayName, email, password} = ctx.request.body;

  try {
    const checkUser = await User.findOne({email: email});

    if (checkUser) {
      ctx.status = 400;
      ctx.body = {errors: {email: 'Такой email уже существует'}};
      return;
    }

    const newUser = {
      email,
      displayName,
      verificationToken,
    };

    const u = new User(newUser);

    await u.setPassword(password);
    await u.save();

    await sendMail({
      template: 'confirmation',
      locals: {token: verificationToken},
      to: email,
      subject: 'Подтвердите почту',
    });

    ctx.body = {status: 'ok'};
    return;
  } catch (error) {
    ctx.status = 400;
    ctx.body = {errors: {email: 'Невалидный email'}};
  }
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  const user = await User.findOne({verificationToken: verificationToken});

  if (!user) {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
    return;
  }

  user.verificationToken = undefined;
  user.save();
  const token = await ctx.login(user);
  ctx.body = {token};
};
