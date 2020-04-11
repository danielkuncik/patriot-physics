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

function createUnitListItem(superUnitKey, unitKey, gradeMap) {
    let levelMessage = '';
    let superUnitNumber = unitMap[superUnitKey].number;
    if (gradeMap && gradeMap[superUnitKey].units[unitKey].level > 0) {
        levelMessage = `--Level: ${gradeMap[superUnitKey].units[unitKey].level}`;
    }
    let unitListItem = "<li class = 'unitListItem'>";
    let unitTitle = unitMap[superUnitKey].units[unitKey].title;
    let unitNumber = 100 * superUnitNumber + unitMap[superUnitKey].units[unitKey].number;
    let unitMessage = `${unitNumber}: ${unitTitle}${levelMessage}`;
    if (availableContent[superUnitKey].units[unitKey].available) {
        let unitLink = `/unit/${superUnitKey}/${unitKey}`;
        unitListItem = unitListItem + `<a href = '${unitLink}'>${unitMessage}</a>`;
    } else {
        unitListItem = unitListItem + unitMessage;
    }
    unitListItem = unitListItem + "</li>";
    return unitListItem
}

// creates a list of all units within a super Unit
function createUnitList(superUnitKey, gradeMap) {
    let unitList = "<ul class = 'unitList'>";
    Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
        let unitListItem = createUnitListItem(superUnitKey, unitKey, gradeMap);
        unitList = unitList + unitListItem;
    });
    unitList = unitList + "</ul>";
    return unitList
}

function createSuperUnitListItem(superUnitKey, isItImportant) {
    let li_class;
    if (isItImportant) {
        li_class = 'superUnitListItem';
    } else {
        li_class = 'lessImportantSuperUnitListItem';
    }
    let superUnitListItem = `<li class = '${li_class}'>`;
    let superUnitTitle = unitMap[superUnitKey].title;
    let superUnitNumber = unitMap[superUnitKey].number;
    let superUnitMessage = `${superUnitNumber}: ${superUnitTitle}`;
    if (availableContent[superUnitKey].available) {
        let link = `/superUnit/${superUnitKey}`;
        superUnitListItem = superUnitListItem + `<a href = '${link}'>${superUnitMessage}</a>`;
    } else {
        superUnitListItem = superUnitListItem + superUnitMessage;
    }
    superUnitListItem = superUnitListItem + "</li>";
    return superUnitListItem
}


// i need to include the level message...that states the level a student has achieved for each unit!
hbs.registerHelper('listAllUnits',(gradeMap) => {
    let fullList = "<ul class = 'listOfAllUnits'>";
    Object.keys(unitMap).forEach((superUnitKey) => {
        let superUnitListItem = createSuperUnitListItem(superUnitKey, true);
        fullList = fullList + superUnitListItem;
        let unitList = createUnitList(superUnitKey, gradeMap);
        fullList = fullList + unitList;
    });
    fullList = fullList + "</ul>";
    return new hbs.SafeString(fullList)
});




// change it so that the super Unit as at the top...and all other units are at the bottom
/// MUST BE REDONE
hbs.registerHelper('listAllUnitsWithinSuperUnit', (selectedSuperUnitKey, gradeMap) => {
    let header = `<h2>${unitMap[selectedSuperUnitKey].number}: ${unitMap[selectedSuperUnitKey].title}</h2>`;
    let unitList = createUnitList(selectedSuperUnitKey, gradeMap);
    let otherSuperUnitsList = "<ul>";
    Object.keys(unitMap).forEach((superUnitKey) => {
        if (superUnitKey !== selectedSuperUnitKey) { // don't include this unit!
            let superUnitListItem = createSuperUnitListItem(superUnitKey, false);
            otherSuperUnitsList = otherSuperUnitsList + superUnitListItem;
        }
    });
    otherSuperUnitsList = otherSuperUnitsList + "</ul>";
    return new hbs.SafeString(header + unitList + otherSuperUnitsList);
});


hbs.registerHelper('displayQuizLink', (superUnitKey, unitKey, podKey) => {
    let link = "<p class ='quizLink'>";
    if (availableContent[superUnitKey].units[unitKey].pods[podKey].quizzes) {
        let href = `/miniquiz/${superUnitKey}/${unitKey}/${podKey}`;
        link = link + `If you are logged in, click <a href = '${href}'>here</a> to go to the miniquiz.`;
    }
    link = link + '</p>';
    return new hbs.SafeString(link);
});

function makePodListItem(superUnitKey, unitKey, podKey, gradeMap) {
    let listItem = "<li class = 'podListItem'>";
    let letter = unitMap[superUnitKey].units[unitKey].pods[podKey].letter;
    let title = unitMap[superUnitKey].units[unitKey].pods[podKey].title;
    if (unitMap[superUnitKey].units[unitKey].pods[podKey].subtitle) {
        title = title + `: ${unitMap[superUnitKey].units[unitKey].pods[podKey].subtitle}`;
    }
    let score;
    if (gradeMap) {
        score = gradeMap[superUnitKey].units[unitKey].pods[podKey].score;
    } else {
        score = 0;
    }
    let scoreMessage;
    if (score === 0) {
        scoreMessage = '';
    } else if (score >= 18) {
        scoreMessage = '-- PASSED';
    } else {
        scoreMessage = `--${score} out of 20`;
    }
    let available = availableContent[superUnitKey].units[unitKey].pods[podKey].available;
    let link = `/pod/${superUnitKey}/${unitKey}/${podKey}`;
    if (available) {
        listItem = listItem + `<a href = '${link}'>`;
    }
    listItem = listItem + `Pod ${letter}--${title}`;
    if (available) {
        listItem = listItem + '</a>';
    }
    listItem = listItem + scoreMessage;
    listItem = listItem + "</li>";
    return listItem
}

hbs.registerHelper('listOfPods', (superUnitKey, unitKey, gradeMap) => {
    let list = "<ul class = 'podList'>";
    Object.keys(unitMap[superUnitKey].units[unitKey].pods).forEach((podKey) => {
        list = list + makePodListItem(superUnitKey, unitKey, podKey, gradeMap);
    });
    list = list + "</ul>";
    return new hbs.SafeString(list)
});


/// remkate this so that there are links next to the quiz map!
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