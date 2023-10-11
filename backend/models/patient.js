const mongoose = require('mongoose')

const Schema = mongoose.Schema

const patient = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    emergencyContact:{ 
        name: {type:String, required: true},
        phone: {type:Number, required: true}, 
        relation: {type:String, required: true}
    }, 
    medicalHistory: [{
        name: {type:String, required:true},
        medicalRecord: {type:String, required:true} 
    }],
    family : [{
        name: {type:String, required: true},
        nationalID: {type:Number, required: true},
        phone: {type:Number, required: true},
        relation: {type:String,enum:['wife','husband','child'], required: true} 
    }],
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Package',
    },
    purchaseDate: {type: Date}

}, { timestamps: true })

module.exports = mongoose.model('Patient', patient)