const express = require("express"),
      Cost    = require("../models/cost"),
      router  = express.Router({mergeParams: true});


 //middleware for authCheck
const authCheck = (req, res, next)=>{
    if(req.user){
        next();
    }else{
        res.redirect('/login');
    }
}

router.get('/', authCheck, (req, res)=>{
    res.render('cost', {user: req.user});
});

router.post('/', authCheck, (req, res)=>{
    new Cost({
        persons:req.body.persons,
        date:req.body.date,
        amount:req.body.amount,
        market:req.body.market,
        costType:req.body.costType
    }).save().then((newCost)=>{
        console.log('New user registered' + newCost);
        done(null, newCost);
    });
});

module.exports = router;
