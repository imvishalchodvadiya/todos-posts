import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = new Schema({
  userId: {
    type     : String,
    required : 'UserId ID can\'t be empty.',
  },
  title: {
    type     : String,
    required : 'title can\'t be empty.'
  },
  body: {
    type     : String,
  },
}, {
  timestamps: true,
});

const Post = mongoose.model('Post', postSchema, 'app_post');

module.exports = Post;