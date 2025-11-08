// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   phonenumber: {
//     type: Number,
//     required: true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   address: {
//     current_Address: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     permanent_Address: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     color: {
//     type: [String],
//     default: [],
//   },
//   },
// });

// module.exports = mongoose.model("User", userSchema);


// database/schema/Schema.js
const mongoose = require("../db/db"); // ✅ use shared instance

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phonenumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  address: {
    current_Address: { type: String, required: true, trim: true },
    permanent_Address: { type: String, required: true, trim: true },
  },
  color: { type: [String], default: [] }, // ✅ moved outside "address"
  rating: { type: [String], default: [] },
});

module.exports = mongoose.model("User", userSchema);
