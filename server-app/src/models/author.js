const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 5,
  },
  born: {
    type: Number,
  },
});

authorSchema.plugin(uniqueValidator);

const Author = mongoose.model('Author', authorSchema);
module.exports = Author;
