const User = require('../../models/User');
module.exports = async function authenticate(strategy, email, displayName, done) {
  if (email === undefined) {
    // const emailErr = new Error('Поле email не передано');
    return done(null, false, 'Не указан email');
  }

  try {
    const user = await User.findOne({email: email});

    if (!user) {
      const user = {
        'email': email,
        'displayName': displayName,
        'social': strategy,
      };

      const u = new User(user);
      await u.save();
      return done(null, user);
    }
    return done(null, user);
  } catch (err) {
    done(err, false);
  }
  // done(null, false, `функция аутентификации с помощью ${strategy} не настроена`);
};
