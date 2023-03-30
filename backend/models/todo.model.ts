import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  userId: {
    type     : String,
    required : 'UserId ID can\'t be empty.',
  },
  title: {
    type     : String,
    required : 'title can\'t be empty.'
  },
  completed: {
    type     : Boolean,
    default : false,
  },
}, {
  timestamps: true,
});

const Todo = mongoose.model('Todo', todoSchema, 'app_todo');

module.exports = Todo;