import mongoose from "mongoose";
import { Blog } from "./blogModel.js";
import { user } from "./userModel.js";

const commentSchema = new mongoose.Schema({

    content:{type:String , required:true},
    postId:{type:mongoose.Schema.Types.ObjectId , ref:'Blog'},
    userId:{type:mongoose.Schema.Types.ObjectId , ref:'User'},
    likes:{type:Array , default:[]},
    nunmberOfLikes:{type:Number , default:0}

},{timestamps:true})

export const comment= mongoose.model("comment", commentSchema)