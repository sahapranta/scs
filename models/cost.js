const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var costSchema = new Schema({
    persons:[{type:Schema.Types.ObjectId, ref: 'Devotee'}],
    amount:Number,
    date:{type:Date, default:Date.now},
    market:String,
    costType:String
},{ 
    usePushEach: true 
});

var Cost = mongoose.model("Cost", costSchema);
module.exports = Cost;