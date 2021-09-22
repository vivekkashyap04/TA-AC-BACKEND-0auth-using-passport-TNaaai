var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: String,
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
