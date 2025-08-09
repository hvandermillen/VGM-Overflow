import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import './db.mjs';

const User = mongoose.model('User');

const startAuthenticatedSession = (req, user) => {
  return new Promise((fulfill, reject) => {
    req.session.regenerate((err) => {
      if (!err) {
        req.session.user = user; 
        fulfill(user);
      } else {
        reject(err);
      }
    });
  });
};

const endAuthenticatedSession = req => {
  return new Promise((fulfill, reject) => {
    req.session.destroy(err => err ? reject(err) : fulfill(null));
  });
};


const register = async (username, email, password) => {

  // TODO: implement registration (
  // * check if username and password are both greater than 8
  //   * if not, throw { message: 'USERNAME PASSWORD TOO SHORT' }
  // * check if user with same username already exists
  //   * if not, throw { message: 'USERNAME ALREADY EXISTS' }
  // * salt and hash using bcrypt's sync functions
  //   * https://www.npmjs.com/package/bcryptjs#usage---sync
  // * if registration is successfull, return the newly created user
  // return user;

  if (username.length < 8 || password.length < 8) {
    throw({message: 'USERNAME PASSWROD TOO SHORT'});
  } else if (Object.hasOwn(User.find('username'), username)) {
    throw({message: 'USERNAME ALREADY EXISTS'});
  } else {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({
      username: username,
      email: email,
      salt: salt,
      password: hash
    });
    const savedUser = await newUser.save();
    return savedUser;
  }

};

const login = async (username, password) => {

  const foundUser = await User.findOne({'username':username});

  if (foundUser === null) {
    throw ({message: 'USER NOT FOUND'});
  } else {
    const hash = bcrypt.hashSync(password, foundUser.salt);
    if (foundUser.password !== hash) {
      throw({message: "PASSWORDS DO NOT MATCH\nCorrect: " + foundUser.password + "\n Entered: " + hash + "\n salt" + foundUser.salt});
    } else {
      return foundUser;
    }
  }

};

export {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login
};
