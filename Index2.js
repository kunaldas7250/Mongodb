const express=require("express")
const mongoose = require("./database/db/db"); // ✅ same mongoose instance
const User = require("./database/schema/Schema"); // ✅ same connected model
const Car=require("./database/schema/opertorSchema")
const CarDetails=require("./database/schema/AggreateSchema");
const app=express()
 app.use(express.json())
 app.use(express.urlencoded({extended:false}))

 app.get("/string-operator2", async (req, res) => {
  try {
    const user = await CarDetails.aggregate([
      {
        $project: {
          _id: 0,
          CarName: { $toUpper: { $concat: ["$maker", " ", "$model"] } },
        },
      },
    ]);

    res.json(user);
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/string-operator3", async (req, res) => {
  try {
    const user = await CarDetails.aggregate([
      {
        $project: {
          _id: 0,
          CarName: { $toLower: { $concat: ["$maker", " ", "$model"] } },
        },
      },
    ]);

    res.json(user);
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/regex-match", async (req, res) => {
  try {
    const user = await CarDetails.aggregate([
      {
        $project: {
          _id: 0,
          maker: 1,
          model: 1,
          is_diesel: {
            $regexMatch: {
              input: "$fuel_type",   // the field to test
              regex: "Die",          // pattern to search for
              options: "i"           // optional (i = case-insensitive)
            }
          }
        }
      }
    ]);

    res.json(user);
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/out-operator", async (req, res) => {
  try {
    const user = await CarDetails.aggregate([
      // 1️⃣ Filter only Hyundai cars
      { 
        $match: { maker: "Hyundai" } 
      },
      // 2️⃣ Project model and uppercase car name
      { 
        $project: {
          _id: 0,
          model: 1,
          CarName: { $toUpper: { $concat: ["$maker", " ", "$model"] } }
        }
      },
      // 3️⃣ Write results to a new collection
      { 
        $out: "Hyundai_model"  // ✅ creates/overwrites a new collection
      }
    ]);

    res.send("✅ Hyundai_model collection created successfully!");
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/arthimetic-opertor",async(req,res)=>{
    try {
        const user=await CarDetails.aggregate(
            [
                {$project:{
                    _id:0,
                    Sum:{
                        $add:[10,20,90,40,80,60]
                    }
                }}
            ]
        )
        res.json(user)
    } catch (error) {
         console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
    }
})
app.get("/arthimetic-opertor2", async (req, res) => {
  try {
    const user = await CarDetails.aggregate([
      {
        $project: {
          _id: 0,
          maker: 1,
          model: 1,
          total_value: { $add: ["$price", "$airbags"] } // ✅ sum of fields
        }
      }
    ]);

    res.json(user);
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/test", async (req, res) => {
  try {
    const user = await CarDetails.aggregate([
      {
        $group: {
          _id: "$maker",
          total_price: { $sum: "$price" },
          count_cars: { $sum: 1 }
        }
      },
      {
        $addFields: {
          total_price_Gst_include: { $add: ["$total_price", 1000] }
        }
      },
      {
        $project: {
          _id: 0,
          maker: "$_id",
          total_price: 1,
          count_cars: 1,
          total_price_Gst_include: 1,

          // ✅ Formula: (total_price_Gst_include / 100) * count_cars
          Percentage_of_all: {
            $multiply: [
              { $divide: ["$total_price_Gst_include", 100] },
              "$count_cars"
            ]
          }
        }
      }
    ]);

    res.json(user);
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/total-service-cost", async (req, res) => {
  try {
    const user = await CarDetails.aggregate([
      // ✅ Unwind the service history array
      { $unwind: "$service_history" },

      // ✅ Group by maker and accumulate sums
      {
        $group: {
          _id: "$maker",
          total_Service_cost: { $sum: "$service_history.cost" },
          Avg_Service_cost: { $avg: "$service_history.cost" }
        }
      },

      // ✅ Project clean output
      {
        $project: {
          _id: 0,
          maker: "$_id",
          total_Service_cost: 1,
          Avg_Service_cost: 1
        }
      }
    ]);

    res.json(user);
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/condition-statement", async (req, res) => {
  try {
    const user = await CarDetails.aggregate([
      {
        $project: {
          _id: 0,
          maker: 1,
          model: 1,
          fuel_type: 1,
          CarType: {
            $cond: {
              if: { $eq: ["$fuel_type", "Petrol"] },
              then: "🚗 Petrol Car",
              else: "🚙 Diesel Car"
            }
          }
        }
      }
    ]);

    res.json(user);
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/divide-the-price-category", async (req, res) => {
  try {
    const user = await CarDetails.aggregate([
      // Step 1️⃣: Just project the needed fields with price logic
      {
        $project: {
          _id: 0,
          maker: 1,
          model: 1,
          price: 1,
          Price_Category: {
            $switch: {
              branches: [
                {
                  case: { $gte: ["$price", 500000] },
                  then: "💎 High Budget"
                },
                {
                  case: {
                    $and: [
                      { $gte: ["$price", 200000] },
                      { $lt: ["$price", 500000] }
                    ]
                  },
                  then: "💰 Mid Budget"
                },
                {
                  case: { $lt: ["$price", 200000] },
                  then: "💵 Low Budget"
                }
              ],
              default: "Unknown"
            }
          }
        }
      },
    ]);

    res.json(user);
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/date-opertor", async (req, res) => {
  try {
    const user = await CarDetails.aggregate([
      {
        $project: {
          _id: 0,
          model: 1,
          maker: 1,
          NewDate: {
            $dateAdd: {
              startDate: new Date("2025-11-11"), // ✅ correct key
              unit: "day",
              amount: 7 // adds 7 days
            }
          }
        }
      }
    ]);

    res.json(user);
  } catch (error) {
    console.error(`❌ Something went wrong: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});

 app.listen(4000,()=>{
    console.log("your port is running :4000")
 })