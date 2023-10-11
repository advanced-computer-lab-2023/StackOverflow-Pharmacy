const mongoose = require('mongoose')

const Schema = mongoose.Schema

const doctor = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    doctorID: { type : Number, required: true},
    hourRate :{type:Number, required:true},
    affiliation :{type:String, required:true},
    educationBackground :{type:String, required:true},
    speciality :{type:String, required:true},
    requestID : {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Request'
    },
    
}, { timestamps: true })

module.exports = mongoose.model('Doctor', doctor)