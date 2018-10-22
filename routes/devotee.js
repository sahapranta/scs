const express = require("express"),
      Devotee = require("../models/devotee"),
      library = require("../library/lib"),
      router  = express.Router({mergeParams: true});


router.get("/", library.auth, (req, res)=>{
    Devotee.find({}, (err, devotee)=>{
        if(err){
            console.log(err);
            req.flash('error', "Sorry! Something Went Wrong!");
            res.redirect('back');
        }else{
            res.render("devotee/devotee", {user:req.user, devotee:devotee});
        }
    });
});

router.put("/edit/:id", library.admin, (req, res)=>{
    var newEdit = {name:req.body.editName, mobile:req.body.editMobile};
    Devotee.findByIdAndUpdate(req.params.id, newEdit, (err, update)=>{
        if(err){
            req.flash("error", "Something Went Wrong. Please Try Again!");
            res.redirect("back");
        } else {
            req.flash("success", `Successfully Updated ${update.name}.`);
            res.redirect("back");
        }
    });
});

router.delete("/delete/:id", (req, res)=>{
    Devotee.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            req.flash("error", "Something Went Wrong, Please try again");
            res.redirect("back");
        } else {
            req.flash("success", "Successfully Deleted");
            res.redirect("back");
        }
    })
})

router.get("/:id", library.auth, (req, res)=>{
    var id = req.params.id;
    Devotee.findById(id)
        .populate({path: 'meals', match: { date: library.pattern}, select: 'num date id'})
        .populate({path:'deposits', match: { date: library.pattern}, select:'amount date id'})
        .populate({path:'costs', match: { date: library.pattern}, select:'amount date id market'})
        .exec(function(err, devotee){
        if(err){
            console.log(err);
        } else {
            res.render("devotee/show", {user:req.user, devotee:devotee, month:library.dMonth});
        }
    });
});

router.post("/", library.admin, (req, res)=>{
    new Devotee({
        name: req.body.name,
        mobile: req.body.mobile
    }).save().then((newDevotee)=>{
            req.flash("success", `${req.body.name} is successfully added"`);
            res.redirect("/devotee");
       });
});

module.exports = router;