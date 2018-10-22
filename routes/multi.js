const express = require("express"),
      library = require("../library/lib"),
      Settings = require("../models/settings"),
      router  = express.Router({mergeParams: true});

router.get('/analysis', library.auth, (req, res)=>{
    res.render('analysis');
});

router.get('/settings', library.auth, (req, res)=>{
    res.render('settings');
});

router.get('/Prabhupada', (req, res)=>{
    res.render('sp');
});
router.get('/info', (req, res)=>{
    res.render('info');
});
module.exports = router;