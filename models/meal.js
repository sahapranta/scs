const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mealSchema = new Schema({
	person:{type: Schema.Types.ObjectId, ref:'Devotee'},
	num:Number,
	date:{type: Date, default: Date.now}
});

var Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;