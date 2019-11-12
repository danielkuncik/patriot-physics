const express = require('express');
const hbs = require('express-hbs');
const fs = require('fs');
const unitMap = require(__dirname + '/public/unit_map');
const shell = require('shelljs');

const port = process.env.PORT || 3000;

var app = express();

function isXinArray(x, array) {
    let answer = false;
    array.forEach((element) => {
        if (element === x) {
            answer = true;
        }
    });
    return answer
}

function isItThere(filename) {
    let process = shell.ls(`${__dirname}/${filename}`); // trust the process, lol
    return !process.stderr;
}

function countFilesInADirectory(directoryName) {
    let process = shell.ls(`${__dirname}/${directoryName}`); // trust the process, lol
    return process.length
}

function countVersionsOfQuiz(superUnitKey, unitKey, podKey) {
    let directoryName = `content/quizzes/${superUnitKey}/${unitKey}/${podKey}`;
    let process = shell.ls(`${__dirname}/${directoryName}`); // trust the process, lol
    let N = 100;
    let i = 1;
    let stillGoing = true;
    let totalVersions = 0;
    while (i < N && stillGoing) {
        if (isXinArray(`v${i}.hbs`,process)) {
            totalVersions += 1;
        } else {
            stillGoing = false;
        }
        i += 1;
    }
    return totalVersions
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


var quizMap = {};

function prepareQuizMap() {
    Object.keys(unitMap).forEach((superUnitKey) => {
        if (isItThere(`content/quizzes/${superUnitKey}`)) {
            quizMap[superUnitKey] = {};
        }
    });
    Object.keys(quizMap).forEach((superUnitKey) => {
        Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
            if (isItThere(`content/quizzes/${superUnitKey}/${unitKey}`)) {
                quizMap[superUnitKey][unitKey] = {};
            }
        })
    });
    Object.keys(quizMap).forEach((superUnitKey) => {
        Object.keys(quizMap[superUnitKey]).forEach((unitKey) => {
            Object.keys(unitMap[superUnitKey].units[unitKey].pods).forEach((podKey) => {
                if (isItThere(`content/quizzes/${superUnitKey}/${unitKey}/${podKey}`)) {
                    quizMap[superUnitKey][unitKey][podKey] = {
                        versions: countVersionsOfQuiz(superUnitKey, unitKey, podKey)
                        // i need to add some sort of catch if the files are named incorrectly???
                    }
                } else {
                    quizMap[superUnitKey][unitKey][podKey] = {
                        versions: 0
                    };
                }
            });
        });
    });
}


prepareQuizMap();


/// indicates which itmes in the unit map are available and which are not!
function prepareUnitMap() {
    Object.keys(unitMap).forEach((superUnitKey) => {
        if (!isItThere(`content/units/${superUnitKey}`) || !isItThere(`content/units/${superUnitKey}/${superUnitKey}_unit_cluster_page.hbs`)) {
            unitMap[superUnitKey].available = false;
        } else {
           // console.log(`content/units/${superUnitKey}/${superUnitKey}_unit_cluster_page.hbs`);
            unitMap[superUnitKey].available = true;
            Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
                if (!isItThere(`content/units/${superUnitKey}/${unitKey}`) || !isItThere(`content/units/${superUnitKey}/${unitKey}/${unitKey}_unit_page.hbs`)) {
                    unitMap[superUnitKey].units[unitKey].available = false;
                } else {
                    unitMap[superUnitKey].units[unitKey].available = true;
                    Object.keys(unitMap[superUnitKey].units[unitKey].pods).forEach((goalKey) => {
                        if (isItThere(`content/units/${superUnitKey}/${unitKey}/pods/${goalKey}.hbs`)) {
                            unitMap[superUnitKey].units[unitKey].pods[goalKey].available = true;
                            unitMap[superUnitKey].units[unitKey].pods[goalKey].fileType = 'hbs';
                    //        console.log('hello its me');
                        } else if (isItThere(`content/units/${superUnitKey}/${unitKey}/pods/${goalKey}.pdf`)) {
                            unitMap[superUnitKey].units[unitKey].pods[goalKey].available = true;
                            unitMap[superUnitKey].units[unitKey].pods[goalKey].fileType = 'pdf';
                    //        console.log('ive been wondering if after all these years youd like to meet');
                        } else {
                            unitMap[superUnitKey].units[unitKey].pods[goalKey].available = false;
                        }
                    });
                }

/*
                if (isItThere(`content/units/${superUnitKey}/${unitKey}`)) {
                    if (isItThere(`content/units/${superUnitKey}/${unitKey}/${unitKey}_unit_page.hbs`)) {
                        UnitMap[superUnitKey].units[unitKey].pods[goalKey].available = true;
                        UnitMap[superUnitKey].units[unitKey].pods[goalKey].fileType = 'hbs';
                    } else if (isItThere(`content/units/${superUnitKey}/${unitKey}/${unitKey}_unit_page.pdf`)) {
                        UnitMap[superUnitKey].units[unitKey].pods[goalKey].available = true;
                        UnitMap[superUnitKey].units[unitKey].pods[goalKey].fileType = 'pdf';
                    } else {
                        UnitMap[superUnitKey].units[unitKey].pods[goalKey].available = false;
                    }
                } else {
                    UnitMap[superUnitKey].units[unitKey].pods[goalKey].available = false;
                }

                if (!isItThere(`content/units/${superUnitKey}/${unitKey}`) || !isItThere(`content/units/${superUnitKey}/${unitKey}/${unitKey}_unit_page.hbs`)) {
                    UnitMap[superUnitKey].units[unitKey].available = false;
                } else {
                    UnitMap[superUnitKey].units[unitKey].available = true;
                    Object.keys(UnitMap[superUnitKey].units[unitKey].pods).forEach((goalKey) => {
                        if (!isItThere(`content/units/${superUnitKey}/${unitKey}/pods/${goalKey}.hbs`)) {
                            UnitMap[superUnitKey].units[unitKey].pods[goalKey].available = false;
                        } else {
                            UnitMap[superUnitKey].units[unitKey].pods[goalKey].available = true;
                        }
                    });
                }
                */
            });
        }
    });
}
prepareUnitMap();


/// NOT READY YET!
hbs.registerHelper('createUnitNavbar', (selectedUnitClusterKey) => {
    var unitCluster, unitClusterKey, unitClusterID, unitKey, unitID, pod, podKey, podID;
    var htmlString = "<nav class = 'navbar navbar-light bg-light' style: 'Text-indent: 0px'>";
   // htmlString += "<div class = 'container' style: 'Text-indent: 0px'>";
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
    var unitClusterKey, unitCluster, unitKey, unit, podKey, pod, unitNumber;
    var unitList = "<ul>";
    for (unitClusterKey in unitMap) {
        unitCluster = unitMap[unitClusterKey];
        if (unitCluster.available) {
            unitList = unitList + `<li><a href = '/unitcluster/${unitClusterKey}'>${unitCluster.title}</a><ul>`;
            for (unitKey in unitCluster.units) {
                unit = unitCluster.units[unitKey];
                if (unit.available) {
                    unitNumber = unitCluster.number * 100 + unit.number;
                    unitList = unitList + `<li><a href = '/unit/${unitClusterKey}/${unitKey}'>${unitNumber}: ${unit.title}</a><ul>`;
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
    var unitClusterKey, unitCluster, unitKey, unit, unitNumber;
    var unitList = "<ul>";
    for (unitClusterKey in unitMap) {
        unitCluster = unitMap[unitClusterKey];
        if (unitCluster.available) {
            unitList = unitList + `<li><a href = '/unitcluster/${unitClusterKey}'>${unitCluster.title}</a><ul>`;
            for (unitKey in unitCluster.units) {
                unit = unitCluster.units[unitKey];
                if (unit.available) {
                    unitNumber = unitCluster.number * 100 + unit.number;
                    unitList = unitList + `<li><a href = '/unit/${unitClusterKey}/${unitKey}'>${unitNumber}: ${unit.title}</a>`;
                    unitList = unitList + "</li>";
                }
            }
            unitList = unitList + "</ul></li>";
        }
    }
    unitList = unitList + "</ul>";
    return new hbs.SafeString(unitList);
});

hbs.registerHelper('listAllUnitsWithQuizzes', () => {
    let unitNumber;
    var unitList = "<ul>";
    Object.keys(quizMap).forEach((superUnitKey) => {
        unitList += `<li> ${unitMap[superUnitKey].title} <ul>`;
        Object.keys(quizMap[superUnitKey]).forEach((unitKey) => {
            unitNumber = unitMap[superUnitKey].number * 100 + unitMap[superUnitKey].units[unitKey].number;
            unitList = unitList + `<li><a href = '/quizzes/${superUnitKey}/${unitKey}'>${unitNumber}: ${unitMap[superUnitKey].units[unitKey].title}</a></li>`
        });
        unitList += "</ul></li>"
    });
    unitList +="</ul>";
    return new hbs.SafeString(unitList);
});

hbs.registerHelper('listPodsForQuizPage', (selectedUnitClusterKey, selectedUnitKey) => {
    var podList = "<ul>";
    Object.keys(unitMap[selectedUnitClusterKey].units[selectedUnitKey].pods).forEach((podKey) => {
        if (quizMap[selectedUnitClusterKey][selectedUnitKey][podKey].versions > 0) {
            podList += `<li><a href = '/quizzes/${selectedUnitClusterKey}/${selectedUnitKey}/${podKey}'>${unitMap[selectedUnitClusterKey].units[selectedUnitKey].pods[podKey].title}</a></li>`;
        } else {
            podList += `<li>${unitMap[selectedUnitClusterKey].units[selectedUnitKey].pods[podKey].title}</li>`;
        }
    });
    podList += "</ul>";
    return new hbs.SafeString(podList);
});

hbs.registerHelper('listAllUnitsWithinCluster', (selectedUnitClusterKey) => {
    var unitClusterKey, unitCluster, unitKey, unit, unitNumber;
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
                        unitNumber = unitCluster.number * 100 + unit.number;
                        unitList = unitList + `<li><a href = '/unit/${unitClusterKey}/${unitKey}'>${unitNumber}: ${unit.title}</a>`;
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
    var unitClusterKey, unitCluster, unitKey, unit, podKey, pod, letter, unitNumber;
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
                        unitNumber = unitCluster.number * 100 + unit.number;
                        unitList = unitList + `<li><a href = '/unit/${unitClusterKey}/${unitKey}'>${unitNumber}: ${unit.title}</a>`;
                        if (unitKey === selectedUnitKey) {
                            unitList = unitList + "<ul>";
                            for (podKey in unit.pods) {
                                pod = unit.pods[podKey];
                                if (pod.letter) {
                                    letter = pod.letter
                                } else {
                                    letter = ''
                                }
                                if (pod.available) {
                                    unitList = unitList + `<li><a href = '/pod/${unitClusterKey}/${unitKey}/${podKey}'>${letter}: ${pod.title}</a></li>`
                                } else {
                                    unitList = unitList + `<li>${letter}: ${pod.title}</li>`
                                }
                            }
                            unitList = unitList + "</ul>";
                        }
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


hbs.registerHelper('addAllPodsToMap', (unitClusterKey, unitKey) => {
    const myPods = unitMap[unitClusterKey]["units"][unitKey]["pods"];
    var podAddString = "", pod;
    Object.keys(myPods).forEach((key) => {
        let prerequisiteString = "";
        pod = myPods[key];
        if (pod.prerequisites) {
            pod.prerequisites.forEach((preReq) => {
                prerequisiteString = prerequisiteString.concat("\"" + preReq + "\"" +  ",");
            });
        }
        if (prerequisiteString[prerequisiteString.length - 1] === ",") {prerequisiteString = prerequisiteString.slice(0,-1)}
        podAddString += (`myUnitMap.addPod('${key}','${pod.letter}',${pod.level},${pod.horizontal},[${prerequisiteString}]);`);
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
        unitClusterName: unitCluster.title,
        unitNumber: unitMap[req.params.unitClusterKey].number * 100 + unitMap[req.params.unitClusterKey].units[req.params.unitKey].number
    });
    //res.render('units/')
});

// pod home page
app.get('/pod/:unitClusterKey/:unitKey/:podKey', (req, res) => {
    unitCluster = unitMap[req.params.unitClusterKey];
    unit = unitCluster.units[req.params.unitKey];
    pod = unit.pods[req.params.podKey];
    if (pod.fileType === 'hbs') {
        res.render('units/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/pods/' + req.params.podKey + '.hbs', {
            layout: "podPageLayout.hbs",
            unitName: unitMap[req.params.unitClusterKey].units[req.params.unitKey].title,
            title: pod.title,
            level: pod.level,
            selectedUnitClusterKey: req.params.unitClusterKey,
            selectedUnitKey: req.params.unitKey,
            selectedPodKey: req.params.podKey,
            objective: pod.objective,
            //    assetPath: '/podAssets/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.podKey + '/',
            letter: pod.letter,
            unitNumber: unitMap[req.params.unitClusterKey].number * 100 + unitMap[req.params.unitClusterKey].units[req.params.unitKey].number,
            unitClusterName: unitMap[req.params.unitClusterKey].title
        });
    } else if (pod.fileType === 'pdf') {
        let filePath = '/content/units/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/pods/' + req.params.podKey + '.pdf';
        fs.readFile(__dirname + filePath , function (err,data){
            res.contentType("application/pdf");
            res.send(data);
        });
        /* var file = fs.createReadStream(filePath);
        var stat = fs.statSync(filePath);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
        file.pipe(res);
        */
    }
});
// on the asset path, for some reason it does not work if i do not beign with a slash

/// accessing pod assets
app.get('/podAssets/:unitClusterKey/:unitKey/:assetName', (req, res) => {
    var filepath = __dirname + '/content/units/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/pods/assets/' + req.params.assetName;
    res.sendFile(filepath);
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

// quiz entry page
app.get('/quizzes', (req, res) => {
    res.render('quizEntryPage.hbs', {
        layout: 'default',
        title: 'Quizzes'
    });
});

// quiz page for unit
app.get('/quizzes/:unitClusterKey/:unitKey', (req, res) => {
    res.render('unitQuizPage.hbs', {
        layout: 'default',
        title: unitMap[req.params.unitClusterKey].units[req.params.unitKey].title + " Quizzes",
        unitClusterName: unitMap[req.params.unitClusterKey].title,
        unitName: unitMap[req.params.unitClusterKey].units[req.params.unitKey].title,
        selectedUnitClusterKey: req.params.unitClusterKey,
        selectedUnitKey: req.params.unitKey,
    })
});


/// add security for quizzes!

const quizPasscode = '410358';

// individual quiz page
app.get('/quizzes/:unitClusterKey/:unitKey/:podKey', (req, res) => {
    if (req.query.passcode === quizPasscode) {
        if (req.params.podKey === 'all') {
            res.render('allQuizzesInAUnit.hbs', {
                layout: 'default',
                selectedUnitClusterKey: req.params.unitClusterKey,
                selectedUnitKey: req.params.unitKey
            })
        } else {
            let version = quizMap[req.params.unitClusterKey][req.params.unitKey][req.params.podKey].versions;
            res.render('quizzes/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.podKey + '/v' + String(version) +'.hbs', {
                layout: 'quizPageLayout.hbs',
                selectedUnitClusterKey: req.params.unitClusterKey,
                selectedUnitKey: req.params.unitKey,
                letter: unitMap[req.params.unitClusterKey].units[req.params.unitKey].pods[req.params.podKey].letter,
                title: unitMap[req.params.unitClusterKey].units[req.params.unitKey].pods[req.params.podKey].title,
                unitNumber: unitMap[req.params.unitClusterKey].number * 100 + unitMap[req.params.unitClusterKey].units[req.params.unitKey].number,
                unitTitle: unitMap[req.params.unitClusterKey].units[req.params.unitKey].title,
                unitClusterTitle: unitMap[req.params.unitClusterKey].title,
                level: unitMap[req.params.unitClusterKey].units[req.params.unitKey].pods[req.params.podKey].level
            });
        }
    } else {
        res.render('quizPasscodePage.hbs', {
            layout: 'default',
            selectedUnitClusterKey: req.params.unitClusterKey,
            selectedUnitKey: req.params.unitKey,
            selectedPodKey: req.params.podKey
        });
    }
});

app.listen(port);

