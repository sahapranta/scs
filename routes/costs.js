const express = require("express"),
      Cost    = require("../models/cost"),
      Devotee = require("../models/devotee"),
      router  = express.Router({mergeParams: true}),
      library = require('../library/lib');  

router.post('/', library.admin, (req, res)=>{
        let ids=[req.body.id1, req.body.id2];
        let data= {
            date:req.body.date,
            amount:req.body.amount,
            market:req.body.market,
            costType:req.body.costType,
            persons:ids
        };
        var newCost = new Cost(data);
        newCost.save();
        Devotee.find({_id:{$in:ids}}, (err, dev)=>{
            if(err){console.log(err)}
            for(i in dev){
                dev[i].costs.push(newCost);
                dev[i].save();
            }
            console.log(dev[1].costs);
            req.flash("success", "Amount is successfully added");
            res.redirect('/monthlyCost');
        });
});


router.get('/', library.auth, (req, res)=>{ 
    Cost.find({date:library.pattern}, function(err, docs){
        if(docs){
            Devotee.find({}, (err, dev)=>{
                res.render('monthly', {doc:docs, devotee:dev, month:library.dMonth});
            });
        }else{
            console.log(err);
            res.redirect('back');
        }
        
    });
    
});

module.exports = router;
