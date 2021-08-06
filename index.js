const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const moment = require('moment');
const SettingsBill = require('./settings-bill');

const app = express();
const settingsBill = SettingsBill();

app.engine('handlebars', exphbs({defaultLayout: ''})); //configure express handlebars
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res){ //show homescreen
    res.render('index', {
        settings: settingsBill.getSettings(),
        totals: settingsBill.totals(),
        color: settingsBill.classnames()
    });
    console.log(settingsBill.classnames());
});

app.post('/settings', function(req, res){//set the settings
    console.log(req.body);

    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    });

    res.redirect('/');
})

app.post('/action', function(req, res){ //record action for sms or call
   
   //capture the call type to add
    settingsBill.recordAction(req.body.actionType);

    res.redirect('/');
});

app.get('/actions', function(req, res){ //show all the actions
    res.render('actions', {actions: settingsBill.actions()});

});

app.get('/actions/:actionType', function(req, res){ //display all the sms or call actions
    const actionType = req.params.actionType;
    let time = moment.format('MM-DD-YYYY');
   res.render('actions', {actions: settingsBill.actionsFor(actionType)});

});

const PORT = process.env.PORT || 3011; // made port number configurable using an env variable

app.listen(PORT, function(){
    console.log("App started at port", PORT)
});