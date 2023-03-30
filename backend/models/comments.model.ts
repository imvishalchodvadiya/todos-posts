import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  userId: {
    ref: 'User',
    type     : String,
    required : 'UserId ID can\'t be empty.',
  },
  postId: {
    ref: 'Post',
    type     : String,
    required : 'PostId ID can\'t be empty.',
  },
  email: {
    type     : String,
    required : 'Email can\'t be empty.'
  },
  title: {
    type     : String,
    required : 'title can\'t be empty.'
  }, 
  body: {
    type     : String,
    required : 'Body can\'t be empty.'
  },
}, {
  timestamps: true,
});

const Comments = mongoose.model('Comments', todoSchema, 'app_comments');

module.exports = Comments;