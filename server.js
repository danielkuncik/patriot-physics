const express = require('express');
const hbs = require('express-hbs');
var unitMap = require(__dirname + '/content/units/unit_map');

var app = express();


app.set('view engine', 'hbs');
app.set('views', [__dirname + '/views',__dirname + '/content']);
app.engine('hbs', hbs.express4({
   // extname: 'hbs',
    defaultView: 'default.hbs',
    partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts'
}));
app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/content'));


hbs.registerHelper('listUnits', () => {
    var unitList = "<ul>";
    Object.values(unitMap).forEach((unitCluster) => {
        unitList = unitList + `<li>${unitCluster.name}`;
        unitList = unitList + "<ul>";
        Object.values(unitCluster.units).forEach((unit) => {
            unitList = unitList + `<li>${unit.name}`;
            unitList = unitList + "<ul>";
            Object.values(unit.pods).forEach((pod) => {
                unitList = unitList + `<li>${pod.name}</li>`
            });
            unitList = unitList + "</ul>";
            unitList = unitList + "</li>";
        });
        unitList = unitList + "</ul>";
        unitList = unitList + "</li>";
    });
    unitList = unitList + "</ul>";
    return new hbs.SafeString(unitList);
});


// ROUTES
app.get('/',(req,res) => {
    res.render('home.hbs', {
        layout:'default',
       // template:'home-template',
        title: 'Home Page'
    });
});
app.get('/about',(req,res) => {
    res.render('aboutEntryPage.hbs', {
        layout:'default',
       // template:'about-template',
        title:'About'
    });
});
app.get('/calendars', (req, res) => {
    res.render('calendarsEntryPage.hbs', {
        layout:'default',
        title:'Calendars'
    });
});
app.get('/units', (req, res) => {
    res.render('unitsEntryPage.hbs', {
        layout:'default',
        title:'Units',
        unitMap:unitMap
    });
});
app.get('/labs', (req, res) => {
    res.render('labsEntryPage.hbs', {
        layout:'default',
        title:'Labs'
    });
});
app.get('/writing', (req, res) => {
    res.render('writingEntryPage.hbs', {
        layout:'default',
        title:'Writing'
    });
});
app.get('/computationEntry', (req, res) => {
    res.render('computationEntryPage.hbs', {
        layout:'default',
        title:'Computational Physics'
    });
});
app.get('/computation/:type/:name', (req, res) => {
    if (req.params.type === 'entry') {
        res.render('computationEntryPage.hbs', {
            layout:'default',
            title:'Computational Physics'
        });
    } else {
        res.render(`computation/${req.params.type}/${req.params.name}.hbs`, {
            layout:'computationLayout.hbs',
            id: req.params.uid
        });
    }
});
app.get('/enrichment', (req, res) => {
    res.render('enrichmentEntryPage.hbs', {
        layout:'default',
        title:'Enrichment'
    });
});
app.get('/jokes', (req, res) => {
    res.render('jokesEntryPage.hbs', {
        layout:'default',
        title:'Jokes'
    });
});
// sending a joke image image
app.get('/getJoke/:imageName', (req,res)=>{
    res.sendFile(__dirname + '/content/jokes/' + req.params.imageName);
});





app.listen(3000);