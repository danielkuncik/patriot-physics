const express = require('express');
const hbs = require('express-hbs');
const unitMap = require(__dirname + '/public/unit_map');
const shell = require('shelljs');

var app = express();

function isItThere(filename) {
    let process = shell.ls(`${__dirname}/${filename}`);
    return !process.stderr;
}

app.set('view engine', 'hbs');
app.set('views', [__dirname + '/views',__dirname + '/content']);
app.engine('hbs', hbs.express4({
   // extname: 'hbs',
    defaultView: 'default.hbs',
    partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts'
}));
app.use(express.static(__dirname + '/public'));


/// indicates which itmes in the unit map are available and which are not!
function prepareUnitMap() {
    Object.keys(unitMap).forEach((superUnitKey) => {
        if (!isItThere(`content/units/${superUnitKey}`) || !isItThere(`content/units/${superUnitKey}/${superUnitKey}_unit_cluster_page.hbs`)) {
            unitMap[superUnitKey].available = false;
        } else {
            console.log(`content/units/${superUnitKey}/${superUnitKey}_unit_cluster_page.hbs`);
            unitMap[superUnitKey].available = true;
            Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
                if (!isItThere(`units_copy/${superUnitKey}/${unitKey}`) || !isItThere(`units_copy/${superUnitKey}/${unitKey}/${unitKey}_unit_page.hbs`)) {
                    unitMap[superUnitKey].units[unitKey].available = false;
                } else {
                    unitMap[superUnitKey].units[unitKey].available = true;
                    Object.keys(unitMap[superUnitKey].units[unitKey].goals).forEach((goalKey) => {
                        if (!isItThere(`units_copy/${superUnitKey}/${unitKey}/${goalKey}.hbs`)) {
                            unitMap[superUnitKey].units[unitKey].goals[goalKey].available = false;
                        } else {
                            unitMap[superUnitKey].units[unitKey].goals[goalKey].available = true;
                        }
                    });
                }
            });
        }
    });
}
prepareUnitMap();



/// NOT READY YET!
hbs.registerHelper('createUnitNavbar', (selectedUnitClusterKey) => {
    var unitCluster, unitClusterKey, unitClusterID, unitKey, unitID, pod, podKey, podID;
    var htmlString = "<nav class = 'navbar navbar-light bg-light' style: 'text-indent: 0px'>";
   // htmlString += "<div class = 'container' style: 'text-indent: 0px'>";
    htmlString += "<a class = 'navbar-brand' href = '/unitsEntryPage'>Units</a>";
    htmlString += "<ul class = 'navbar-Nav'>";
    for (unitClusterKey in unitMap) {
        unitCluster = unitMap[unitClusterKey];
        unitClusterID = "ID" + unitClusterKey;
        htmlString += "<li class = 'nav-item'>";
        htmlString += "<div class = 'row'>";
        htmlString += `<a class = 'nav-link' href = '/unitcluster/${unitClusterKey}'>${unitCluster.title}</a>`;
        htmlString += `<button class = 'navbar-toggler' data-toggle='collapse' data-target = '#${unitClusterID}'>`;
        htmlString += "<span class = 'navbar-toggler-icon'></span>";
        htmlString += "</button>";
        htmlString += `<div class = 'collapse `;
        if (unitClusterKey === selectedUnitClusterKey) {
            htmlString += "show "
        }
        htmlString += `navbar-collapse' id = '${unitClusterID}'>`;
        htmlString += "<ul class = 'navbar-nav'>";
        for (unitKey in unitCluster.units) {
            unit = unitCluster.units[unitKey];
            unitID = "ID" + unitKey;
            htmlString += "<li class = 'nav-item'>";
            htmlString += "<div class = 'row'>";
            htmlString += `<a class = 'nav-link' href = '/unit/${unitClusterKey}/${unitKey}'>${unit.title}</a>`;
            htmlString += `<button class = 'navbar-toggler' data-toggle='collapse' data-target = '#${unitID}'>`;
            htmlString += "<span class = 'navbar-toggler-icon'></span>";
            htmlString += "</button>";
            htmlString += `<div class = 'collapse navbar-collapse' id = '${unitID}'>`;
            htmlString += "<ul class = 'navbar-nav'>";
            for (podKey in unit.pods) {
                pod = unit.pods[podKey];
                podID = "ID" + podKey;
                htmlString += "<li class = 'nav-item'>";
                htmlString += `<a class = 'nav-link' href = '/pod/${unitClusterKey}/${unitKey}/${podKey}'>${pod.title}</a>`;
                htmlString += "</li>";
            }
            htmlString += "</ul>";
            htmlString += "</div>";
            htmlString += "</div>";
            htmlString += "</li>";
        }
        htmlString += "</ul>";
        htmlString += "</div>";
        htmlString += "</li>"
    }
    htmlString += "</ul>";
   // htmlString += "</div>";
    htmlString += "</nav>";
    return new hbs.SafeString(htmlString);
});

/// helpers to make lists of links on each unit page!
hbs.registerHelper('listAllUnitsAndPods', () => {
    var unitClusterKey, unitCluster, unitKey, unit, podKey, pod;
    var unitList = "<ul>";
    for (unitClusterKey in unitMap) {
        unitCluster = unitMap[unitClusterKey];
        if (unitCluster.available) {
            unitList = unitList + `<li><a href = '/unitcluster/${unitClusterKey}'>${unitCluster.title}</a><ul>`;
            for (unitKey in unitCluster.units) {
                unit = unitCluster.units[unitKey];
                if (unit.available) {
                    unitList = unitList + `<li><a href = '/unit/${unitClusterKey}/${unitKey}'>${unit.title}</a><ul>`;
                    for (podKey in unit.pods) {
                        pod = unit.pods[podKey];
                        if (pod.available) {
                            unitList = unitList + `<li><a href = '/pod/${unitClusterKey}/${unitKey}/${podKey}'>${pod.title}</a></li>`
                        } else {
                            unitList = unitList + `<li>${pod.title}</li>`
                        }
                    }
                    unitList = unitList + "</ul></li>";
                }
            }
            unitList = unitList + "</ul></li>";
        }
    }
    unitList = unitList + "</ul>";
    return new hbs.SafeString(unitList);
});

hbs.registerHelper('listAllUnits', () => {
    var unitClusterKey, unitCluster, unitKey, unit;
    var unitList = "<ul>";
    for (unitClusterKey in unitMap) {
        unitCluster = unitMap[unitClusterKey];
        if (unitCluster.available) {
            unitList = unitList + `<li><a href = '/unitcluster/${unitClusterKey}'>${unitCluster.title}</a><ul>`;
            for (unitKey in unitCluster.units) {
                unit = unitCluster.units[unitKey];
                if (unit.available) {
                    unitList = unitList + `<li><a href = '/unit/${unitClusterKey}/${unitKey}'>${unit.title}</a>`;
                    unitList = unitList + "</li>";
                }
            }
            unitList = unitList + "</ul></li>";
        }
    }
    unitList = unitList + "</ul>";
    return new hbs.SafeString(unitList);
});

hbs.registerHelper('listAllUnitsWithinCluster', (selectedUnitClusterKey) => {
    var unitClusterKey, unitCluster, unitKey, unit;
    var unitList = "<ul>";
    for (unitClusterKey in unitMap) {
        unitCluster = unitMap[unitClusterKey];
        if (unitCluster.available) {
            unitList = unitList + `<li><a href = '/unitcluster/${unitClusterKey}'>${unitCluster.title}</a>`;
            if (unitClusterKey === selectedUnitClusterKey) {
                unitList = unitList + '<ul>';
                for (unitKey in unitCluster.units) {
                    unit = unitCluster.units[unitKey];
                    if (unit.available) {
                        unitList = unitList + `<li><a href = '/unit/${unitClusterKey}/${unitKey}'>${unit.title}</a>`;
                        unitList = unitList + "</li>";
                    }
                }
                unitList = unitList + "</ul></li>";
            }
        }
    }
    unitList = unitList + "</ul>";
    return new hbs.SafeString(unitList);
});

hbs.registerHelper('listAllPodsWithinUnit', (selectedUnitClusterKey, selectedUnitKey) => {
    var unitClusterKey, unitCluster, unitKey, unit, podKey, pod, letter;
    var unitList = "<ul>";
    for (unitClusterKey in unitMap) {
        unitCluster = unitMap[unitClusterKey];
        unitList = unitList + `<li><a href = '/unitcluster/${unitClusterKey}'>${unitCluster.title}</a>`;
        if (unitClusterKey === selectedUnitClusterKey) {
            unitList = unitList + '<ul>';
            for (unitKey in unitCluster.units) {
                unit = unitCluster.units[unitKey];
                unitList = unitList + `<li><a href = '/unit/${unitClusterKey}/${unitKey}'>${unit.title}</a>`;
                if (unitKey === selectedUnitKey) {
                    unitList = unitList + "<ul>";
                    for (podKey in unit.pods) {
                        pod = unit.pods[podKey];
                        if (pod.letter) {letter = pod.letter} else {letter = ''}
                        unitList = unitList + `<li><a href = '/pod/${unitClusterKey}/${unitKey}/${podKey}'>${letter}: ${pod.title}</a></li>`
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


hbs.registerHelper('addAllPodsToMap', (unitClusterKey, unitKey) => {
    const myPods = unitMap[unitClusterKey]["units"][unitKey]["pods"];
    var podAddString = "", pod;
    Object.keys(myPods).forEach((key) => {
        pod = myPods[key];
        podAddString += (`myUnitMap.addPod('${pod.letter}',${pod.level},${pod.horizontal});`);
    });
    return new hbs.SafeString(podAddString);
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
app.get('/info',(req,res) => {
    res.render('infoEntryPage.hbs', {
        layout:'default',
       // template:'about-template',
        title:'Information'
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
        title: unitCluster.title
    })
});

// unit home page
app.get('/unit/:unitClusterKey/:unitKey', (req, res) =>{
    unitCluster = unitMap[req.params.unitClusterKey];
    unit = unitCluster.units[req.params.unitKey];
    res.render('units/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.unitKey + '_unit_page.hbs', {
        layout: 'unitPageLayout.hbs',
        title: unit.title,
        selectedUnitClusterKey: req.params.unitClusterKey,
        selectedUnitKey: req.params.unitKey,
        unitClusterName: unitCluster.title
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
        title: pod.title,
        level: pod.level,
        selectedUnitClusterKey: req.params.unitClusterKey,
        selectedUnitKey: req.params.unitKey,
        selectedPodKey: req.params.podKey,
        objective: pod.objective,
        assetPath: '/podAssets/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.podKey + '/',
        letter: pod.letter
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