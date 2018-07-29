const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bugSchema = new Schema({
    user:String,
    name:String,
    desc:String
});

var Bug = mongoose.model("bug", bugSchema);
module.exports = Bug;