const unitMap = require(__dirname + '/public/unit_map');
const shell = require('shelljs');
const fs = require('fs');

const hbs = require('express-hbs');

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
        if (isXinArray(`v${i}.hbs`,process) || isXinArray(`v${i}.pdf`,process)) {
            totalVersions += 1;
        } else {
            stillGoing = false;
        }
        i += 1;
    }
    return totalVersions
}


function isXinArray(x, array) {
    let answer = false;
    array.forEach((element) => {
        if (element === x) {
            answer = true;
        }
    });
    return answer
}



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


var quizMap = {};

function prepareQuizMap() {
    let versionCount, versionType;
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
                    versionCount = countVersionsOfQuiz(superUnitKey, unitKey, podKey);
                    if (isItThere(`content/quizzes/${superUnitKey}/${unitKey}/${podKey}/v${versionCount}.hbs`)) {
                        versionType = 'hbs';
                    } else if (isItThere(`content/quizzes/${superUnitKey}/${unitKey}/${podKey}/v${versionCount}.pdf`)) {
                        versionType = 'pdf';
                    } else {
                        versionType = 'none';
                    }
                    quizMap[superUnitKey][unitKey][podKey] = {
                        versions: versionCount,
                        fileType: versionType
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



//// HBS HELPERS
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

hbs.registerHelper('userInfo', (user, section) => {
    let output;
    if (user) {
        output = "<p>Logged in as:</p><ul>";
        output = output + `<li>Name: ${user.name}</li>`;
        output = output + `<li>Section: ${section.name}</li>`;
        output = output + "</ul>";
    } else {
        output = "<p>Not logged in.</p>";
    }
    return new hbs.SafeString(output)
});

hbs.registerHelper('loginLink',(user) => {
    let output;
    if (user) {
        output = "<a href = '/logout' class = 'nav-link'>Logout</a>";
    } else {
        output = "<a href = '/login' class = 'nav-link'>Login</a>";
    }
    return new hbs.SafeString(output)
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
    let thisPod, thisPodTitle;
    var podList = "<ul>";
    Object.keys(unitMap[selectedUnitClusterKey].units[selectedUnitKey].pods).forEach((podKey) => {
        thisPod = unitMap[selectedUnitClusterKey].units[selectedUnitKey].pods[podKey];
        if (thisPod.subtitle) {
            thisPodTitle = `${thisPod.letter}: ${thisPod.title}: ${thisPod.subtitle}`;
        } else {
            thisPodTitle = `${thisPod.letter}: ${thisPod.title}`;
        }
        if (quizMap[selectedUnitClusterKey][selectedUnitKey][podKey].versions > 0) {
            podList += `<li><a href = '/quizzes/${selectedUnitClusterKey}/${selectedUnitKey}/${podKey}'>${thisPodTitle}</a></li>`;
        } else {
            podList += `<li>${thisPodTitle}</li>`;
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
    var unitClusterKey, unitCluster, unitKey, unit, podKey, pod, letter, unitNumber, thisPodTitle;
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
                                if (pod.subtitle) {
                                    thisPodTitle = `${pod.title}: ${pod.subtitle}`;
                                } else {
                                    thisPodTitle = pod.title;
                                }
                                if (pod.letter) {
                                    letter = pod.letter
                                } else {
                                    letter = ''
                                }
                                if (pod.available) {
                                    unitList = unitList + `<li><a href = '/pod/${unitClusterKey}/${unitKey}/${podKey}'>${letter}: ${thisPodTitle}</a></li>`
                                } else {
                                    unitList = unitList + `<li>${letter}: ${thisPodTitle}</li>`
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



display_home = (req,res) => {
    res.render('home.hbs', {
        layout: 'default',
        // template:'home-template',
        title: 'Home Page',
        user: req.user,
        section: req.section
    });
};

display_login_page = (req, res) => {
    if (!req.user) {
        res.render('loginPage.hbs', {
            layout: 'default',
            'title': 'Login Page',
            user: req.user,
            section: req.section
        });
    } else {
        res.redirect('/');
    }
};

display_logout_page = (req, res) => {
    if (!req.user) {
        res.redirect('/');
    } else {
        res.render('logoutPage.hbs', {
            layout: 'default',
            'title': 'Logout Page',
            user: req.user,
            section: req.section
        });
    }
};

display_units_entry_page = (req,res) => {
    res.render('unitsEntryPage.hbs', {
        layout:'default',
        title:'Units',
        unitMap:unitMap,
        user: req.user,
        section: req.section
    });
};


display_unit_cluster_page = (req,res) => {
    unitCluster = unitMap[req.params.unitClusterKey];
    res.render('units/' + req.params.unitClusterKey + '/' + req.params.unitClusterKey + '_unit_cluster_page.hbs', {
        layout: 'unitClusterPageLayout.hbs',
        selectedUnitClusterKey: req.params.unitClusterKey,
        title: unitCluster.title,
        user: req.user,
        section: req.section
    })
};

display_unit_page = (req, res) => {
    unitCluster = unitMap[req.params.unitClusterKey];
    unit = unitCluster.units[req.params.unitKey];
    res.render('units/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.unitKey + '_unit_page.hbs', {
        layout: 'unitPageLayout.hbs',
        title: unit.title,
        selectedUnitClusterKey: req.params.unitClusterKey,
        selectedUnitKey: req.params.unitKey,
        unitClusterName: unitCluster.title,
        unitNumber: unitMap[req.params.unitClusterKey].number * 100 + unitMap[req.params.unitClusterKey].units[req.params.unitKey].number,
        user: req.user,
        section: req.section
    });
};

display_pod_page = (req, res) => {
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
            unitClusterName: unitMap[req.params.unitClusterKey].title,
            user: req.user,
            section: req.section
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
};

display_lab_list_page = (req, res) => {
    res.render('labsEntryPage.hbs', {
        layout:'default',
        title:'Labs',
        user: req.user,
        section: req.section
    });
};

display_lab_page = (req, res) => {
    res.render(__dirname + '/content/labs/' + req.params.labKey + '.hbs', {
        layout: 'default',
        title: 'Lab',
        user: req.user,
        section: req.section
    });
};

display_quiz_entry_page = (req, res) => {
    res.render('quizEntryPage.hbs', {
        layout: 'default',
        title: 'Quizzes',
        user: req.user,
        section: req.section
    });
};

display_quiz_unit_page = (req, res) => {
    res.render('unitQuizPage.hbs', {
        layout: 'default',
        title: unitMap[req.params.unitClusterKey].units[req.params.unitKey].title + " Quizzes",
        unitClusterName: unitMap[req.params.unitClusterKey].title,
        unitName: unitMap[req.params.unitClusterKey].units[req.params.unitKey].title,
        selectedUnitClusterKey: req.params.unitClusterKey,
        selectedUnitKey: req.params.unitKey,
        user: req.user,
        section: req.section
    })
};

const quizPassword = 'ibis';

function quizAccess(section, level, enteredPassword) {
    let result = false;
    if (section === "Violet") {
        if (level <= 2 || level >= 5) {
            result = true;
        } else if (enteredPassword === quizPassword) {
            result = true;
        } else {
            result = false;
        }
    } else if (section === "Red" || section || section === "Blue" || section === "Green" || section === 'Orange') {
        if (level >= 5) {
            result = true;
        } else if (enteredPassword === quizPassword) {
            result = true;
        } else {
            result = false;
        }
    } else {
        result = false;
    }
    return result
}

display_quiz = (req, res) => {
    let level = unitMap[req.params.unitClusterKey].units[req.params.unitKey].pods[req.params.podKey].level;
    let section;
    if (req.section) {
        section = req.section.name;
    } else {
        section = false;
    }
    let enteredPassword = req.body.password;
    if (quizAccess(section, level, enteredPassword)) {
        if (req.params.podKey === 'all') {
            res.render('allQuizzesInAUnit.hbs', {
                layout: 'default',
                selectedUnitClusterKey: req.params.unitClusterKey,
                selectedUnitKey: req.params.unitKey,
                user: req.user,
                section: req.section
            })
        } else {
            let versionNumber = quizMap[req.params.unitClusterKey][req.params.unitKey][req.params.podKey].versions;
            let versionType = quizMap[req.params.unitClusterKey][req.params.unitKey][req.params.podKey].fileType;
            if (versionType === 'hbs') {
                res.render('quizzes/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.podKey + '/v' + String(versionNumber) +'.hbs', {
                    layout: 'quizPageLayout.hbs',
                    selectedUnitClusterKey: req.params.unitClusterKey,
                    selectedUnitKey: req.params.unitKey,
                    letter: unitMap[req.params.unitClusterKey].units[req.params.unitKey].pods[req.params.podKey].letter,
                    title: unitMap[req.params.unitClusterKey].units[req.params.unitKey].pods[req.params.podKey].title,
                    unitNumber: unitMap[req.params.unitClusterKey].number * 100 + unitMap[req.params.unitClusterKey].units[req.params.unitKey].number,
                    unitTitle: unitMap[req.params.unitClusterKey].units[req.params.unitKey].title,
                    unitClusterTitle: unitMap[req.params.unitClusterKey].title,
                    level: unitMap[req.params.unitClusterKey].units[req.params.unitKey].pods[req.params.podKey].level,
                    version: versionNumber,
                    user: req.user,
                    section: req.section
                });
            } else if (versionType === 'pdf') {
                let filePath = '/content/quizzes/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.podKey + '/v' + String(versionNumber) +'.pdf';
                fs.readFile(__dirname + filePath , function (err,data){
                    res.contentType("application/pdf");
                    res.send(data);
                });
            }
        }
    } else {
        let action = `/quizzes/${req.params.unitClusterKey}/${req.params.unitKey}/${req.params.podKey}`;
        res.render('quizPasswordPage.hbs', {
            layout: 'default',
            selectedUnitClusterKey: req.params.unitClusterKey,
            selectedUnitKey: req.params.unitKey,
            selectedPodKey: req.params.podKey,
            user: req.user,
            section: req.section,
            action: action
        });
    }
};

module.exports = {
    display_home,
    display_login_page,
    display_logout_page,
    display_units_entry_page,
    display_unit_cluster_page,
    display_unit_page,
    display_pod_page,
    display_lab_list_page,
    display_lab_page,
    display_quiz_entry_page,
    display_quiz_unit_page,
    display_quiz
};
