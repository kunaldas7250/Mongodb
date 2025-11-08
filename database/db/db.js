

// const mongoose = require("mongoose");

// async function Connection() {
//   try {
//     await mongoose.connect(
//       // "mongodb+srv://chat-app:LZOKp4IF52ht6Dvp@chat-app.btdhu91.mongodb.net/",
//      "mongodb+srv://chat-app:LZOKp4IF52ht6Dvp@chat-app.btdhu91.mongodb.net/test",
    
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       }
//     );
//     console.log("✅ Successfully connected to MongoDB");
//   } catch (error) {
//     console.error("❌ Something went wrong:", error.message);
//   }
// }

// module.exports = Connection;



// database/db/db.js
const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://chat-app:LZOKp4IF52ht6Dvp@chat-app.btdhu91.mongodb.net/test",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("✅ Successfully connected to MongoDB");
  } catch (error) {
    console.error("❌ Connection error:", error.message);
  }
}

connectDB(); // connect immediately
module.exports = mongoose; // ✅ export this SAME mongoose instance
