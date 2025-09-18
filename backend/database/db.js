import mongoose from "mongoose";

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
    }
    catch(error){
             console.log("MongoDB connection eroor ",error )
    }
}
export default connectDB;