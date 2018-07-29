const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var settingsSchema = new Schema({
    startDate:Number,
    guestExtra:Number
});

var Settings = mongoose.model("settings", settingsSchema);
module.exports = Settings;