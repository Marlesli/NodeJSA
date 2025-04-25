const mongoose = require('mongoose');
const Schema = mongoose.Schema; // ✅ THIS is what you're missing

const todoSchema = new Schema({
  taskName: String,
  done: Boolean
  }
);

module.exports = mongoose.model('Todo', todoSchema);


// const mongoose = require('mongoose');
// const schema = mongoose.schema;

// const todoSchema = new Schema({
//     taskName: {type: String, required: true, max: 100},
//     done: Boolean
// });

// module.exports = mongoose.model('todoModel', todoSchema);
