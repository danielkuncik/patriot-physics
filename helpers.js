const hbs = require('express-hbs');
const unitMap = require(__dirname + '/public/unit_map');
const { availableContent } = require('./findAvailableContent.js');


hbs.registerHelper('userInfo', (user, section, overallLevel, totalAttempts) => {
    let output;
    if (overallLevel === undefined) {
        overallLevel = 0;
    }
    if (user) {
        output = "<p>Logged in as:</p><ul>";
        output = output + `<li>Name: ${user.name}</li>`;
        output = output + `<li>Section: ${section.name}</li>`;
        output = output + `<li>Level: ${overallLevel}</li>`;
        output = output + `<li>Total Number of MiniQuiz Attempts: ${totalAttempts}</li>`;
        output = output + "</ul>";
    } else {
        output = "<p>Not logged in. Click <a style = 'font-size: 20px' href = '/login'>HERE</a> to login.</p>" +
            "<p>You do NOT need to log in for Step up Day or Summer Work!</p>";
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

// put i giant link if logged in, and a message to login if not
hbs.registerHelper('displayQuizLink', (superUnitKey, unitKey, podKey, loggedIn, ungradedQuizzes) => {
    let link = "<h4 class ='quizLink'>";
    if (availableContent[superUnitKey].units[unitKey].pods[podKey].quizzes) {
        let href = `/miniquiz/${superUnitKey}/${unitKey}/${podKey}`;
        if (!loggedIn) {
            link = link + "You must be logged in to take the miniquiz. Click <a href = '/login'>here</a> to login.";
        } else if (ungradedQuizzes) {
            link = link + "You are still waiting for your last attempt to be graded, so wait a little before taking this quiz again.";
        } else {
            link = link + ` <a href = '${href}'>GO TO MINIQUIZ</a>`;
        }
    } else {
        link = link + 'Sorry, no miniquiz is available yet for this pod.';
    }
    link = link + '</h4>';
    return new hbs.SafeString(link);
});

function makePodListItem(superUnitKey, unitKey, podKey, gradeMap) {
    let listItem = "<li class = 'podListItem'>";
    let letter = unitMap[superUnitKey].units[unitKey].pods[podKey].letter;
    let title = unitMap[superUnitKey].units[unitKey].pods[podKey].title;
    if (unitMap[superUnitKey].units[unitKey].pods[podKey].subtitle) {
        title = title + `: ${unitMap[superUnitKey].units[unitKey].pods[podKey].subtitle}`;
    }
    let score, pending;
    if (gradeMap) {
        score = gradeMap[superUnitKey].units[unitKey].pods[podKey].score;
        pending = gradeMap[superUnitKey].units[unitKey].pods[podKey].pending;
    } else {
        score = 0;
        pending = false;
    }
    let scoreMessage;
    if (score === 0) {
        scoreMessage = '';
    } else if (score >= 18) {
        scoreMessage = '-- PASSED';
    } else {
        scoreMessage = `--${score} out of 20`;
    }
    if (pending) {
        scoreMessage = scoreMessage + '=> New Score Pending';
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

const Months_Dictionary ={
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December"
};

function getDateFromSQL_timestamp(SQL_timestamp) {
    let string = JSON.stringify(SQL_timestamp);
    let year = string.slice(1,5);
    let month = Months_Dictionary[string.slice(6,8)];
    let day = string.slice(9,11);
    return `${month} ${day}, ${year}`;
}

function getPreviousAttemptListItem(previousAttemptObject) {
    let string = "<li>";
    let date = getDateFromSQL_timestamp(previousAttemptObject.tstz);
    if (previousAttemptObject.score) {
        string = string + `You took this quiz on ${date} and scored ${previousAttemptObject.score} out of 20`;
        string = string + "<ul>";
        string = string + `<li><img src = '${previousAttemptObject.image_url_1}' /></li>`;
        string = string + `<li><a href = '${previousAttemptObject.image_url_1}' >DOWNLOAD</a></li>`;
        string = string + `<li>Comment: ${previousAttemptObject.comment}</li>`;
        string = string + "</ul>";
    } else {
        string = string + `You took this quiz on ${date}, and the quiz has not been scored yet.`;
    }
    string = string + "</li>";
    return string
}

hbs.registerHelper('showPreviousQuizAttempts',(previousAttemptsArray) => {
    let string;
    if (previousAttemptsArray === undefined) {
        string = '';
    } else {
        let countMessage;
        if (previousAttemptsArray.length === 1) {
            countMessage = 'once';
        } else if (previousAttemptsArray.length === 2) {
            countMessage = 'twice';
        } else {
            countMessage = `${previousAttemptsArray.length} times`;
        }
        string = `<p>You have taken this quiz ${countMessage}.</p>`;

        string = string + "<ul>";

        previousAttemptsArray.forEach((previousAttempt) => {
            string = string + getPreviousAttemptListItem(previousAttempt);
        });

        string = string + "</ul>";
    }
    return new hbs.SafeString(string);
});

hbs.registerHelper('isQuizNotPassed',(superUnitKey, unitKey, podKey, gradeMap) => {
    if (gradeMap) {
        if (gradeMap[superUnitKey].units[unitKey].pods[podKey].score === 20) {
            return false
        } else {
            return true
        }
    } else {
        return true
    }
});

module.exports = {

};