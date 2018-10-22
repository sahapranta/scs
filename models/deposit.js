const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var depositSchema = new Schema({
	person:{type:Schema.Types.ObjectId, ref:'Devotee'},
	amount:Number,
	date:{type: Date, default: Date.now}
});

var Deposit = mongoose.model("Deposit", depositSchema);
module.exports = Deposit;

