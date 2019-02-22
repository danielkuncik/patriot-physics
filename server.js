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



/// helpers to make lists of links on each unit page!
hbs.registerHelper('listAllUnitsAndPods', () => {
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

hbs.registerHelper('listAllUnits', () => {
    var unitClusterKey, unitCluster, unitKey, unit;
    var unitList = "<ul>";
    for (unitClusterKey in unitMap) {
        unitCluster = unitMap[unitClusterKey];
        unitList = unitList + `<li><a href = '/unitcluster/${unitClusterKey}'>${unitCluster.name}</a><ul>`;
        for (unitKey in unitCluster.units) {
            unit = unitCluster.units[unitKey];
            unitList = unitList + `<li><a href = '/unit/${unitClusterKey}/${unitKey}'>${unit.name}</a>`;
            unitList = unitList + "</li>";
        }
        unitList = unitList + "</ul></li>";
    }
    unitList = unitList + "</ul>";
    return new hbs.SafeString(unitList);
});

hbs.registerHelper('listAllUnitsWithinCluster', (selectedUnitClusterKey) => {
    var unitClusterKey, unitCluster, unitKey, unit;
    var unitList = "<ul>";
    for (unitClusterKey in unitMap) {
        unitCluster = unitMap[unitClusterKey];
        unitList = unitList + `<li><a href = '/unitcluster/${unitClusterKey}'>${unitCluster.name}</a>`;
        if (unitClusterKey === selectedUnitClusterKey) {
            unitList = unitList + '<ul>';
            for (unitKey in unitCluster.units) {
                unit = unitCluster.units[unitKey];
                unitList = unitList + `<li><a href = '/unit/${unitClusterKey}/${unitKey}'>${unit.name}</a>`;
                unitList = unitList + "</li>";
            }
            unitList = unitList + "</ul></li>";
        }
    }
    unitList = unitList + "</ul>";
    return new hbs.SafeString(unitList);
});

hbs.registerHelper('listAllPodsWithinUnit', (selectedUnitClusterKey, selectedUnitKey) => {
    var unitClusterKey, unitCluster, unitKey, unit, podKey, pod;
    var unitList = "<ul>";
    for (unitClusterKey in unitMap) {
        unitCluster = unitMap[unitClusterKey];
        unitList = unitList + `<li><a href = '/unitcluster/${unitClusterKey}'>${unitCluster.name}</a>`;
        if (unitClusterKey === selectedUnitClusterKey) {
            unitList = unitList + '<ul>';
            for (unitKey in unitCluster.units) {
                unit = unitCluster.units[unitKey];
                unitList = unitList + `<li><a href = '/unit/${unitClusterKey}/${unitKey}'>${unit.name}</a>`;
                if (unitKey === selectedUnitKey) {
                    unitList = unitList + "<ul>";
                    for (podKey in unit.pods) {
                        pod = unit.pods[podKey];
                        unitList = unitList + `<li><a href = '/pod/${unitClusterKey}/${unitKey}/${podKey}'>${pod.name}</a></li>`
                    }
                    unitList = unitList + "</ul>";
                }
                unitList = unitList + "</li>";
            }
            unitList = unitList + "</ul></li>";
        }
    }
    unitList = unitList + "</ul>";
    return new hbs.SafeString(unitList);
});


var unitCluster, unit, pod;
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

// unit cluster home page
app.get('/unitcluster/:unitClusterKey', (req, res) => {
    unitCluster = unitMap[req.params.unitClusterKey];
    res.render('units/' + req.params.unitClusterKey + '/' + req.params.unitClusterKey + '_unit_cluster_page.hbs', {
        layout: 'unitClusterPageLayout.hbs',
        selectedUnitClusterKey: req.params.unitClusterKey,
        title: unitCluster.name
    })
});

// unit home page
app.get('/unit/:unitClusterKey/:unitKey', (req, res) =>{
    unitCluster = unitMap[req.params.unitClusterKey];
    unit = unitCluster.units[req.params.unitKey];
    res.render('units/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.unitKey + '_unit_page.hbs', {
        layout: 'unitPageLayout.hbs',
        title: unit.name,
        selectedUnitClusterKey: req.params.unitClusterKey,
        selectedUnitKey: req.params.unitKey,
        unitClusterName: unitCluster.name
    });
    //res.render('units/')
});

// pod home page
app.get('/pod/:unitClusterKey/:unitKey/:podKey', (req, res) => {
    unitCluster = unitMap[req.params.unitClusterKey];
    unit = unitCluster.units[req.params.unitKey];
    pod = unit.pods[req.params.podKey];
    res.render('units/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.podKey + '/' + req.params.podKey + '_pod_page.hbs', {
        layout: "podPageLayout.hbs",
        unitName: unit.name,
        title: pod.name,
        level: pod.level,
        selectedUnitClusterKey: req.params.unitClusterKey,
        selectedUnitKey: req.params.unitKey,
        selectedPodKey: req.params.podKey,
        objective: pod.objective,
        assetPath: '/podAssets/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.podKey + '/'
    });
});
// on the asset path, for some reason it does not work if i do not beign with a slash

/// accessing pod assets
app.get('/podAssets/:unitClusterKey/:unitKey/:podKey/:assetKey', (req, res) => {
    var data = require(__dirname + '/content/units/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.podKey  + '/assets/' + req.params.assetKey);
    res.send(data);
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
    res.sendFile(__dirname + '/content/jokes/memedPictures/' + req.params.imageName);
});





app.listen(3000);