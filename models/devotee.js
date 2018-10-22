const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var devoteeSchema = new Schema({
	name:String,
	mobile:String,
	meals:[{type:Schema.Types.ObjectId, ref: 'Meal'}],
	deposits:[{type:Schema.Types.ObjectId, ref: 'Deposit'}],
	costs:[{type:Schema.Types.ObjectId, ref: 'Cost'}]
},
{ 
    usePushEach: true 
});

var Devotee = mongoose.model('Devotee', devoteeSchema);
module.exports = Devotee;