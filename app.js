const express = require("express"),
     bodyParser = require("body-parser"),
     flash = require("connect-flash"),
     session = require('express-session');
     cookieSesion = require('cookie-session'),
     path = require('path'),
     methodOverride = require('method-override');
     mongoose = require("mongoose"),
     passport = require("passport"),
     LocalStrategy = require("passport-local").Strategy,
     passportLocalMongoose = require("passport-local-mongoose"),
     expressSanitizer = require("express-sanitizer"),
     moment = require("moment"), //moment@2.21.0
     //schema
     User = require("./models/user"),
     Meal = require("./models/meal"),
     Devotee = require("./models/devotee"),
     Deposit = require("./models/deposit"),
     Cost = require("./models/cost"),
     Bug = require("./models/bug"),
     Settings = require("./models/settings"),
     
     app = express();
     var Schema = mongoose.Schema;
     var ObjectId = Schema.ObjectId;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://pranta:scsoss@ds241658.mlab.com:41658/scsoss', ()=>{
    console.log('connected to mongodb via mLab');
});
//npm install mongoose@4.7.2 (latest version not work properly)!
app.use(cookieSesion({
    maxAge:24*60*60*1000,
    keys:['asimkumarroyinchaitnayasangha']
}));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
// app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

app.use(session({
 secret:"asimkumar",
 key: 'sid',
 cookie: { 
     maxAge: 60000
     },
 saveUninitialized:false,
 resave:false
}));

app.use(function(req, res, next){
    res.append('Access-Control-Allow-Origin', ['*']);
    // res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.locals.user = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
 });


 //Passport Configuration
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null, user);
    });
});


//middleware for authCheck
const authCheck = (req, res, next)=>{
    if(req.user){
        next();
    }else{
        req.flash('error', 'Your not Logged in');
        res.redirect('/login');
    }
}

const adminPass = (req, res, next)=>{
    if(req.user.isAdmin == true){
        req.flash('success', 'You have Admin Access, Be careful! ');
        next();
    }else{
        req.flash('error', 'Sorry, You are not admin.');
        res.redirect('/');
    }
}

///restful routing
app.get("/", (req, res)=>{
    res.render("index", {user: req.user}); 
});

//Auth Routes .........
app.get("/register", (req, res)=>{
    res.render("auth/register", {user: req.user});
});

app.post("/register", (req, res)=>{
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


app.get("/login", (req, res)=>{
    res.render("auth/login" , {user: req.user}); 
 });

//login logic (middleware)
app.post("/login", passport.authenticate("local", {
    // successRedirect: "/admin",
        failureRedirect: "/login",
        failureFlash: true
    }), (req, res)=>{
            req.flash('success', 'You have successfully logged in');
            res.redirect('/admin');
            console.log('login');
});


app.get('/logout', (req, res)=>{
    req.logout();
    req.flash("error", "Logged you out!");
    res.redirect('/');
});

//authChecked Routing
app.get("/user", authCheck, (req, res)=>{
    User.find({}, (err, allUser)=>{
        if(err){
            console.log('error in finding user' + err);
        }else{
            res.render("user", {user: req.user, users:allUser}); 
        }
    });
});
app.delete("/user/delete/:id", adminPass, (req, res)=>{
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

app.put("/user/admin/:id", adminPass, (req, res)=>{
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

app.post("/user/edit/:id", authCheck, (req, res)=>{
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

var d = moment();
var date = 8;
var firstDate, secondDate, dMonth;
if(d.date()<date){
    d.subtract(1, 'months');
    firstDate =d.format('YYYY, MM, '+ date);
    dMonth= d.format('MMMM, YYYY');
    d.add(1, 'months');
    secondDate =d.format('YYYY, MM, '+ date);
}else{
    firstDate =d.format('YYYY, MM, '+ date);
    dMonth= d.format('MMMM, YYYY');
    d.add(1, 'months');
    secondDate =d.format('YYYY, MM, '+ date);
}


let pattern = {$gte:new Date(firstDate), $lte: new Date(secondDate)};

app.post('/cost', adminPass, (req, res)=>{
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


app.get('/monthlyCost', authCheck, (req, res)=>{ 
    Cost.find({date:pattern}, function(err, docs){
        if(docs){
            Devotee.find({}, (err, dev)=>{
                res.render('monthly', {user: req.user, doc:docs, devotee:dev, month:dMonth});
            });
        }else{
            console.log(err);
            res.redirect('back');
        }
        
    });
    
});

app.get("/devotee", authCheck, (req, res)=>{
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

app.put("/devotee/edit/:id", adminPass, (req, res)=>{
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

app.delete("/devotee/delete/:id", (req, res)=>{
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

app.get("/devotee/:id", authCheck, (req, res)=>{
    var id = req.params.id;
    Devotee.findById(id)
        .populate({path: 'meals', match: { date: pattern}, select: 'num date id'})
        .populate({path:'deposits', match: { date: pattern}, select:'amount date id'})
        .populate({path:'costs', match: { date: pattern}, select:'amount date id market'})
        .exec(function(err, devotee){
        if(err){
            console.log(err);
        } else {
            res.render("devotee/show", {user:req.user, devotee:devotee, month:dMonth});
        }
    });
});

app.post("/addDevotee", adminPass, (req, res)=>{
    new Devotee({
        name: req.body.name,
        mobile: req.body.mobile
    }).save().then((newDevotee)=>{
            req.flash("success", `${req.body.name} is successfully added"`);
            res.redirect("/devotee");
       });
});

app.post("/deposit/:id", adminPass, (req, res)=>{
    Devotee.findById(req.params.id, (err, devotee)=>{
        var newDeposit = {amount:req.body.depositAmount, date:req.body.depositDate};
        if(err){
            console.log(err);
            req.flash('error', "Something Went Wrong, Try Again.");
            res.redirect('back');
        }else{
            Deposit.create(newDeposit, (err, deposit)=>{
                deposit.person=devotee._id;
                deposit.save();
                devotee.deposits.push(deposit);
                devotee.save();
                req.flash('success', `Successfully added new Deposit against ${devotee.name}`);
                res.redirect('back');
            });
        }
    });
});

app.get("/meal", authCheck, (req, res)=>{
    Devotee.find({}, (err, devotee)=>{
        if(err){
            console.log(err);
            req.flash('error', "Sorry! Something Went Wrong!");
            res.redirect('back');
        }else{
            res.render("meal", {user:req.user, devotee:devotee});
        }
    });
});

app.post("/meal", adminPass, (req, res)=>{
    Devotee.findById(req.body.id, (err, devotee)=>{
        var newMeal = {num:req.body.meal, date:req.body.date};
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            Meal.create(newMeal, (err, meal)=>{
                if(err){console.log(err);}
                meal.person=req.body.id;
                meal.save();
                devotee.meals.push(meal);
                devotee.save();
                req.flash('success', `Successfully added Meal of against ${devotee.name}`);
                res.redirect('back');
            })
        }
    });
});

app.get("/admin", authCheck, (req, res)=>{
    Devotee.find({})
        .populate({path: 'meals', match: { date: pattern}, select: 'num -_id'})
        .populate({path:"deposits", match: { date: pattern}, select:'amount -_id'})
        .populate({path:'costs', match: { date: pattern}, select:'amount date market -_id'})
        .exec(function(err, devotee){
        if(err){ console.log(err);
        } else {
            var o = {};
            o.map = function() {
                emit(0, this.amount);
            };
            o.reduce = function(id, amount) {
                return Array.sum(amount);
            };
            o.query = { date : pattern};
            o.verbose = true;

            Cost.mapReduce(o, (err, result, stats)=>{
                if(err){console.log(err);}
                res.render("admin", {user:req.user, devotee:devotee, costs:result, month:dMonth});
            });
        }
    });
});

app.get('/bugs', authCheck, (req, res)=>{
    Bug.find({}).exec( (err, bugs)=>{
        res.render('bug', {user:req.user, bug:bugs});
    });
});

app.post("/bug", authCheck, (req, res)=>{
    new Bug({
        user:req.user.username,
        name:req.body.name,
        desc:req.body.desc
    }).save().then((newBug)=>{
        req.flash('success', "Your bug has been recorded, Thanks");
        res.redirect('back');
    });
});

app.delete('/bug/delete/:id', adminPass, (req, res)=>{
    Bug.findByIdAndRemove(req.params.id, (err)=>{
        if(err){console.log(err);}
        req.flash('Bug Deleted');
        res.redirect('back');
    });
});

app.get("/nodata", (req, res)=>{
    res.render("nodata");
});

//error 404 setup
app.get("*", (req, res)=>{
    res.render("404", {user: req.user}); 
 });

//Server setup

app.listen(process.env.PORT || 3000, function(err){
    if(err){console.log(err);}
    console.log("My server has been started 3000");
});