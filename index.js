const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const SettingsBill = require('./settings-bill');

const moment = require('moment');
moment().format()
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
        color: settingsBill.classnames(),
        //stopCount: settingsBill.stopTheCount()
    });
});

app.post('/settings', function(req, res){//set the settings
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
    let theActions = settingsBill.actions();
    theActions.forEach(element => {
        element.stampOfTime = moment(element.timestamp).fromNow()
    });
    res.render('actions', {actions: theActions});


});

app.get('/actions/:actionType', function(req, res){ //display all the sms or call actions
    let actionType = req.params.actionType;
    let theActionType = settingsBill.actionsFor(actionType);
    theActionType.forEach(element => {
        element.stampOfTime = moment(element.timestamp).fromNow()
    });
   res.render('actions', {actions: theActionType});

});

const PORT = process.env.PORT || 3011; // made port number configurable using an env variable

app.listen(PORT, function(){
    console.log("App started at port", PORT)
});
