const hbs = require('express-hbs');
const unitMap = require(__dirname + '/public/unit_map');
const { availableContent } = require('./findAvailableContent.js');


hbs.registerHelper('userInfo', (user, section, overallLevel) => {
    let output;
    if (overallLevel === undefined) {
        overallLevel = 0;
    }
    if (user) {
        output = "<p>Logged in as:</p><ul>";
        output = output + `<li>Name: ${user.name}</li>`;
        output = output + `<li>Section: ${section.name}</li>`;
        output = output + `<li>Level ${overallLevel}</li>`;
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

hbs.registerHelper('displayJoke', (name) => {
    let link = `/joke/${name}`;
    let output = `<img src = '${link}' width = 'auto' height = '300px' />`;
    return new hbs.SafeString(output);
});


function getGradeMessagesForPod(superUnitKey, unitKey, gradeMap) {
    let messages = {};
    Object.keys(unitMap[superUnitKey].units[unitKey].pods).forEach((podKey) => {
        messages[podKey] = '';
    });

    if (gradeMap) {
        if (gradeMap[superUnitKey]) {
            if (gradeMap[superUnitKey].units[unitKey].pods && gradeMap[superUnitKey].units[unitKey].level > 0) {
                Object.keys(gradeMap[superUnitKey].units[unitKey].pods).forEach((key) => {
                    let score = gradeMap[superUnitKey].units[unitKey].pods[key].score;
                    let text;
                    if (score === 0 ) {
                        text = ': not yet taken';
                    } else if (score >= 18) {
                        text = ': PASSED';
                    } else if (score > 0 && score < 18) {
                        text = `: ${score} out of 20`;
                    }
                    messages[key]  = text;
                });
            }
        }
    }
    return messages;
}


function getLevelMessages(gradeMap) {
    let messages = {};
    if (gradeMap) {
        Object.keys(gradeMap).forEach((superUnitKey) => {
            messages[superUnitKey] = {};
            if (gradeMap[superUnitKey].units) {
                Object.keys(gradeMap[superUnitKey].units).forEach((unitKey) => {
                    if (gradeMap[superUnitKey].units[unitKey].level > 0) {
                        messages[superUnitKey][unitKey] = `: Level ${gradeMap[superUnitKey].units[unitKey].level}`;
                    } else {
                        messages[superUnitKey][unitKey] = undefined;
                    }
                });
            }
        });
    }
    return messages
}

hbs.registerHelper('listAllUnits',(gradeMap) => {
    let fullList = "<ul class = 'listOfAllUnits'>";
    Object.keys(unitMap).forEach((superUnitKey) => {
        let superUnitListItem = "<li class = 'superUnitListItem'>";
        let superUnitTitle = unitMap[superUnitKey].title;
        if (availableContent[superUnitKey].available) {
            let link = `/superUnit/${superUnitKey}`;
            superUnitListItem = superUnitListItem + `<a href = '${link}'>${superUnitTitle}</a>`;
        } else {
            superUnitListItem = superUnitListItem + superUnitTitle;
        }
        superUnitListItem = superUnitListItem + "</li>";
        fullList = fullList + superUnitListItem;
        let unitList = "<ul class = 'unitList'>";
        Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
            let unitListItem = "<li class = 'unitListItem'>";
            let unitTitle = unitMap[superUnitKey].units[unitKey].title;
            if (availableContent[superUnitKey].units[unitKey].available) {
                let unitLink = `/unit/${superUnitKey}/${unitKey}`;
                unitListItem = unitListItem + `<a href = '${unitLink}'>${unitTitle}</a>`;
            } else {
                unitListItem = unitListItem + unitTitle;
            }
            unitListItem = unitListItem + "</li>";
            unitList = unitList + unitListItem;
        });
        unitList = unitList + "</ul>";
        fullList = fullList + unitList;
    });
    fullList = fullList + "</ul>";
    return new hbs.SafeString(fullList)
});


hbs.registerHelper('listAllUnitsWithQuizzes', (gradeMap) => {
    let unitNumber, thisLevelMessage;
    var unitList = "<ul>";
    const levelMessages = getLevelMessages(gradeMap);
    Object.keys(quizMap).forEach((superUnitKey) => {
        unitList += `<li> ${unitMap[superUnitKey].title} <ul>`;
        Object.keys(quizMap[superUnitKey]).forEach((unitKey) => {
            if (levelMessages && levelMessages[superUnitKey] && levelMessages[superUnitKey][unitKey]) {
                thisLevelMessage = levelMessages[superUnitKey][unitKey];
            } else {
                thisLevelMessage = '';
            }
            unitNumber = unitMap[superUnitKey].number * 100 + unitMap[superUnitKey].units[unitKey].number;
            unitList = unitList + `<li><a href = '/quizzes/${superUnitKey}/${unitKey}'>${unitNumber}: ${unitMap[superUnitKey].units[unitKey].title}</a>${thisLevelMessage}</li>`
        });
        unitList += "</ul></li>"
    });
    unitList +="</ul>";
    return new hbs.SafeString(unitList);
});

hbs.registerHelper('listPodsForQuizPage', (selectedUnitClusterKey, selectedUnitKey, gradeMap) => {
    let thisPod, thisPodTitle, thisGradeMessage;
    var podList = "<ul>";
    const gradeMessages = getGradeMessagesForPod(selectedUnitClusterKey, selectedUnitKey, gradeMap);
    Object.keys(unitMap[selectedUnitClusterKey].units[selectedUnitKey].pods).forEach((podKey) => {
        thisPod = unitMap[selectedUnitClusterKey].units[selectedUnitKey].pods[podKey];
        if (thisPod.subtitle) {
            thisPodTitle = `${thisPod.letter}: ${thisPod.title}: ${thisPod.subtitle}`;
        } else {
            thisPodTitle = `${thisPod.letter}: ${thisPod.title}`;
        }
        if (gradeMessages[podKey]) {
            thisGradeMessage =  `: ${gradeMessages[podKey]}`;
        } else {
            thisGradeMessage = '';
        }
        if (quizMap[selectedUnitClusterKey][selectedUnitKey][podKey].versions > 0) {
            podList += `<li><a href = '/quizzes/${selectedUnitClusterKey}/${selectedUnitKey}/${podKey}'>${thisPodTitle}</a>${thisGradeMessage}</li>`;
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

hbs.registerHelper('listAllPodsWithinUnit', (selectedUnitClusterKey, selectedUnitKey, gradeMap) => {
    var unitClusterKey, unitCluster, unitKey, unit, podKey, pod, letter, unitNumber, thisPodTitle, scoreMessage, thisLevel;
    var unitList = "<ul>";
    let podScoreMessages = getGradeMessagesForPod(selectedUnitClusterKey, selectedUnitKey, gradeMap);
    let levelScoreMessages = getLevelMessages(gradeMap);
    for (unitClusterKey in unitMap) {
        unitCluster = unitMap[unitClusterKey];
        if (unitCluster.available) {
            unitList = unitList + `<li><a href = '/unitcluster/${unitClusterKey}'>${unitCluster.title}</a>`;
            if (unitClusterKey === selectedUnitClusterKey) {
                unitList = unitList + '<ul>';
                for (unitKey in unitCluster.units) {
                    unit = unitCluster.units[unitKey];
                    if (unit.available) {
                        if (levelScoreMessages[unitClusterKey] && levelScoreMessages[unitClusterKey][unitKey]) {
                            thisLevel = levelScoreMessages[unitClusterKey][unitKey];
                        } else {
                            thisLevel = '';
                        }
                        unitNumber = unitCluster.number * 100 + unit.number;
                        unitList = unitList + `<li><a href = '/unit/${unitClusterKey}/${unitKey}'>${unitNumber}: ${unit.title}</a>${thisLevel}`;
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
                                    letter = pod.letter;
                                } else {
                                    letter = '';
                                }
                                if (podScoreMessages[podKey]) {
                                    scoreMessage = podScoreMessages[podKey];
                                } else {
                                    scoreMessage = '';
                                }
                                if (pod.available) {
                                    unitList = unitList + `<li><a href = '/pod/${unitClusterKey}/${unitKey}/${podKey}'>${letter}: ${thisPodTitle}</a>${scoreMessage}</li>`;
                                } else {
                                    unitList = unitList + `<li>${letter}: ${thisPodTitle}${scoreMessage}</li>`;
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

hbs.registerHelper('displayQuizLink', (unitClusterKey, unitKey, podKey) => {
    let link = "<p class ='quizLink'>";
    if (quizMap[unitClusterKey]) {
        if (quizMap[unitClusterKey][unitKey]) {
            if (quizMap[unitClusterKey][unitKey][podKey]) {
                if (quizMap[unitClusterKey][unitKey][podKey].versionCount > 0) {
                    let href = `/quizzes/${unitClusterKey}/${unitKey}/${podKey}`;
                    link = link + `If you are logged in, click <a href = '${href}'>here</a> to go to the quiz.`;
                }
            }
        }
    }
    link = link + '</p>';
    return new hbs.SafeString(link);
});


hbs.registerHelper('addAllPodsToMap', (unitClusterKey, unitKey, gradeMap) => {
    let thisScore;
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
        if (gradeMap && gradeMap[unitClusterKey] && gradeMap[unitClusterKey].units && gradeMap[unitClusterKey].units[unitKey] && gradeMap[unitClusterKey].units[unitKey].pods) {
            if (gradeMap[unitClusterKey].units[unitKey].pods[key]) {
                thisScore = gradeMap[unitClusterKey].units[unitKey].pods[key].score;
            } else {
                thisScore = 0;
            }
        } else {
            thisScore = 0;
        }
        if (prerequisiteString[prerequisiteString.length - 1] === ",") {prerequisiteString = prerequisiteString.slice(0,-1)}
        podAddString += (`myUnitMap.addPod('${key}','${pod.letter}',${pod.level},${pod.horizontal},[${prerequisiteString}],${thisScore});`);
    });
    return new hbs.SafeString(podAddString);
});



hbs.registerHelper('printUnitLevel',(superUnitKey, unitKey, gradeMap) => {
    let level = undefined;
    let grade = undefined;
    if (gradeMap && gradeMap[superUnitKey] && gradeMap[superUnitKey].units && gradeMap[superUnitKey].units[unitKey] ) {
        if (gradeMap[superUnitKey].units[unitKey].level > 0) {
            level = `Level: ${gradeMap[superUnitKey].units[unitKey].level}`;
        }
        if (gradeMap[superUnitKey].units[unitKey].grade) {
            grade = `Current Grade: ${gradeMap[superUnitKey].units[unitKey].grade}%`;
        }
    }
    let string = '';
    if (level) {
        string = '<ul>';
        string = string + `<li>${level}</li>`;
        if (grade) {
            string = string + `<li>${grade}</li>`;
        }
        string = string + '</ul>';
    }
    return new hbs.SafeString(string);
});

hbs.registerHelper('printUnitLink', (superUnitKey, unitKey, gradeMap) => {
    let string = '<li>';
    let level = undefined;
    let grade = undefined;
    if (gradeMap && gradeMap[superUnitKey] && gradeMap[superUnitKey].units && gradeMap[superUnitKey].units[unitKey] ) {
        if (gradeMap[superUnitKey].units[unitKey].level > 0) {
            level = `Level: ${gradeMap[superUnitKey].units[unitKey].level}`;
        }
        if (gradeMap[superUnitKey].units[unitKey].grade) {
            grade = `Current Grade: ${gradeMap[superUnitKey].units[unitKey].grade}%`;
        }
    }
    let superUnit = unitMap[superUnitKey];
    let unit = superUnit.units[unitKey];

    const unitNumber = superUnit.number * 100 + unit.number;
    const unitTitle = unit.title;

    string = string + `<a href = '/unit/${superUnitKey}/${unitKey}'>${unitNumber}-${unitTitle}</a>`;

    if (level) {
        string = string + '<ul>';
        string = string + `<li>${level}</li>`;
        if (grade) {
            string = string + `<li>${grade}</li>`;
        }
        string = string + '</ul>';
    }
    string = string + '</li>';
    return new hbs.SafeString(string);
});


hbs.registerHelper('isAP', (courseLevel) => {
    let result;
    if (courseLevel === 'AP') {
        result = true;
    } else {
        result = false;
    }
    return result
});

hbs.registerHelper('isHonors', (courseLevel) => {
    let result;
    if (courseLevel === 'Honors') {
        result = true;
    } else {
        result = false;
    }
    return result
});

hbs.registerHelper('isA_Level', (courseLevel) => {
    let result;
    if (courseLevel === 'A_Level') {
        result = true;
    } else {
        result = false;
    }
    return result
});


hbs.registerHelper('isNoSection', (courseLevel) => {
    let result;
    if (courseLevel === undefined) {
        result = true;
    } else {
        result = false;
    }
    return result
});


module.exports = {

};