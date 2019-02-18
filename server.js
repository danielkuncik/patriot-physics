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


hbs.registerHelper('listUnitLinks', () => {
    var unitClusterKey, unitCluster, unitKey, unit, podKey, pod;
    var unitList = "<ul>";
    for (unitClusterKey in unitMap) {
        unitCluster = unitMap[unitClusterKey];
        unitList = unitList + `<li><a href = '/unitcluster/${unitClusterKey}'>${unitCluster.name}</a><ul>`;
        for (unitKey in unitCluster.units) {
            unit = unitCluster.units[unitKey];
            unitList = unitList + `<li><a href = '/unit/${unitClusterKey}/${unitKey}'>${unit.name}</a><ul>`;
            for (podKey in unit.pods) {
                pod = unit.pods[podKey];
                unitList = unitList + `<li><a href = '/pod/${unitClusterKey}/${unitKey}/${podKey}'>${pod.name}</a></li>`
            }
            unitList = unitList + "</ul></li>";
        }
        unitList = unitList + "</ul></li>";
    }
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
app.get('/unitsEntryPage', (req, res) => {
    res.render('unitsEntryPage.hbs', {
        layout:'default',
        title:'Units',
        unitMap:unitMap
    });
});
app.get('/unitcluster/:unitClusterKey', (req, res) => {
    res.render('units/' + req.params.unitClusterKey + '/unit_cluster_home_page.hbs', {
        layout: 'unitClusterPageLayout.hbs',
        title: 'Unit Cluster'
    })
});
app.get('/unit/:unitClusterKey/:unitKey', (req, res) =>{
    res.render('units/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/unit_home_page.hbs', {
        layout: 'unitPageLayout.hbs',
        title: "Unit"
    });
    //res.render('units/')
});
app.get('/pod/:unitClusterKey/:unitKey/:podKey', (req, res) => {
    res.render('units/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.podKey, {
        layout: "podPageLayout.hbs",
        title: "Pod"
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