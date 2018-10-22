const moment = require('moment');
const Settings = require("../models/settings");
const lib = {};

//middleware for authCheck
lib.auth = (req, res, next)=>{
    if(req.user){
        next();
    }else{
        req.flash('error', 'Your not Logged in');
        res.redirect('/login');
    }
}

lib.admin = (req, res, next)=>{
    if(req.user.isAdmin == true){
        req.flash('success', 'You have Admin Access, Be careful! ');
        next();
    }else{
        req.flash('error', 'Sorry, You are not admin.');
        res.redirect('/');
    }
}

let firstDate;
let secondDate;
let d = moment();
let date = 8;
let dMon;

if(d.date()<date){
    d.subtract(1, 'months');
    firstDate =d.format('YYYY, MM, '+ date);
    dMon= d.format('MMMM, YYYY');
    d.add(1, 'months');
    secondDate =d.format('YYYY, MM, '+ date);
}else{
    firstDate =d.format('YYYY, MM, '+ date);
    dMon= d.format('MMMM, YYYY');
    d.add(1, 'months');
    secondDate =d.format('YYYY, MM, '+ date);
}
lib.dMonth = dMon;
lib.date = date;
lib.firstDate = firstDate;
lib.secondDate = secondDate;
// let pattern = {$gte:new Date("07-07-2018"), $lte: new Date("08-08-2018")};
lib.pattern =  {$gte:new Date(firstDate), $lte: new Date(secondDate)};
    console.log(lib.dMonth + ' ' + lib.date);


module.exports = lib;