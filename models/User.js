// Bring in mongoose
const mongoose = require("mongoose");

// Create a shcema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});
// Create a model using the schema
const User = mongoose.model("User", UserSchema);
// Export it to be used in other files
module.exports = User;
