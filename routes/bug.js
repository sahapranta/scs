const express = require("express"),
      Bug    = require("../models/bug"),
      library = require("../library/lib"),
      router  = express.Router({mergeParams: true});

router.get('/', library.auth, (req, res)=>{
    Bug.find({}).exec( (err, bugs)=>{
        res.render('bug', {user:req.user, bug:bugs});
    });
});

router.post("/", library.auth, (req, res)=>{
    new Bug({
        user:req.user.username,
        name:req.body.name,
        desc:req.body.desc
    }).save().then((newBug)=>{
        req.flash('success', "Your bug has been recorded, Thanks");
        res.redirect('back');
    });
});

router.delete('/delete/:id', library.admin, (req, res)=>{
    Bug.findByIdAndRemove(req.params.id, (err)=>{
        if(err){console.log(err);}
        req.flash('Bug Deleted');
        res.redirect('back');
    });
});

module.exports = router;