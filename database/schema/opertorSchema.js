const mongoose=require("../db/db")
const engineSchema=new mongoose.Schema({
type:{
    type:String,
    required:true,
    trim:true
},
cc:{
    type:Number,
    required:true
},
torque:{
    type:String,
    required:true
}
})
const carschema=new mongoose.Schema({
    maker:{
        type:String,
        required:true,
        trim:true
    },
    model:{
        type:String,
        required:true,
        trim:true
    },
    fuel_type:{
        type:String,
        required:true,
        enum:["Petrol", "Diesel", "CNG", "Electric"]
    },
    transmission: {
  type: String,
  required: true,
  enum: ["Manual", "Automatic"]
},

    engine:{
        type:engineSchema,
        required:true
    },
    features: {
  type: [String],
  default: []
},

    sunroof:{
        type:Boolean,
        default:false,

    },
    airbags:{
        type:Number,
        required:true,
        min:1
    }
})
module.exports=mongoose.model("Car",carschema)
