import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: {
    type     : String,
    required : 'User ID can\'t be empty.',
  },
  email: {
    type      : String,
    required  : 'Email can\'t be empty.',
  },
  firstName: {
    type     : String,
    required : 'First name can\'t be empty.',
  },
  lastName: {
    type: String,
  },
  password: {
    type     : String,
    required : 'Password can\'t be empty.',
  },
  country: {
    type: String,
  },
  phone: {
    type: String,
  },
  roles: {
    type: [Object],
  }
}, {
  timestamps: true,
});

userSchema.path('email').validate((val) => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, 'Invalid email, please enter a valid email.');

const User = mongoose.model('User', userSchema, 'app_users');

module.exports = User;