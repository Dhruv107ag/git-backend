import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
const VideoSchema = new Schema({
videoFile:{type:String,required:true},
thumbnail:{type:String,required:true},
title:{type:String,required:true,trim:true,index:true},
description:{type:String,required:false,trim:true},
duration:{type:Number,required:true},
views:{type:Number,default:0},
isPublised:{type:Boolean,default:true},
owner:{type:Schema.Types.ObjectId,ref:'User',required:true},



},{timestamps:true});
VideoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model('Video',VideoSchema);