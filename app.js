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
     twilio = require('twilio'),

     //schema
     User = require("./models/user"),
     Meal = require("./models/meal"),
     Devotee = require("./models/devotee"),
     Deposit = require("./models/deposit"),
     Cost = require("./models/cost"),
     Bug = require("./models/bug"),

    //  Requiring routers
     authRoutes = require('./routes/auth'),
     costRoutes = require('./routes/costs'),
     devoteeRoutes = require('./routes/devotee'),
     bugRoutes = require('./routes/bug'),
     multiRoutes = require('./routes/multi'),

     //  function Library
     library = require('./library/lib'),
     app = express();
     require('dotenv/config');

const mongodbUri = process.env.MONGODB_URI;
const twilioAcSid = process.env.TWILIO_ACC_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;


mongoose.Promise = global.Promise;
mongoose.connect(mongodbUri, {useNewUrlParser: true}, ()=>{
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
app.use(bodyParser.json());
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

app.use(function(req, res, next){
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    res.locals.user = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
 });


//restful routing
app.get("/", (req, res)=>{
    res.render("index", {user: req.user}); 
});

app.use(authRoutes);
app.use('/cost', costRoutes);
app.use('/devotee', devoteeRoutes);
app.use('/bug', bugRoutes);
app.use(multiRoutes);

app.post("/deposit/:id", library.admin, (req, res)=>{
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

app.get("/meal", library.auth, (req, res)=>{
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

app.post("/meal", library.admin, (req, res)=>{
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

app.get("/admin", library.auth, (req, res)=>{
    Devotee.find({})
        .populate({path: 'meals', match: { date: library.pattern}, select: 'num -_id'})
        .populate({path:"deposits", match: { date: library.pattern}, select:'amount -_id'})
        .populate({path:'costs', match: { date: library.pattern}, select:'date market -_id'})
        .exec(function(err, devotee){
            if(err){ console.log(err);
        } else {
            Cost.find({date:library.pattern}, (err, cost)=>{
                if(err){
                    console.log(err);
                }else{
                    res.render("admin", {user:req.user, devotee:devotee, month:library.dMonth, cost:cost });
                }  
            });               
        }
    });
});

app.get('/report', library.auth, (req, res)=>{
    let num = 2;
    let firD = moment(new Date(library.firstDate));
    firD = firD.subtract(num, 'months');
    let reportMonth = firD.format('MMMM-YY');
    firD = firD.format('YYYY, MM, '+ library.date);
    let seDate = moment(new Date(library.secondDate));
    seDate = seDate.subtract(num, 'months');
    seDate = seDate.format('YYYY, MM, '+ library.date);

    let newPattern = {$gte:new Date(firD), $lte: new Date(seDate)};
    // console.log(firD);
    // console.log(typeof(library.firstDate));

    // if(req.query.dat1 ==null && req.query.dat2 == null){
    //     let newPattern =  {$gte:new Date(firstDate), $lte: new Date(secondDate)};
    // }
    Devotee.find({})
        .populate({path: 'meals', match: { date: newPattern}, select: 'num -_id'})
        .populate({path:"deposits", match: { date: newPattern}, select:'amount -_id'})
        .populate({path:'costs', match: { date: newPattern}, select:'date market -_id'})
        .exec(function(err, devotee){
            if(err){ console.log(err);
        } else {
            Cost.find({date:newPattern}, (err, cost)=>{
                if(err){
                    console.log(err);
                }else{
                    res.render("report", {user:req.user, devotee:devotee, month:reportMonth, cost:cost });
                }  
            });               
        }
    });
});


app.get('/twilio', (req, res)=>{
    let mess = req.query.sms;
    var client = new twilio(twilioAcSid, authToken);
    
    client.notify.services(notifyServiceId)
    .notifications.create({
        toBinding: JSON.stringify({
            binding_type:'sms', address:'+8801924565272',
            // binding_type:'sms', address:'+8801924565272',
            // binding_type:'sms', address:'+8801924565272'
        }),
        body: `Account of ${library.dMonth}. Meal Charge: 30tk, and you have to pay 500tk more. Hare Krishna.`
    })
    .then(notification => console.log(notification.sid))
    .catch(error => console.log(error));
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