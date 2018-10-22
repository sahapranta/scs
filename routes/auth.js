const passport = require("passport"),
LocalStrategy = require("passport-local").Strategy,
passportLocalMongoose = require("passport-local-mongoose"),
User = require("../models/user"),
library = require("../library/lib"),
express =require('express'),
router  = express.Router({mergeParams: true});

//Auth Routes .........
router.get("/register", (req, res)=>{
    res.render("auth/register", {user: req.user});
});

router.post("/register", (req, res)=>{
   var username = req.body.username;
   var password = req.body.password;
   var isAdmin  = req.body.isAdmin;
   var isAdmin = JSON.parse(isAdmin.toLowerCase());
 
   User.register(new User({username:username, isAdmin:isAdmin}), password, (err, user)=>{
       if(err){
           req.flash('error', 'Something Went Wrong, Please Try Again.');
           console.log("err");
           res.redirect("/register");
       }
       passport.authenticate("local")(req, res, function(){
          req.flash('success', 'Registration Successful');
          res.redirect("/admin"); 
          console.log(user);
       });
   });
});


router.get("/login", (req, res)=>{
    res.render("auth/login" , {user: req.user}); 
 });

//login logic (middleware)
router.post("/login", passport.authenticate("local", {
    // successRedirect: "/admin",
        failureRedirect: "/login",
        failureFlash: true
    }), (req, res)=>{
            req.flash('success', 'You have successfully logged in');
            res.redirect('/admin');
            console.log('login');
});


router.get('/logout', (req, res)=>{
    req.logout();
    req.flash("error", "Logged you out!");
    res.redirect('/');
});
//authChecked Routing
router.get("/user", library.auth, (req, res)=>{
    User.find({}, (err, allUser)=>{
        if(err){
            console.log('error in finding user' + err);
        }else{
            res.render("user", {user: req.user, users:allUser}); 
        }
    });
});
router.delete("/user/delete/:id", library.admin, (req, res)=>{
    User.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            req.flash("error", "Something Went Wrong, Please try again");
            res.redirect("back");
        } else {
            req.flash("success", "Successfully Deleted");
            res.redirect("back");
        }
    });
});

router.put("/user/admin/:id", library.admin, (req, res)=>{
    User.findById(req.params.id, (err, user)=>{
        if(err){
            req.flash("error", "Something Went Wrong. Please Try Again!");
            res.redirect("back");
        } else {
            if(user.isAdmin === true){
                user.isAdmin=false;
            }else{
                user.isAdmin =true;
            }
            user.save();
            res.redirect("back");
        }
    });
});

router.post("/user/edit/:id", library.auth, (req, res)=>{
    User.findById(req.params.id, (err, user)=>{
        if(req.body.eUsername){
            user.username = req.body.eUsername;
        }
        user.setPassword(req.body.ePassword, (err)=>{
            if(err){console.log(err);}
        });
        user.save();
        req.flash('New Password updated');
        res.redirect('back');
    });
});
module.exports = router;