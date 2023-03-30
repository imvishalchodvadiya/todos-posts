/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import mongoose from 'mongoose';
const password = encodeURIComponent(process.env.DB_PASSWORD);

const generateMongoUrl = () => {
  const mongoURL = `mongodb+srv://${process.env.DB_USER_NAME}:${password}@cluster0.rmrbmkm.mongodb.net/?retryWrites=true&w=majority`;
  return mongoURL;
};
mongoose.connect(generateMongoUrl()).then(() =>
  console.log('\x1b[34m', ' Database Connected ✔')
).catch((err) => {
  console.error('ERROR:: Database Initialization Failed: ', err);
});

import '../models/error.model';
import '../models/token.model';
import '../models/user.model';
import '../models/todo.model';
import '../models/post.model';
import '../models/comments.model';