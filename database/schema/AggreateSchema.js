const mongoose=require("../db/db")
const EngineSchema=new mongoose.Schema({
    type:{
        type:String,
        required:true,
        trim:true
    },
    cc:{
        type:Number
    },
    torque:{
        type:String
    },
    battery_capacity:{
        type:String
    }
})
const Owner_Schema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    purchase_date:{
        type:Date,
        required:true
    },
    location:{
        type:String,
        required:true,
        trim:true
    }
})
const ServiceSchema=new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    service_type:{
        type:String,
        required:true,
        trim:true
    },
    cost:{
        type:Number,
        required:true,
        min:0
    }
})
const CARSCHEMA=new mongoose.Schema({
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
    fuel_type: {
    type: String,
    required: true,
    enum: ["Petrol", "Diesel", "CNG", "Electric"]
  },
   transmission: {
    type: String,
    required: true,
    enum: ["Manual", "Automatic"]
  },
  engine:{
    type:EngineSchema,
    required:true
  },
  features:{
    type:[String],
    default:[],
    
  },
  sunroof:{
    type:Boolean,
    default:false,
  },
  airbags:{
    type:Number,
    required:true,
    min:1
  },
  price:{
    type:Number,
    required:true,
    min:0
  },
  owners:{
    type:[Owner_Schema],
    default:[]
  },
  service_history:{
    type:[ServiceSchema],
    default:[]
  }
})
module.exports=mongoose.model("CarDetails",CARSCHEMA)