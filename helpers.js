const hbs = require('express-hbs');
const unitMap = require(__dirname + '/public/unit_map');
const { availableContent } = require('./findAvailableContent.js');
const goals = require(__dirname + '/public/goals');
const dueDatesJSON = require(__dirname + '/dueDates.json');
const { unitMapBy_uuid } = require(__dirname + '/unitMapBy_uuid.js');


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
        // output = output + `<li>Total Number of MiniQuiz Attempts: ${totalAttempts}</li>`;
        output = output + "</ul>";
    } else {
        output = "<p>Not logged in. Click <a style = 'font-size: 20px' href = '/login'>HERE</a> to login.</p>";
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
    let uuid = unitMap[superUnitKey].units[unitKey].uuid;
    if (availableContent[superUnitKey].units[unitKey].available) {
        let unitLink = `/unit/${uuid}`;
        unitListItem = unitListItem + `<a href = '${unitLink}'>${unitMessage}</a>`;
    } else {
        unitListItem = unitListItem + unitMessage;
    }
    unitListItem = unitListItem + "</li>";
    return unitListItem
}

// creates a list of all unit within a super Unit
function createUnitList(superUnitKey, gradeMap) {
    let unitList = "<ul class = 'unitList'>";
    Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
        let unitListItem = createUnitListItem(superUnitKey, unitKey, gradeMap);
        if (unitMap[superUnitKey].units[unitKey].display === false) {
            // pass
        } else {
            unitList = unitList + unitListItem;
        }
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
    let superUnitUuid = unitMap[superUnitKey].uuid;
    if (availableContent[superUnitKey].available) {
        let link = `/superUnit/${superUnitUuid}`;
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
        if (unitMap[superUnitKey].display === false) {
            // pass
        } else {
            let superUnitListItem = createSuperUnitListItem(superUnitKey, true);
            fullList = fullList + superUnitListItem;
            let unitList = createUnitList(superUnitKey, gradeMap);
            fullList = fullList + unitList;
        }
    });
    fullList = fullList + "</ul>";
    return new hbs.SafeString(fullList)
});




// change it so that the super Unit as at the top...and all other unit are at the bottom
/// MUST BE REDONE
hbs.registerHelper('listAllUnitsWithinSuperUnit', (selectedSuperUnitKey, gradeMap) => {
    let header = `<h2>${unitMap[selectedSuperUnitKey].number}: ${unitMap[selectedSuperUnitKey].title}</h2>`;
    let unitList = createUnitList(selectedSuperUnitKey, gradeMap);
    let otherSuperUnitsList = "<ul>";
    Object.keys(unitMap).forEach((superUnitKey) => {
        if (superUnitKey !== selectedSuperUnitKey && unitMap[superUnitKey].display !== false) { // don't include this unit!
            let superUnitListItem = createSuperUnitListItem(superUnitKey, false);
            otherSuperUnitsList = otherSuperUnitsList + superUnitListItem;
        }
    });
    otherSuperUnitsList = otherSuperUnitsList + "</ul>";
    return new hbs.SafeString(header + unitList + otherSuperUnitsList);
});

// put i giant link if logged in, and a message to login if not
hbs.registerHelper('displayQuizLink', (superUnitKey, unitKey, podKey, loggedIn, ungradedQuizzes) => {
    let link = "<h4 class ='quizLink no-print'>";
    const uuid = unitMap[superUnitKey].units[unitKey].pods[podKey].uuid;
    if (availableContent[superUnitKey].units[unitKey].pods[podKey].quizzes) {
        let href = `/miniquizAccess/${uuid}`;
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

function makePodListItem(superUnitKey, unitKey, podKey, gradeMap, cutOutLetter = false, extraMessage) {
    let listItem = "<li class = 'podListItem mb-3'>";
    let letter = unitMap[superUnitKey].units[unitKey].pods[podKey].letter;
    let title = unitMap[superUnitKey].units[unitKey].pods[podKey].title;
    const pod_uuid = unitMap[superUnitKey].units[unitKey].pods[podKey].uuid;
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
        scoreMessage = '-- ACE';
    } else {
        scoreMessage = `--${score} out of 20`;
    }
    if (pending) {
        scoreMessage = scoreMessage + '=> New Score Pending';
    }
    let available = availableContent[superUnitKey].units[unitKey].pods[podKey].available;
    let link = `/pod/${pod_uuid}`;
    if (extraMessage) {
        listItem = listItem + extraMessage;
    }
    if (available) {
        listItem = listItem + `<a href = '${link}'>`;
    }
    if (cutOutLetter) {
        listItem = listItem + title;
    } else {
        listItem = listItem + `Pod ${letter}--${title}`;
    }
    if (available) {
        listItem = listItem + '</a>';
    }
    listItem = listItem + scoreMessage;
    listItem = listItem + "</li>";
    return listItem
}

hbs.registerHelper('individualPodLink',(superUnitKey, unitKey, podKey, gradeMap, extraMessage) => {
    let item = makePodListItem(superUnitKey, unitKey, podKey, gradeMap, true, extraMessage);
    return new hbs.SafeString(item)
});

hbs.registerHelper('listOfPods', (superUnitKey, unitKey, gradeMap) => {
    let list = "<ul class = 'podList'>";
    levelList = {1:[],2:[],3:[],4:[],5:[],6:[]};
    Object.keys(unitMap[superUnitKey].units[unitKey].pods).forEach((podKey) => {
        let level = unitMap[superUnitKey].units[unitKey].pods[podKey].level;
        levelList[level].push(podKey);
        // list = list + makePodListItem(superUnitKey, unitKey, podKey, gradeMap);
    });
    Object.keys(levelList).forEach((level) => {
      list = list + "<li class = 'mb-3'>";
      list = list + `<h5>Level ${level}</h5>`;
      list = list + "<ul>";
      levelList[level].forEach((podKey) => {
        list = list + makePodListItem(superUnitKey, unitKey, podKey, gradeMap);
      });
      list = list + "</ul></li>";
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

hbs.registerHelper('printUnitLink', (superUnitKey, unitKey, gradeMap, goal) => {
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
    const uuid = unit.uuid;

    string = string + `<a href = '/unit/${uuid}'>${unitNumber}-${unitTitle}</a>`;

    if (level || goal) {
        string = string + '<ul>';
        if (level) {
            string = string + `<li>Current Level: ${level}</li>`;
        } else if (!level && goal && gradeMap) {
            string = string + "<li>Current Level: 0</li>";
        }
        if (grade) {
            string = string + `<li>Current Grade: ${grade}</li>`;
        }
        if (goal) {
            string = string + `<li>Goal: Level ${goal}</li>`;
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

const Months_Dictionary = {
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

function displayDateFromString(dateString) {
    let dateArray = dateString.split('-');
    const month = Months_Dictionary[dateArray[0]];
    const year = dateArray[2];
    const day = dateArray[1];
    return `${month} ${day}, ${year}`;
}

function getDateFromSQL_timestamp(SQL_timestamp) {
    let string = JSON.stringify(SQL_timestamp);
    let year = string.slice(1,5);
    let month = Months_Dictionary[string.slice(6,8)];
    let day = string.slice(9,11);
    return `${month} ${day}, ${year}`;
}

function getTypeForUrl(url) {
    if (url === undefined || url === null || url === "") {
        return undefined
    } else if (url.slice(-4) === 'heic') {
        return 'link';
    }else if (url.slice(-3) === 'pdf') {
        return 'link';
    } else {
        return 'image';
    }

}

function processQuizAttempt(attempt) {
    let type1, type2, type3, url1, url2, url3;
    url1 = attempt.image_url_1;
    url2 = attempt.image_url_2;
    url3 = attempt.image_url_3;

    type1 = getTypeForUrl(url1);
    type2 = getTypeForUrl(url2);
    type3 = getTypeForUrl(url3);

    attempt.url1 = url1;
    attempt.type1 = type1;
    attempt.url2 = url2;
    attempt.type2 = type2;
    attempt.url3 = url3;
    attempt.type3 = type3;

    return attempt
}

hbs.registerHelper('displayDueDates', (courseLevel, gradeMap) => {
    const dueDates = dueDatesJSON[courseLevel];
    let string = "";
    if (dueDates) {
        Object.keys(dueDates).forEach((dueDateKey) => {
          let obj = {
              "homework": [],
              "inClass": [],
              "practicePages": []
          };
            const dateDisplay = displayDateFromString(dueDateKey);
            string = string + `<h2>Can retake until ${dateDisplay}</h2>`;
            string = string + "<div class = 'ml-4 mb-4'>";
            Object.keys(dueDates[dueDateKey]).forEach((pod_uuid) => {
                const inClassQuiz = dueDates[dueDateKey][pod_uuid].inClass;
                let displayObject;
                if (unitMapBy_uuid[pod_uuid].type === "pod") {
                    let superUnitKey = unitMapBy_uuid[pod_uuid].superUnitKey;
                    let unitKey = unitMapBy_uuid[pod_uuid].unitKey;
                    let podKey = unitMapBy_uuid[pod_uuid].podKey;
                    let podObject = unitMap[superUnitKey].units[unitKey].pods[podKey];
                    let letter = podObject.letter;
                    let title = podObject.title;
                    if (podObject.subtitle) {
                        title = title + `: ${podObject.subtitle}`;
                    }
                    let podNumber = unitMap[superUnitKey].number * 100 + unitMap[superUnitKey].units[unitKey].number;
                    let displayTitle = `${podNumber}-${letter}: ${title}`;

                    let score, practiceScore, pending, practicePending;
                    if (gradeMap) {
                        score  = gradeMap[superUnitKey].units[unitKey].pods[podKey].score;
                        practiceScore = gradeMap[superUnitKey].units[unitKey].pods[podKey].practiceScore;
                        pending = gradeMap[superUnitKey].units[unitKey].pods[podKey].pending;
                        practicePending = gradeMap[superUnitKey].units[unitKey].pods[podKey].practicePending;
                    }
                    let scoreDisplay;
                    if (score === 20) {
                        scoreDisplay = 'ACE';
                    } else if (score > 0) {
                        scoreDisplay = `${score} out of 20`;
                    } else {
                        scoreDisplay = undefined;
                    }

                    let practiceDisplay;
                    if (practiceScore === 1) {
                        practiceDisplay = 'half done';
                    } else if (practiceScore === 2) {
                        practiceDisplay = 'DONE';
                    } else {
                        practiceDisplay = undefined;
                    }
                    let link = `/pod/${pod_uuid}`;
                    displayObject = {
                        "displayTitle": displayTitle,
                        "scoreDisplay": scoreDisplay,
                        "practiceDisplay": practiceDisplay,// this will be where the practice score is entered
                        "link": link,
                        "newScorePending": pending,
                        "newPracticeScorePending": practicePending
                    }
                } else {
                    // error
                }
                if (inClassQuiz) {
                    obj.inClass.push(displayObject);
                } else {
                    obj.homework.push(displayObject);
                }
                if (dueDates[dueDateKey][pod_uuid].practice) {
                    obj.practicePages.push(displayObject);
                }
            });

            if (obj.practicePages.length > 0) {
              string = string + '<h3>Practice Pages</h3>';
              string = string + "<ol>";
              obj.practicePages.forEach((displayObject) => {
                  string = string + "<li>";
                  string = string + `<a href = '${displayObject.link}'>${displayObject.displayTitle}</a>`;
                  if (displayObject.practiceDisplay) {
                      string = string + `: ${displayObject.practiceDisplay}`;
                  }
                  if (displayObject.newPracticeScorePending) {
                      string = string + '=> New Practice Score Pending';
                  }
                  string = string + "</li>";
              });
              string = string + "</ol>";
            }

            if (obj.homework.length > 0) {
              string = string + '<h3>Homework Quizzes</h3>';
              string = string + `<ol start = '${obj.practicePages.length + 1}'>`;
              obj.homework.forEach((displayObject) => {
                  string = string + "<li>";
                  string = string + `<a href = '${displayObject.link}'>${displayObject.displayTitle}</a>`;
                  if (displayObject.scoreDisplay) {
                      string = string + `: ${displayObject.scoreDisplay}`;
                  }
                  if (displayObject.newScorePending) {
                      string = string + '=> New Score Pending';
                  }
                  string = string + "</li>";
              });
              string = string + "</ol>";
            }


            if (obj.inClass.length > 0) {
              string = string + '<h3>In Class Quizzes</h3>';
              string = string + `<ol start = '${obj.practicePages.length + obj.homework.length + 1}'>`;
              obj.inClass.forEach((displayObject) => {
                  string = string + "<li>";
                  string = string + `<a href = '${displayObject.link}'>${displayObject.displayTitle}</a>`;
                  if (displayObject.score) {
                      string = string + displayObject.score;
                  }
                  string = string + "</li>";
              });
              string = string + "</ol>";
            }

            string = string + "</div>";

        });
    } else {
        string = '<p>error</p>';
    }
    return new hbs.SafeString(string)
});

function getPreviousAttemptListItem(previousAttemptObject) {
    let string = "<li>";
    let thisAttempt = processQuizAttempt(previousAttemptObject);
    let date = getDateFromSQL_timestamp(thisAttempt.tstz);
    if (thisAttempt.score) {
        string = string + `You took this quiz on ${date} and scored ${thisAttempt.score} out of 20`;
        string = string + "<ul>";
        if (thisAttempt.url1) {
            if (thisAttempt.type1 === 'image') {
                string = string + `<li><img src = '${thisAttempt.url1}' /></li>`;
            } else if (thisAttempt.type1 === 'link') {
                string = string + `<li><a href = '${thisAttempt.url1}' >Access Page 1</a></li>`;
            }
        }
        if (thisAttempt.url2) {
            if (thisAttempt.type2 === 'image') {
                string = string + `<li><img src = '${thisAttempt.url2}' /></li>`;
            } else if (thisAttempt.type2 === 'link') {
                string = string + `<li><a href = '${thisAttempt.url2}' >Access Page 1</a></li>`;
            }
        }
        if (thisAttempt.url3) {
            if (thisAttempt.type3 === 'image') {
                string = string + `<li><img src = '${thisAttempt.url3}' /></li>`;
            } else if (thisAttempt.type3 === 'link') {
                string = string + `<li><a href = '${thisAttempt.url3}' >Access Page 1</a></li>`;
            }
        }
        string = string + `<li>Comment: ${thisAttempt.comment}</li>`;
        string = string + "</ul>";
    } else {
        string = string + `You took this quiz on ${date}, and the quiz has not been scored yet.`;
    }
    string = string + "</li>";
    return new hbs.SafeString(string)
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

hbs.registerHelper('getGoalsObject', (courseLevel, gradeMap) => {
    const goalsObject = goals[courseLevel];
    let refinedGoalsObject = {
        superUnits: {}
    };
    Object.keys(goalsObject).forEach((superUnitKey) => {
        if (unitMap[superUnitKey]) {
            refinedGoalsObject.superUnits[superUnitKey] = {};
            refinedGoalsObject.superUnits[superUnitKey].link = `/superUnit/${unitMap[superUnitKey].uuid}`;
            refinedGoalsObject.superUnits[superUnitKey].title = `${unitMap[superUnitKey].number}: ${unitMap[superUnitKey].title}`;
            refinedGoalsObject.superUnits[superUnitKey].units = {};
            Object.keys(goalsObject[superUnitKey]).forEach((unitKey) => {
                refinedGoalsObject.superUnits[superUnitKey].units[unitKey] = {};
                if (unitMap[superUnitKey].units[unitKey]) {
                    refinedGoalsObject.superUnits[superUnitKey].units[unitKey].link = `/unit/${unitMap[superUnitKey].units[unitKey].uuid}`;
                    const number = unitMap[superUnitKey].number * 100 + unitMap[superUnitKey].units[unitKey].number;
                    refinedGoalsObject.superUnits[superUnitKey].units[unitKey].title = `${number}-${unitMap[superUnitKey].units[unitKey].title}`;
                }
                if (gradeMap && gradeMap[superUnitKey] && gradeMap[superUnitKey].units[unitKey] && gradeMap[superUnitKey].units[unitKey].level) {
                    refinedGoalsObject.superUnits[superUnitKey].units[unitKey].currentLevel = gradeMap[superUnitKey].units[unitKey].level;
                }
                refinedGoalsObject.superUnits[superUnitKey].units[unitKey].levelGoals = {};
                Object.keys(goalsObject[superUnitKey][unitKey]).forEach((levelGoal) => {
                    refinedGoalsObject.superUnits[superUnitKey].units[unitKey].levelGoals[levelGoal] = {
                        'dueDateString': goalsObject[superUnitKey][unitKey][levelGoal]
                    }
                });
            });
        }
    });
    let string = JSON.stringify(refinedGoalsObject);
    let correctString = string.replace(/'/g,"\\'"); // replaces quotes with backslash quotes
    return correctString
});

hbs.registerHelper('bringUnitMapToFrontEnd', () => {
    let string = JSON.stringify(unitMap);
    let correctString = string.replace(/'/g,"\\'"); // replaces quotes with backslash quotes
    return correctString
});


hbs.registerHelper('quizLinkNew', (loggedIn, quizRequirementObject, uuid) => {
    let message, link, lateCode = false;
    if (!loggedIn) {
        message = 'You must be logged in to take the quiz.';
        link = false;
        // add log in link
    } else if (!quizRequirementObject.required) {
        message = 'This quiz is not required for your class at this time.';
        link = false;
    } else if (quizRequirementObject.currentTopScore === 20) {
        message = 'You already ACED this quiz! Great job!';
        link = false;
    } else if (!quizRequirementObject.inClass && quizRequirementObject.overdue && quizRequirementObject.currentTopScore > 0 && !quizRequirementObject.pending) {
        message = `Your top score on this quiz is ${quizRequirementObject.currentTopScore} out of 20. It is passed the date to retake the quiz.`;
        link = 'Access quiz with late code';
        lateCode = true;
    } else if (!quizRequirementObject.inClass && !quizRequirementObject.overdue && quizRequirementObject.currentTopScore > 0 && !quizRequirementObject.pending) {
        message = `Your top score on this quiz is ${quizRequirementObject.currentTopScore} out of 20. You can retake this quiz until ${quizRequirementObject.dueDate}.`;
        link = 'Go to quiz.';
    } else if (!quizRequirementObject.inClass && quizRequirementObject.overdue && quizRequirementObject.currentTopScore === 0 && !quizRequirementObject.pending) {
        message = `You have not yet taken this quiz. It is passed the date to take it.`;
        link = 'Access quiz with late code';
        lateCode = true;
    } else if (!quizRequirementObject.inClass && !quizRequirementObject.overdue && quizRequirementObject.currentTopScore === 0 && !quizRequirementObject.pending) {
        message = `You have not yet take this quiz. You can take this quiz until ${quizRequirementObject.dueDate}.`;
        link = 'Go to quiz.';

        // pending homework quizzes
    } else if (!quizRequirementObject.inClass && quizRequirementObject.overdue && quizRequirementObject.currentTopScore > 0 && quizRequirementObject.pending) {
        message = `Your top score on this quiz is ${quizRequirementObject.currentTopScore} out of 20, and you are waiting for a new score. It is passed the date to retake the quiz.`;
        link = false;
    } else if (!quizRequirementObject.inClass && !quizRequirementObject.overdue && quizRequirementObject.currentTopScore > 0 && quizRequirementObject.pending) {
        message = `Your top score on this quiz is ${quizRequirementObject.currentTopScore} out of 20, and you are waiting for a new score. You can retake this quiz until ${quizRequirementObject.dueDate}.`;
        link = false;
    } else if (!quizRequirementObject.inClass && quizRequirementObject.overdue && quizRequirementObject.currentTopScore === 0 && quizRequirementObject.pending) {
        message = `You took this quiz once, and you are waiting for your score. It is passed the date to take it.`;
        link = false;
    } else if (!quizRequirementObject.inClass && !quizRequirementObject.overdue && quizRequirementObject.currentTopScore === 0 && quizRequirementObject.pending) {
        message = `You took this quiz once, and you are waiting for your score. You can retake this quiz until ${quizRequirementObject.dueDate}.`;
        link = false;

        // in class quizzes
    } else if (quizRequirementObject.inClass && quizRequirementObject.overdue && quizRequirementObject.currentTopScore > 0) {
        message = `Your top score on this quiz is ${quizRequirementObject.currentTopScore} out of 20. This was an in-class quiz, but it is passed the date to retake the quiz.`;
        link = 'Access quiz with late code AND in class code.';
        lateCode = true;
    } else if (quizRequirementObject.inClass && !quizRequirementObject.overdue && quizRequirementObject.currentTopScore > 0) {
        message = `Your top score on this quiz is ${quizRequirementObject.currentTopScore} out of 20. You can retake this quiz in class or during extra time until ${quizRequirementObject.dueDate}.`;
        link = 'Access quiz with in class code.';
    } else if (quizRequirementObject.inClass && quizRequirementObject.overdue && quizRequirementObject.currentTopScore === 0) {
        message = `You have not yet taken this quiz. This was an in class quiz, but it is passed the date to take it.`;
        link = 'Access quiz with late code AND in class code.';
        lateCode = true;
    } else if (quizRequirementObject.inClass && !quizRequirementObject.overdue && quizRequirementObject.currentTopScore === 0) {
        message = `You have not yet taken this quiz. You can take this quiz in class until ${quizRequirementObject.dueDate}.`;
        link = 'Access quiz with in class code.';
    }
    // how do i handle it if another code is required???
    let string = `<p>${message}</p>`;
    if (link) {
        string = string + `<a href = '/quizAccess/${uuid}'>GO TO QUIZ</a>`;
    }
    return new hbs.SafeString(string)
});


hbs.registerHelper('practiceLink', (loggedIn, practiceObject, uuid) => {
    // required, practicePending, currentTopScore, overdue, dueDate
    let message, link;
    if (!loggedIn) {
        message = 'You must log in to submit the practice page.';
        link = false;
    } else if (!practiceObject.required) {
        message = 'This practice page is not required for your class at this time.'
    } else if (practiceObject.currentTopScore === 2) {
        message = 'You have already completed this practice page.';
        link = false;
    } else if (practiceObject.overdue && practiceObject.currentTopScore === 1 && !practiceObject.practicePending) {
        message = 'The practice page was already due. You received half credit.';
        link = false;
    } else if (practiceObject.overdue && practiceObject.currentTopScore === 1 && practiceObject.practicePending) {
        message = 'The practice page was already due. You received half credit so far, but your resubmission is pending';
        link = false;
    } else if (practiceObject.overdue && practiceObject.currentTopScore === 0 && practiceObject.practicePending) {
        message = 'The practice page was already due. You did not receive credit.';
        link = false;
    } else if (practiceObject.overdue && practiceObject.currentTopScore === 0 && !practiceObject.practicePending) {
        message = 'The practice page was already due. You have not received credit so far, but your submission is pending.';
        link = false;
    } else if (!practiceObject.overdue && practiceObject.currentTopScore === 1 && practiceObject.practicePending) {
        message = `This practice page is due on ${practiceObject.dueDate}. So far, you have received half credit, and your resubmission is pending.`;
        link = true;
    } else if (!practiceObject.overdue && practiceObject.currentTopScore === 1 && !practiceObject.practicePending) {
        message = `This practice page is due on ${practiceObject.dueDate}. So far, you have received half credit. You may resubmit new work to potentially receive full credit.`;
        link = true;
    } else if (!practiceObject.overdue && practiceObject.currentTopScore === 0 && practiceObject.practicePending) {
        message = `This practice page is due on ${practiceObject.dueDate}. Your submission is pending.`;
        link = false;
    } else if (!practiceObject.overdue && practiceObject.currentTopScore === 0 && !practiceObject.practicePending) {
        message = `This practice page is due on ${practiceObject.dueDate}. You have not submitted anything so far.`;
        link = true;
    }

    let string = `<p>${message}</p>`;
    if (link) {
        string = string + `<a href = '/practiceSubmission/${uuid}'>SUBMIT PRACTICE PAGE</a>`;
        if (practiceObject.practiceComment) {
            string = string + `<p>Comment on Previous Submission: ${quizRequirementObject.practiceComment}</p>`;
        }
    }
    return new hbs.SafeString(string);
});


module.exports = {

};
