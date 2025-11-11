
const express = require("express");
const path = require("path");
const mongoose = require("./database/db/db"); // ✅ same mongoose instance
const User = require("./database/schema/Schema"); // ✅ same connected model
const Car=require("./database/schema/opertorSchema")
const CarDetails=require("./database/schema/AggreateSchema");
const { model } = require("mongoose");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect MongoDB
//Connection();

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
  res.redirect("/inserted");
});

// ✅ Render form page
app.get("/inserted", (req, res) => {
  res.render("insert"); // Your EJS form file
});

// ✅ Insert data
app.post("/inserted", async (req, res) => {
  const { name, phonenumber, email, current_Address, permanent_Address } = req.body;

  try {
    if (!name || !phonenumber || !email || !current_Address || !permanent_Address) {
      return res.status(400).send("⚠️ Please fill all fields!");
    }

    const user = new User({
      name,
      phonenumber,
      email,
      address: { current_Address, permanent_Address },
    });

    await user.save();
    res.send("✅ User data inserted successfully!");
  } catch (error) {
    console.error(`❌ Error inserting user: ${error.message}`);
    res.status(500).send("❌ Internal Server Error");
  }
});

// ✅ Find one user
app.get("/findOne", async (req, res) => {
  try {
    const user = await User.findOne(); // fetches the first user
    res.json(user);
  } catch (error) {
    console.error(`something went wrong ${error}`);
    res.status(500).send("❌ Error fetching data");
  }
});
app.get("/findfilter",async(req,res)=>{
    try {
        const findfilter=await User.find(
            {},{name:1,email:1,phonenumber:1,_id:0}
        )
        res.json(findfilter)
    } catch (error) {
        console.error(`something went wrong`)
    }
})

app.get("/findfilter2",async(req,res)=>{
    try {
        const findfilter=await User.find(
            {name:"updated test"}
        )
        res.json(findfilter)
    } catch (error) {
        console.error(`something went wrong`)
    }
})
// ✅ Find many users
app.get("/findMany", async (req, res) => {
  try {
    const users = await User.find(); // fetches all users
    res.json(users);
  } catch (error) {
    console.error(`something went wrong ${error}`);
    res.status(500).send("❌ Error fetching data");
  }
});
app.get("/updated",async(req,res)=>{
    try {
        const users=await User.updateOne(
            {email:"abc@gmail.com"},
            {$set:{name:"kunal das updated"}},
            
        )
        res.send(users)
    } catch (error) {
        console.error(`something went wrong ${error}`)
    }
})
app.get("/updated2", async (req, res) => {
  try {
    const _id = "690cd62efcd520ef4a63be3c";

    const updatedUser = await User.findByIdAndUpdate(
      _id, // ✅ just pass the id directly
      { $set: { name: "updated test", email: "helo@gmail.com" } }, // ✅ single update object
      { new: true } // ✅ returns updated document
    );

    if (!updatedUser) {
      return res.status(404).send("❌ User not found");
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Error updating user");
  }
});
app.post("/updated3", async (req, res) => {
  try {
    const updated_user = await User.updateMany(
      { name:"updated test" }, // ✅ Correct nested path
      { $set: { phonenumber: "456897854123" } },
       // ✅ Store as string
    );

    if (updated_user.matchedCount === 0) {
      return res.status(404).send("❌ No users found with permanent address dhanbad");
    }

    res.json({
      message: "✅ Users updated successfully!",
      result: updated_user
    });
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Error updating users");
  }
});
app.get("/updated10", async (req, res) => {
  try {
//     console.log("Connection state:", mongoose.connection.readyState); // check DB state
// console.log("Model DB Name:", User.db.name); 
    const check = await User.updateOne(
      { email: "helo@gmail.com" },
      { $push:{"rating":5236,} }
    );

    console.log(check);
    if (check.matchedCount === 0) {
      return res.status(404).send("❌ User not found");
    }

    res.json({
      message: "✅ User updated successfully",
      result: check
    });
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Error updating user");
  }
});

app.post("/testpush", async (req, res) => {
  try {
    const testprt = await User.updateMany(
      { "address.permanent_Address": "dhanbad" }, // ✅ nested field in quotes
      { $push: { color: { $each: ["red", "blue", "green"] } } } // ✅ array push
    );

    if (testprt.matchedCount === 0) {
      return res.status(404).send("❌ No matching users found");
    }

    res.status(200).json({
      message: "✅ Colors pushed successfully",
      result: testprt,
    });
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/unsetcolor",async(req,res)=>{
    try {
        const check=await User.updateOne(
            { "address.permanent_Address": "dhanbad" },
            {$unset:{color:"red"}}
        )
        res.json(check)
    } catch (error) {
        console.error("something went wrong")
    }
})
app.post("/upsertpush", async (req, res) => {
  try {
    const upsert = await User.updateOne(
      { email: "xyz@gmail.com" }, // filter condition
      {
        $set: {
          name: "Kunal Das",
          email: "abc@gmail.com",
          phonenumber: "78945612357",
        },
      },
      { upsert: true } // ✅ create new doc if not found
    );

    res.status(200).json({
      message: "✅ Upsert operation successful",
      result: upsert,
    });
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.delete("/deltone",async(req,res)=>{
    try {
        const dlt=await User.deleteOne(
            {name:"Kunal Das"}
        )
        res.json(dlt)
    } catch (error) {
       console.log("something went wrong") 
    }
})
app.post("/InsertedCar",async(req,res)=>{
    try {
      const CAR=  await Car.insertMany([
      {
        maker: "Hyundai",
        model: "Creta",
        fuel_type: "Diesel",
        transmission: "Manual",
        engine: {
          type: "Naturally Aspirated",
          cc: 1493,
          torque: "250 Nm",
        },
        features: [
          "Sunroof",
          "Leather Seats",
          "Wireless Charging",
          "Ventilated Seats",
          "Bluetooth",
        ],
        sunroof: true,
        airbags: 6,
      },
      {
        maker: "Maruti Suzuki",
        model: "Baleno",
        fuel_type: "Petrol",
        transmission: "Automatic",
        engine: {
          type: "Naturally Aspirated",
          cc: 1197,
          torque: "113 Nm",
        },
        features: ["Projector Headlamps", "Apple CarPlay", "ABS"],
        sunroof: false,
        airbags: 2,
      },
      {
        maker: "Mahindra",
        model: "XUV500",
        fuel_type: "Diesel",
        transmission: "Manual",
        engine: {
          type: "Turbocharged",
          cc: 2179,
          torque: "360 Nm",
        },
        features: ["All-Wheel Drive", "Navigation System", "Cruise Control"],
        sunroof: true,
        airbags: 6,
      },
      {
        maker: "Honda",
        model: "City",
        fuel_type: "Petrol",
        transmission: "Automatic",
        engine: {
          type: "Naturally Aspirated",
          cc: 1498,
          torque: "145 Nm",
        },
        features: [
          "Keyless Entry",
          "Auto AC",
          "Multi-angle Rearview Camera",
        ],
        sunroof: false,
        airbags: 4,
      },
    ])
    res.json(CAR)
    console.log("✅ Cars inserted successfully!");

    } catch (error) {
        console.log(`something went wrong`)
    }
})
app.get("/opertaorseach", async (req, res) => {
  try {
    const check = await Car.find({ "engine.cc": { $gt: 1400 } }); // ✅ fixed
    res.json(check);
  } catch (error) {
    console.error("❌ Something went wrong:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/Searchcar", async (req, res) => {
  try {
    const check = await Car.find({
  "engine.cc": { $gt: 1400, $lt: 2500 },
  fuel_type: "Diesel",
  sunroof: true
}).sort({ "engine.cc": -1 }) // 🔽 -1 means descending order
      .limit(2); // ✅ top 2 results
    res.json(check);
  } catch (error) {
    console.error("❌ Something went wrong:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/SearchCar2",async(req,res)=>{
    try {
      const search=await Car.find(
        {"engine.cc":{$in:[1498,2179]}}
      ).sort({"engine.cc":-1})
      res.json(search)
    } catch (error) {
        console.error("something went wrong")
    }
})

app.get("/SearchCar3",async(req,res)=>{
    try {
      const search=await Car.find(
        {"engine.cc":{$nin:[1498,2179]}}
      ).sort({"engine.cc":-1})
      res.json(search)
    } catch (error) {
        console.error("something went wrong")
    }
})

app.get("/logical-operator", async (req, res) => {
  try {
    const user = await Car.find({
      $and: [
        { fuel_type: "Diesel" },
        { sunroof: true },
        { "engine.type": "Turbocharged" } // ✅ fixed
      ]
    });

    res.status(200).json({
      message: "✅ Cars matching logical AND condition",
      result: user
    });
  } catch (error) {
    console.error("❌ Something went wrong:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/logical-operator2", async (req, res) => {
  try {
    const user = await Car.find({
      $or: [
        { fuel_type: "Diesel" },
        { "engine.type": "Turbocharged" } // ✅ fixed
      ]
    });

    res.status(200).json({
      message: "✅ Cars matching logical AND condition",
      result: user
    });
  } catch (error) {
    console.error("❌ Something went wrong:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/logical-operator3", async (req, res) => {
  try {
    const user = await Car.find({
      $nor: [
        { fuel_type: "Diesel" },
        { "engine.type": "Turbocharged" } // ✅ fixed
      ]
    });

    res.status(200).json({
      message: "✅ Cars matching logical AND condition",
      result: user
    });
  } catch (error) {
    console.error("❌ Something went wrong:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/logical-operator4", async (req, res) => {
  try {
    const user = await Car.find({ fuel_type: { $exists: true } });

    res.status(200).json({
      message: "✅ Cars where 'fuel_type' field exists",
      result: user
    });
  } catch (error) {
    console.error("❌ Something went wrong:", error.message);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/size", async (req, res) => {
  try {
    const check = await Car.find({
      features: { $size: 3} // ✅ finds all cars with exactly 4 features
    });

    res.status(200).json({
      message: "✅ Cars having exactly 4 features",
      result: check
    });

  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/all",async(req,res)=>{
    try {
        const check=await Car.find(
            {features:{$all:["Bluetooth"]}}
        )
        res.status(200).json({
      message: "✅ Cars having exactly have Bluetooth",
      result: check
    });
    } catch (error) {
        console.error(`something went wrong`)
    }
})
app.get("/cursor-method-all", async (req, res) => {
  try {
    const count = await Car.countDocuments(); // ✅ recommended method
    res.send(`Total Cars: ${count}`);
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/cursor-method-filter",async(req,res)=>{
    try {
        const check=await Car.countDocuments({fuel_type:"Diesel"})
        res.send(`toTal cars have diesel type:${check}`)
    } catch (error) {
        console.error(`something went wrong`)
    }
})
app.get("/cursor-method-sort", async (req, res) => {
  try {
    const check = await Car.find(
      {},                 // filter (empty = all documents)
      { model: 1, _id: 0 } // projection (only model field)
    ).sort({ model: 1 });  // ✅ ascending order by model name

    res.status(200).json({
      message: "✅ Cars sorted by model name (ascending)",
      result: check
    });
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/skip", async (req, res) => {
  try {
    const check = await Car.find().skip(2); // ✅ skips first 2 documents
    res.json(check);
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/insertCARsCHEMA",async(req,res)=>{
  try {
    const CARdETAILS=await CarDetails.insertMany([
  {
    maker: "Hyundai",
    model: "Creta",
    fuel_type: "Diesel",
    transmission: "Manual",
    engine: { type: "Naturally Aspirated", cc: 1493, torque: "250 Nm" },
    features: ["Sunroof", "Leather Seats", "Wireless Charging", "Bluetooth"],
    sunroof: true,
    airbags: 6,
    price: 1500000,
    owners: [
      { name: "Raju", purchase_date: "2021-03-15", location: "Mumbai" },
      { name: "Shyam", purchase_date: "2023-01-10", location: "Delhi" }
    ],
    service_history: [
      { date: "2022-04-10", service_type: "Oil Change", cost: 5000 },
      { date: "2023-07-18", service_type: "Brake Replacement", cost: 12000 }
    ]
  },
  {
    maker: "Maruti Suzuki",
    model: "Baleno",
    fuel_type: "Petrol",
    transmission: "Automatic",
    engine: { type: "Naturally Aspirated", cc: 1197, torque: "113 Nm" },
    features: ["Projector Headlamps", "Apple CarPlay", "ABS"],
    sunroof: false,
    airbags: 2,
    price: 850000,
    owners: [
      { name: "Baburao", purchase_date: "2020-08-22", location: "Pune" }
    ],
    service_history: [
      { date: "2021-05-12", service_type: "Tire Rotation", cost: 2000 },
      { date: "2022-11-05", service_type: "Battery Replacement", cost: 7000 }
    ]
  },
  {
    maker: "Mahindra",
    model: "XUV700",
    fuel_type: "Diesel",
    transmission: "Manual",
    engine: { type: "Turbocharged", cc: 2198, torque: "360 Nm" },
    features: ["Cruise Control", "All-Wheel Drive", "Panoramic Sunroof"],
    sunroof: true,
    airbags: 6,
    price: 2200000,
    owners: [
      { name: "Arjun", purchase_date: "2022-04-05", location: "Bangalore" }
    ],
    service_history: [
      { date: "2023-04-12", service_type: "Oil Change", cost: 6000 },
      { date: "2023-09-22", service_type: "Transmission Repair", cost: 25000 }
    ]
  },
  {
    maker: "Honda",
    model: "City",
    fuel_type: "Petrol",
    transmission: "Automatic",
    engine: { type: "Naturally Aspirated", cc: 1498, torque: "145 Nm" },
    features: ["Auto AC", "Multi-angle Rearview Camera", "Keyless Entry"],
    sunroof: false,
    airbags: 4,
    price: 1200000,
    owners: [
      { name: "Priya", purchase_date: "2021-06-10", location: "Chennai" }
    ],
    service_history: [
      { date: "2022-07-18", service_type: "Oil Change", cost: 4000 },
      { date: "2023-03-25", service_type: "Brake Replacement", cost: 10000 }
    ]
  },
  {
    maker: "Tata",
    model: "Nexon",
    fuel_type: "Petrol",
    transmission: "Automatic",
    engine: { type: "Turbocharged", cc: 1199, torque: "170 Nm" },
    features: ["Touchscreen", "Reverse Camera", "Bluetooth Connectivity"],
    sunroof: false,
    airbags: 2,
    price: 1100000,
    owners: [
      { name: "Rohit", purchase_date: "2020-09-05", location: "Kolkata" }
    ],
    service_history: [
      { date: "2022-10-05", service_type: "Oil Change", cost: 5500 },
      { date: "2023-04-12", service_type: "Tire Rotation", cost: 2500 }
    ]
  },
  {
    maker: "Hyundai",
    model: "Venue",
    fuel_type: "Petrol",
    transmission: "Automatic",
    engine: { type: "Turbocharged", cc: 998, torque: "172 Nm" },
    features: ["Sunroof", "Rear Camera", "Keyless Entry", "Cruise Control"],
    sunroof: true,
    airbags: 4,
    price: 1200000,
    owners: [
      { name: "Vikas", purchase_date: "2021-04-20", location: "Hyderabad" }
    ],
    service_history: [
      { date: "2022-06-15", service_type: "Oil Change", cost: 4500 },
      { date: "2023-05-10", service_type: "Tire Replacement", cost: 9000 }
    ]
  },
  {
    maker: "Tata",
    model: "Harrier",
    fuel_type: "Diesel",
    transmission: "Automatic",
    engine: { type: "Turbocharged", cc: 1956, torque: "350 Nm" },
    features: ["Leather Upholstery", "Panoramic Sunroof", "Auto-Dimming IRVM"],
    sunroof: true,
    airbags: 6,
    price: 2000000,
    owners: [
      { name: "Deepak", purchase_date: "2022-01-10", location: "Mumbai" }
    ],
    service_history: [
      { date: "2022-10-15", service_type: "Transmission Repair", cost: 45000 },
      { date: "2023-04-20", service_type: "Brake Replacement", cost: 15000 }
    ]
  },
  {
    maker: "Honda",
    model: "Amaze",
    fuel_type: "CNG",
    transmission: "Manual",
    engine: { type: "Naturally Aspirated", cc: 1199, torque: "110 Nm" },
    features: ["Keyless Entry", "Auto AC", "Rear Parking Camera"],
    sunroof: false,
    airbags: 4,
    price: 900000,
    owners: [
      { name: "Sanjay", purchase_date: "2021-03-18", location: "Pune" }
    ],
    service_history: [
      { date: "2021-09-10", service_type: "CNG Kit Checkup", cost: 2500 },
      { date: "2022-05-15", service_type: "Oil Change", cost: 3500 }
    ]
  },
  {
    maker: "Hyundai",
    model: "Kona Electric",
    fuel_type: "Electric",
    transmission: "Automatic",
    engine: { type: "Electric Motor", battery_capacity: "39.2 kWh", torque: "395 Nm" },
    features: ["Wireless Charging", "Ventilated Seats", "Sunroof", "Auto AC"],
    sunroof: true,
    airbags: 6,
    price: 2300000,
    owners: [
      { name: "Sneha", purchase_date: "2022-01-15", location: "Mumbai" }
    ],
    service_history: [
      { date: "2022-09-10", service_type: "Battery Check", cost: 0 },
      { date: "2023-06-05", service_type: "Brake Replacement", cost: 8000 }
    ]
  },
  {
    maker: "Maruti Suzuki",
    model: "WagonR",
    fuel_type: "CNG",
    transmission: "Manual",
    engine: { type: "Naturally Aspirated", cc: 998, torque: "90 Nm" },
    features: ["Manual AC", "ABS", "Power Windows"],
    sunroof: false,
    airbags: 2,
    price: 650000,
    owners: [
      { name: "Rahul", purchase_date: "2019-07-22", location: "Delhi" }
    ],
    service_history: [
      { date: "2020-11-10", service_type: "CNG Kit Checkup", cost: 2000 },
      { date: "2021-08-15", service_type: "Tire Rotation", cost: 1500 }
    ]
  }
]

  
)
res.json(CarDetails)
  } catch (error) {
    console.error(`something went wrong ${error}`)
  }
})
app.get("/print-all-the-car-brand",async(req,res)=>{
  try {
    const print=await CarDetails.aggregate(
      [
        {$group:{_id:"$maker"}}
      ]
    )
    res.json(print)
  } catch (error) {
    console.error(`something went wrong ${error}`)
  }
})
app.get("/print-all-the-car-fuel-types", async (req, res) => {
  try {
    const car_fuel_types = await CarDetails.aggregate([
      {
        $group: {
          _id: "$fuel_type",           // ✅ group by the actual field
          total_price: { $sum: "$price" } // ✅ sum of prices for each fuel type
        }
      }
    ]);

    res.json({
      message: "✅ Total car price by fuel type",
      result: car_fuel_types
    });
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/total-cars", async (req, res) => {
  try {
    const print = await CarDetails.aggregate([
      {
        $group: {
          _id: "$maker",           // ✅ group by maker
          total_cars: { $sum: 1 }  // ✅ count total cars for each maker
        }
      }
    ]);

    res.json({
      message: "✅ Total cars per maker",
      result: print
    });
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/group-model", async (req, res) => {
  try {
    const print = await CarDetails.aggregate([
      // 1️⃣ Filter cars first
      {
        $match: {
          transmission: "Manual",
          "service_history.service_type": "Oil Change"
        }
      },
      // 2️⃣ Group the filtered cars by model
      {
        $group: {
          _id: "$model",       // group by model
          total_cars: { $sum: 1 },  // count number of cars per model
          avg_cc: { $avg: "$engine.cc" } // optional: avg engine size per model
        }
      }
    ]);

    res.status(200).json({
      message: "✅ Grouped cars by model with manual transmission and oil change service",
      result: print
    });
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/avg", async (req, res) => {
  try {
    const price = await CarDetails.aggregate([
      {
        $group: {
          _id: "$maker",           // group by car maker
          avg_price: { $avg: "$price" } // ✅ take average of the "price" field
        }
      }
    ]);

    res.status(200).json({
      message: "✅ Average car price per maker",
      result: price
    });
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/match-cc", async (req, res) => {
  try {
    const user = await CarDetails.aggregate([
      {
        $match: {
          maker: "Hyundai",
          "engine.cc": { $gt: 1200 } // ✅ Nested field condition
        }
      }
    ]);

    res.json(user);
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/search",async(req,res)=>{
  try {
    const user=await CarDetails.aggregate(
      [
        {$match:
          {maker:"Maruti Suzuki",fuel_type:"Petrol"}
        },
        {$count:"total_cars"}
      ]
    )
    res.json(user)
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
})

app.get("/pratice", async (req, res) => {
  try {
    const user = await CarDetails.aggregate([
      // 1️⃣ Filter Hyundai cars
      { $match: { maker: "Hyundai" } },

      // 2️⃣ Group them by fuel_type
      {
        $group: {
          _id: "$fuel_type",      // group key
          total_cars: { $sum: 1 } // count number of cars in each group
        }
      }
    ]);

    res.json({
      message: "✅ Total Hyundai cars by fuel type",
      result: user
    });
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/specefic-information", async (req, res) => {
  try {
    const pratice = await CarDetails.aggregate([
      // 1️⃣ Filter Hyundai cars
      { 
        $match: { maker: "Hyundai" } 
      },
      // 2️⃣ Project only selected fields
      { 
        $project: { 
          model: 1, 
          "engine.type": 1, 
          "engine.torque": 1, 
          price: 1, 
          "owners.name": 1, 
          _id: 0 
        } 
      }
    ]);

    res.json(pratice);
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/specefic-information-sort", async (req, res) => {
  try {
    const pratice = await CarDetails.aggregate([
      // 1️⃣ Filter only Hyundai cars
      { 
        $match: { maker: "Hyundai" } 
      },
      // 2️⃣ Select specific fields
      { 
        $project: { 
          model: 1, 
          "engine.type": 1, 
          "engine.torque": 1, 
          price: 1, 
          "owners.name": 1, 
          _id: 0 
        } 
      },
      // 3️⃣ Sort results by model name
      { 
        $sort: { model: 1 }  // ✅ ascending (A → Z)
      }
    ]);

    res.json({
      message: "✅ Hyundai cars sorted by model name",
      result: pratice
    });
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/unwind", async (req, res) => {
  try {
    const user = await CarDetails.aggregate([
      { $unwind: "$owners" }  // ✅ Deconstruct the 'owners' array
    ]);
    res.json(user);
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/string-operator", async (req, res) => {
  try {
    const user = await CarDetails.aggregate([
      // 1️⃣ Group cars by maker
      { 
        $group: { 
          _id: "$maker", 
          model: { $first: "$model" } //pick first model from each brand
        } 
      },
      // 2️⃣ Create concatenated string of maker + model
      { 
        $project: { 
          _id: 0, 
          CarName: { $concat: ["$_id", " ", "$model"] } 
        } 
      }
    ]);

    res.json(user);
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(4000, () => {
  console.log("✅ Server running on port 4000");
});
