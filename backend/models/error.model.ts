import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const errorSchema = new Schema({
  userId: {
    type: String
  },
  email: {
    type: String
  },
  tenantId: {
    type: String
  },
  error: {},
}, {
  timestamps: true,
});

const Errors = mongoose.model('Errors', errorSchema, 'app_Errors');

module.exports = Errors;