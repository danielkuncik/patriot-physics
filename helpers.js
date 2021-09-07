const hbs = require('express-hbs');
const unitMap = require(__dirname + '/public/unit_map');
const { availableContent } = require('./findAvailableContent.js');
const goals = require(__dirname + '/public/goals');
const dueDatesJSON = require(__dirname + '/dueDates.json');
const { idLibrary } = require(__dirname + '/idLibrary.js');

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

// repeated, also in display
function getUnitNumberString(superUnitNumber, unitNumber) {
    const unitNumberNum = unitNumber + superUnitNumber * 100;
    let unitNumberString;
    if (unitNumberNum < 10) {
        unitNumberString = `00${unitNumberNum}`;
    } else if (unitNumberNum < 100) {
        unitNumberString = `0${unitNumberNum}`;
    } else {
        unitNumberString = unitNumberNum;
    }
    return unitNumberString
}


function createUnitListItem(superUnitKey, unitKey, gradeMap) {
    let levelMessage = '';
    if (gradeMap && gradeMap[superUnitKey].units[unitKey].level > 0) {
        levelMessage = `--Level: ${gradeMap[superUnitKey].units[unitKey].level}`;
    }
    let unitListItem = "<li class = 'unitListItem'>";
    let unitTitle = unitMap[superUnitKey].units[unitKey].title;
    let unitNumber = getUnitNumberString(unitMap[superUnitKey].number, unitMap[superUnitKey].units[unitKey].number);
    let unitMessage = `${unitNumber}: ${unitTitle}${levelMessage}`;
    let id = unitMap[superUnitKey].units[unitKey].id;
    if (availableContent[superUnitKey].units[unitKey].available) {
        let unitLink = `/unit/${id}`;
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
    let id = unitMap[superUnitKey].id;
    if (availableContent[superUnitKey]) {
        let link = `/superUnit/${id}`;
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
    const pod_id = unitMap[superUnitKey].units[unitKey].pods[podKey].id;
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
    let scoreMessage, color;
    if (score === 0) {
        scoreMessage = '';
        color = 'danger';
    } else if (score >= 18) {
        scoreMessage = '-- ACE';
        color = 'success';
    } else if (score >= 14) {
        scoreMessage = `--${score} out of 20`;
        color = 'warning';
    } else {
        scoreMessage = `--${score} out of 20`;
        color = 'danger';
    }
    if (pending) {
        scoreMessage = scoreMessage + '=> New Score Pending';
        color = 'muted';
    }
    let available = availableContent[superUnitKey].units[unitKey].pods[podKey].available;
    let link = `/pod/${pod_id}`;
    if (extraMessage) {
        listItem = listItem + extraMessage;
    }
    if (available) {
        listItem = listItem + `<a href = '${link}' class = 'text-${color}'>`;
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


hbs.registerHelper('isAP2021', (courseLevel, year) => {
    let result;
    if (courseLevel === 'AP' && year === 2021) {
        result = true;
    } else {
        result = false;
    }
    return result
});

hbs.registerHelper('isAP2022', (courseLevel, year) => {
    let result;
    if (courseLevel === 'AP' && year === 2022) {
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
    "1": "January",
    "2": "February",
    "3": "March",
    "4": "April",
    "5": "May",
    "6": "June",
    "7": "July",
    "8": "August",
    "9": "September",
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
    let monthNumber = String(Number(string.slice(6,8)));
    let month = Months_Dictionary[monthNumber];
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

function processAttemptObject(attemptObject, maxImages = 6) {
    let urlList = [];
    let i;
    for (i = 0; i < maxImages; i++) {
        let url = attemptObject[`image_url_${i+1}`];
        if (url) {
            urlList.push(url);
        }
    }
    return {
        urlList: urlList,
        score: attemptObject.score,
        comment: attemptObject.comment,
        timeStamp: attemptObject.tstz
    }
}

function displayImageUrl(url, number) {
    let type = getTypeForUrl(url);
    string = "";
    if (type === 'image') {
        string = string + `<img src = '${url}' />`;
    } else if (type === 'link') {
        string = string + `<a href = '${url}' >Access Image ${number}</a>`;
    }
    return string
}

// tested 3-9-2021!
function displayAttempt(attemptObject, practiceOrQuiz) {
    let processedObject = processAttemptObject(attemptObject);
    let numCols = processedObject.urlList.length + 1;
    let numRows = Math.ceil(numCols / 2);
    let date = getDateFromSQL_timestamp(processedObject.timeStamp);
    let message;
    if (practiceOrQuiz === 'quiz') {
        if (!processedObject.score) {
            message = `You took this quiz on ${date} and your score is still pending`;
        } else {
            message = `You took this quiz on ${date} and scored ${processedObject.score} out of 20`;
        }
    } else if (practiceOrQuiz === 'practice') {
        let scoreMessage;
        if (processedObject.score === 2) {
            scoreMessage = 'you received full credit';
        } else if (processAttemptObject.score === 1) {
            scoreMessage = 'you received half credit';
        } else {
            scoreMessage = 'you received no credit';
        }
        message = `You submitted this practice page on ${date}, and ${scoreMessage}`;
    }
    let string = "";

    let imageNumber = 0;

    string = string + "<div class = 'row m-2'>";

    string = string + "<div class = 'col-md-6'>";
    string = string + `<h5>${message}</h5>`;
    if (processedObject.comment) {
        string = string + `<h5>Comment: ${processedObject.comment}</h5>`;
    }
    string = string + "</div>";

    string = string + "<div class = 'col-md-6'>";
    string = string + displayImageUrl(processedObject.urlList[0], 1);
    imageNumber++;
    string = string + "</div>";

    string = string + "</div>";

    let j;
    for (j = 1; j < numRows; j++) {
        string = string + "<div class = 'row m-2'>";

        string = string + "<div class = 'col-md-6'>";
        if (imageNumber < processedObject.urlList.length) {
            string = string + displayImageUrl(processedObject.urlList[imageNumber], imageNumber + 1);
            imageNumber++;
        }
        string = string + "</div>";

        string = string + "<div class = 'col-md-6'>";
        if (imageNumber < processedObject.urlList.length) {
            string = string + displayImageUrl(processedObject.urlList[imageNumber], imageNumber + 1);
            imageNumber++;
        }
        string = string + "</div>";

        string = string + "</div>";
    }
    return string
}

function processPracticeAttempt(attempt) {
    let type1, type2, type3, type4, type5, type6, url1, url2, url3, url4, url5, ulr6;
    url1 = attempt.image_url_1;
    url2 = attempt.image_url_2;
    url3 = attempt.image_url_3;
    url4 = attempt.image_url_4;
    url5 = attempt.image_url_5;


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

// can be removed later
function stripGradeInfo(dueDateObject) {
    let newObject = {};
    Object.keys(dueDateObject).forEach((dueDate) => {
        let newDueDateObject = {};
        Object.keys(dueDateObject[dueDate]).forEach((gradeExpectation) => {
            Object.keys(dueDateObject[dueDate][gradeExpectation]).forEach((pod_id) => {
                newDueDateObject[pod_id] = dueDateObject[dueDate][gradeExpectation][pod_id];
            });
        });
        newObject[dueDate] = newDueDateObject;
    });
    return newObject
}

hbs.registerHelper('displayDueDatesForJune2021', (courseLevel, year, gradeMap) => {
    const dueDates = stripGradeInfo(dueDatesJSON[`${courseLevel}-${year}`]);
    let string = "";
    const summerMessage = "Attempt By";
    const normalMessage = "Please take before";
    if (dueDates) {
        Object.keys(dueDates).forEach((dueDateKey) => {
            let obj = {
                "homework": [],
                "inClass": [],
                "practicePages": []
            };
            const dateDisplay = displayDateFromString(dueDateKey);
            let message;
            if (courseLevel === 'summer' && (dueDateKey === '9-1-2021' || dueDateKey === '6-18-2021')) {
                message = summerMessage;
            } else {
                message = normalMessage;
            }
            string = string + `<h2>${message} ${dateDisplay}</h2>`;
            string = string + "<div class = 'ml-4 mb-4'>";
            Object.keys(dueDates[dueDateKey]).forEach((pod_id) => {
                const inClassQuiz = dueDates[dueDateKey][pod_id].inClass;
                const noQuiz = dueDates[dueDateKey][pod_id].noQuiz;
                let displayObject;
                if (idLibrary[pod_id].type === "pod") {
                    let superUnitKey = idLibrary[pod_id].superUnitKey;
                    let unitKey = idLibrary[pod_id].unitKey;
                    let podKey = idLibrary[pod_id].podKey;
                    let podObject = unitMap[superUnitKey].units[unitKey].pods[podKey];
                    let letter = podObject.letter;
                    let title = podObject.title;
                    if (podObject.subtitle) {
                        title = title + `: ${podObject.subtitle}`;
                    }
                    let podNumber = getUnitNumberString(unitMap[superUnitKey].number, unitMap[superUnitKey].units[unitKey].number);
                    let displayTitle = `${podNumber}-${letter}: ${title}`;

                    let score, practiceScore, pending, practicePending;
                    if (gradeMap) {
                        score  = gradeMap[superUnitKey].units[unitKey].pods[podKey].score;
                        practiceScore = gradeMap[superUnitKey].units[unitKey].pods[podKey].practiceScore;
                        pending = gradeMap[superUnitKey].units[unitKey].pods[podKey].pending;
                        practicePending = gradeMap[superUnitKey].units[unitKey].pods[podKey].practicePending;
                    }
                    let scoreDisplay, scoreColor;
                    if (score === 20) {
                        scoreDisplay = 'ACE';
                        scoreColor = 'success'
                    } else if (score >= 13) {
                        scoreDisplay = `${score} out of 20`;
                        scoreColor = 'warning';
                    } else if (score > 0) {
                        scoreDisplay = `${score} out of 20`;
                        scoreColor = 'danger';
                    } else if (score === 0) {
                        scoreDisplay = '0 out of 20 (not yet taken)';
                        scoreColor = 'danger'
                    } else {
                        scoreDisplay = undefined;
                        scoreColor = undefined;
                    }
                    if (pending) {
                        scoreColor = 'muted';
                    }
                    /// what to do if not logged in

                    let practiceDisplay, practiceColor;
                    if (practiceScore === 1) {
                        practiceDisplay = 'half credit';
                        practiceColor = 'danger';
                    } else if (practiceScore === 2) {
                        practiceDisplay = 'DONE';
                        practiceColor = 'success';
                    } else if (practiceScore === 0) {
                        practiceDisplay = 'no credit (not yet done)';
                        practiceColor = 'danger';
                    } else {
                        practiceDisplay = undefined;
                        practiceColor = undefined;
                    }
                    if (practicePending) {
                        practiceColor = 'muted';
                    }
                    let link = `/pod/${pod_id}`;
                    displayObject = {
                        "displayTitle": displayTitle,
                        "scoreDisplay": scoreDisplay,
                        "scoreColor": scoreColor,
                        "practiceDisplay": practiceDisplay,// this will be where the practice score is entered
                        "practiceColor": practiceColor,
                        "link": link,
                        "newScorePending": pending,
                        "newPracticeScorePending": practicePending
                    }
                } else {
                    // error
                }
                if (noQuiz) {
                    // pass
                } else if (inClassQuiz) {
                    obj.inClass.push(displayObject);
                } else {
                    obj.homework.push(displayObject);
                }
                if (dueDates[dueDateKey][pod_id].practice) {
                    obj.practicePages.push(displayObject);
                }
            });

            if (obj.practicePages.length > 0) {
                string = string + '<h3>Practice Pages</h3>';
                string = string + "<ol>";
                obj.practicePages.forEach((displayObject) => {
                    string = string + `<li class = 'text-${displayObject.practiceColor} mb-2'>`;
                    let text = displayObject.displayTitle;
                    if (displayObject.practiceDisplay) {
                        text = text + `: ${displayObject.practiceDisplay}`;
                    }
                    if (displayObject.newPracticeScorePending) {
                        text = text + '=> New Practice Score Pending';
                    }

                    string = string + `<a class = 'text-${displayObject.practiceColor}' href = '${displayObject.link}'>${text}</a>`;
                    string = string + "</li>";
                });
                string = string + "</ol>";
            }

            if (obj.homework.length > 0) {
                string = string + '<h3>Homework Quizzes</h3>';
                string = string + `<ol start = '${obj.practicePages.length + 1}'>`;
                obj.homework.forEach((displayObject) => {
                    string = string + `<li class = 'text-${displayObject.scoreColor} mb-2'>`;
                    let text = displayObject.displayTitle;
                    if (displayObject.scoreDisplay) {
                        text = text + `: ${displayObject.scoreDisplay}`;
                    }
                    if (displayObject.newScorePending) {
                        text = text + '=> New Score Pending';
                    }
                    string = string + `<a class = 'text-${displayObject.scoreColor}' href = '${displayObject.link}'>${text}</a>`;
                    string = string + "</li>";
                });
                string = string + "</ol>";
            }


            if (obj.inClass.length > 0) {
                string = string + '<h3>In Class Quizzes</h3>';
                string = string + `<ol start = '${obj.practicePages.length + obj.homework.length + 1}'>`;
                obj.inClass.forEach((displayObject) => {
                    string = string + `<li class = 'text-${displayObject.scoreColor} mb-2'>`;
                    let text = displayObject.displayTitle;
                    if (displayObject.scoreDisplay) {
                        text = text + `: ${displayObject.scoreDisplay}`;
                    }

                    string = string + `<a class = 'text-${displayObject.scoreColor}' href = '${displayObject.link}'>${text}</a>`;
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

hbs.registerHelper('displayDueDates', (courseLevel, year, gradeMap) => {
    const dueDates = dueDatesJSON[`${courseLevel}-${year}`];
    let string = "";
    const summerMessage = "Attempt By";
    const normalMessage = "Can retake until";
    if (dueDates) {
        Object.keys(dueDates).forEach((dueDateKey) => {
          let obj = {
              "homework": [],
              "inClass": [],
              "practicePages": []
          };
            const dateDisplay = displayDateFromString(dueDateKey);
            let message;
            if (courseLevel === 'summer' && (dueDateKey === '9-1-2021' || dueDateKey === '6-18-2021')) {
                message = summerMessage;
            } else {
                message = normalMessage;
            }
            string = string + `<h2>${message} ${dateDisplay}</h2>`;
            string = string + "<div class = 'ml-4 mb-4'>";
            Object.keys(dueDates[dueDateKey]).forEach((pod_id) => {
                const inClassQuiz = dueDates[dueDateKey][pod_id].inClass;
                const noQuiz = dueDates[dueDateKey][pod_id].noQuiz;
                let displayObject;
                if (idLibrary[pod_id].type === "pod") {
                    let superUnitKey = idLibrary[pod_id].superUnitKey;
                    let unitKey = idLibrary[pod_id].unitKey;
                    let podKey = idLibrary[pod_id].podKey;
                    let podObject = unitMap[superUnitKey].units[unitKey].pods[podKey];
                    let letter = podObject.letter;
                    let title = podObject.title;
                    if (podObject.subtitle) {
                        title = title + `: ${podObject.subtitle}`;
                    }
                    let podNumber = getUnitNumberString(unitMap[superUnitKey].number, unitMap[superUnitKey].units[unitKey].number);
                    let displayTitle = `${podNumber}-${letter}: ${title}`;

                    let score, practiceScore, pending, practicePending;
                    if (gradeMap) {
                        score  = gradeMap[superUnitKey].units[unitKey].pods[podKey].score;
                        practiceScore = gradeMap[superUnitKey].units[unitKey].pods[podKey].practiceScore;
                        pending = gradeMap[superUnitKey].units[unitKey].pods[podKey].pending;
                        practicePending = gradeMap[superUnitKey].units[unitKey].pods[podKey].practicePending;
                    }
                    let scoreDisplay, scoreColor;
                    if (score === 20) {
                        scoreDisplay = 'ACE';
                        scoreColor = 'success'
                    } else if (score >= 13) {
                        scoreDisplay = `${score} out of 20`;
                        scoreColor = 'warning';
                    } else if (score > 0) {
                        scoreDisplay = `${score} out of 20`;
                        scoreColor = 'danger';
                    } else if (score === 0) {
                        scoreDisplay = '0 out of 20 (not yet taken)';
                        scoreColor = 'danger'
                    } else {
                        scoreDisplay = undefined;
                        scoreColor = undefined;
                    }
                    if (pending) {
                        scoreColor = 'muted';
                    }
                    /// what to do if not logged in

                    let practiceDisplay, practiceColor;
                    if (practiceScore === 1) {
                        practiceDisplay = 'half credit';
                        practiceColor = 'danger';
                    } else if (practiceScore === 2) {
                        practiceDisplay = 'DONE';
                        practiceColor = 'success';
                    } else if (practiceScore === 0) {
                        practiceDisplay = 'no credit (not yet done)';
                        practiceColor = 'danger';
                    } else {
                        practiceDisplay = undefined;
                        practiceColor = undefined;
                    }
                    if (practicePending) {
                        practiceColor = 'muted';
                    }
                    let link = `/pod/${pod_id}`;
                    displayObject = {
                        "displayTitle": displayTitle,
                        "scoreDisplay": scoreDisplay,
                        "scoreColor": scoreColor,
                        "practiceDisplay": practiceDisplay,// this will be where the practice score is entered
                        "practiceColor": practiceColor,
                        "link": link,
                        "newScorePending": pending,
                        "newPracticeScorePending": practicePending
                    }
                } else {
                    // error
                }
                if (noQuiz) {
                    // pass
                } else if (inClassQuiz) {
                    obj.inClass.push(displayObject);
                } else {
                    obj.homework.push(displayObject);
                }
                if (dueDates[dueDateKey][pod_id].practice) {
                    obj.practicePages.push(displayObject);
                }
            });

            if (obj.practicePages.length > 0) {
              string = string + '<h3>Practice Pages</h3>';
              string = string + "<ol>";
              obj.practicePages.forEach((displayObject) => {
                  string = string + `<li class = 'text-${displayObject.practiceColor} mb-2'>`;
                  let text = displayObject.displayTitle;
                  if (displayObject.practiceDisplay) {
                      text = text + `: ${displayObject.practiceDisplay}`;
                  }
                  if (displayObject.newPracticeScorePending) {
                      text = text + '=> New Practice Score Pending';
                  }

                  string = string + `<a class = 'text-${displayObject.practiceColor}' href = '${displayObject.link}'>${text}</a>`;
                  string = string + "</li>";
              });
              string = string + "</ol>";
            }

            if (obj.homework.length > 0) {
              string = string + '<h3>Homework Quizzes</h3>';
              string = string + `<ol start = '${obj.practicePages.length + 1}'>`;
              obj.homework.forEach((displayObject) => {
                  string = string + `<li class = 'text-${displayObject.scoreColor} mb-2'>`;
                  let text = displayObject.displayTitle;
                  if (displayObject.scoreDisplay) {
                      text = text + `: ${displayObject.scoreDisplay}`;
                  }
                  if (displayObject.newScorePending) {
                      text = text + '=> New Score Pending';
                  }
                  string = string + `<a class = 'text-${displayObject.scoreColor}' href = '${displayObject.link}'>${text}</a>`;
                  string = string + "</li>";
              });
              string = string + "</ol>";
            }


            if (obj.inClass.length > 0) {
              string = string + '<h3>In Class Quizzes</h3>';
              string = string + `<ol start = '${obj.practicePages.length + obj.homework.length + 1}'>`;
              obj.inClass.forEach((displayObject) => {
                  string = string + `<li class = 'text-${displayObject.scoreColor} mb-2'>`;
                  let text = displayObject.displayTitle;
                  if (displayObject.scoreDisplay) {
                      text = text + `: ${displayObject.scoreDisplay}`;
                  }

                  string = string + `<a class = 'text-${displayObject.scoreColor}' href = '${displayObject.link}'>${text}</a>`;
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

hbs.registerHelper('displayDueDatesNew', (courseLevel, gradeMap) => {
    const dueDates = dueDatesJSON[`${courseLevel}-${year}`];
    let string = "";
    const summerMessage = "Attempt By";
    const normalMessage = "Can retake until";
    if (dueDates) {
        Object.keys(dueDates).forEach((dueDateKey) => {
            const dateDisplay = displayDateFromString(dueDateKey);
            let message;
            if (courseLevel === 'summer' && (dueDateKey === '9-1-2021' || dueDateKey === '6-18-2021')) {
                message = summerMessage;
            } else {
                message = normalMessage;
            }
            string = string + `<h2>${message} ${dateDisplay}</h2>`;
            string = string + "<div class = 'ml-4 mb-4'>";
            // revise this to give more information
            Object.keys(dueDates[dueDateKey]).forEach((gradeExpectation) => {
                let obj = {
                    "homework": [],
                    "inClass": [],
                    "practicePages": []
                };
                Object.keys(dueDates[dueDateKey][gradeExpectation]).forEach((pod_id) => {
                    const inClassQuiz = dueDates[dueDateKey][gradeExpectation][pod_id].inClass;
                    const noQuiz = dueDates[dueDateKey][gradeExpectation][pod_id].noQuiz;
                    let displayObject;
                    if (idLibrary[pod_id].type === "pod") {
                        let superUnitKey = idLibrary[pod_id].superUnitKey;
                        let unitKey = idLibrary[pod_id].unitKey;
                        let podKey = idLibrary[pod_id].podKey;
                        let podObject = unitMap[superUnitKey].units[unitKey].pods[podKey];
                        let letter = podObject.letter;
                        let title = podObject.title;
                        if (podObject.subtitle) {
                            title = title + `: ${podObject.subtitle}`;
                        }
                        let podNumber = getUnitNumberString(unitMap[superUnitKey].number, unitMap[superUnitKey].units[unitKey].number);
                        let displayTitle = `${podNumber}-${letter}: ${title}`;

                        let score, practiceScore, pending, practicePending;
                        if (gradeMap) {
                            score  = gradeMap[superUnitKey].units[unitKey].pods[podKey].score;
                            practiceScore = gradeMap[superUnitKey].units[unitKey].pods[podKey].practiceScore;
                            pending = gradeMap[superUnitKey].units[unitKey].pods[podKey].pending;
                            practicePending = gradeMap[superUnitKey].units[unitKey].pods[podKey].practicePending;
                        }
                        let scoreDisplay, scoreColor;
                        if (score === 20) {
                            scoreDisplay = 'ACE';
                            scoreColor = 'success'
                        } else if (score >= 13) {
                            scoreDisplay = `${score} out of 20`;
                            scoreColor = 'warning';
                        } else if (score > 0) {
                            scoreDisplay = `${score} out of 20`;
                            scoreColor = 'danger';
                        } else if (score === 0) {
                            scoreDisplay = '0 out of 20 (not yet taken)';
                            scoreColor = 'danger'
                        } else {
                            scoreDisplay = undefined;
                            scoreColor = undefined;
                        }
                        if (pending) {
                            scoreColor = 'muted';
                        }
                        /// what to do if not logged in

                        let practiceDisplay, practiceColor;
                        if (practiceScore === 1) {
                            practiceDisplay = 'half credit';
                            practiceColor = 'danger';
                        } else if (practiceScore === 2) {
                            practiceDisplay = 'DONE';
                            practiceColor = 'success';
                        } else if (practiceScore === 0) {
                            practiceDisplay = 'no credit (not yet done)';
                            practiceColor = 'danger';
                        } else {
                            practiceDisplay = undefined;
                            practiceColor = undefined;
                        }
                        if (practicePending) {
                            practiceColor = 'muted';
                        }
                        let link = `/pod/${pod_id}`;
                        displayObject = {
                            "displayTitle": displayTitle,
                            "scoreDisplay": scoreDisplay,
                            "scoreColor": scoreColor,
                            "practiceDisplay": practiceDisplay,// this will be where the practice score is entered
                            "practiceColor": practiceColor,
                            "link": link,
                            "newScorePending": pending,
                            "newPracticeScorePending": practicePending
                        }
                    } else {
                        // error
                    }
                    if (noQuiz) {
                        // pass
                    } else if (inClassQuiz) {
                        obj.inClass.push(displayObject);
                    } else {
                        obj.homework.push(displayObject);
                    }
                    if (dueDates[dueDateKey][gradeExpectation][pod_id].practice) {
                        obj.practicePages.push(displayObject);
                    }
                });

                let numberGradeExpectation;
                if (gradeExpectation === 'C') {
                    numberGradeExpectation = 'a 70 %';
                } else if (gradeExpectation === 'B') {
                    numberGradeExpectation = 'an 80 %';
                } else if (gradeExpectation === 'A') {
                    numberGradeExpectation = 'a 90 %';
                }
                if (obj.practicePages.length > 0 || obj.homework.length > 0 || obj.inClass.length > 0) {
                    string = string + `<h3>Required to receive ${numberGradeExpectation} or higher</h3>`;
                    string = string + "<div class = 'ml-4 mb-4'>";
                    if (obj.practicePages.length > 0) {
                        string = string + '<h4>Practice Pages</h4>';
                        string = string + "<ol>";
                        obj.practicePages.forEach((displayObject) => {
                            string = string + `<li class = 'text-${displayObject.practiceColor} mb-2'>`;
                            let text = displayObject.displayTitle;
                            if (displayObject.practiceDisplay) {
                                text = text + `: ${displayObject.practiceDisplay}`;
                            }
                            if (displayObject.newPracticeScorePending) {
                                text = text + '=> New Practice Score Pending';
                            }

                            string = string + `<a class = 'text-${displayObject.practiceColor}' href = '${displayObject.link}'>${text}</a>`;
                            string = string + "</li>";
                        });
                        string = string + "</ol>";
                    }

                    if (obj.homework.length > 0) {
                        string = string + '<h4>Homework Quizzes</h4>';
                        string = string + `<ol start = '${obj.practicePages.length + 1}'>`;
                        obj.homework.forEach((displayObject) => {
                            string = string + `<li class = 'text-${displayObject.scoreColor} mb-2'>`;
                            let text = displayObject.displayTitle;
                            if (displayObject.scoreDisplay) {
                                text = text + `: ${displayObject.scoreDisplay}`;
                            }
                            if (displayObject.newScorePending) {
                                text = text + '=> New Score Pending';
                            }
                            string = string + `<a class = 'text-${displayObject.scoreColor}' href = '${displayObject.link}'>${text}</a>`;
                            string = string + "</li>";
                        });
                        string = string + "</ol>";
                    }


                    if (obj.inClass.length > 0) {
                        string = string + '<h4>In Class Quizzes</h4>';
                        string = string + `<ol start = '${obj.practicePages.length + obj.homework.length + 1}'>`;
                        obj.inClass.forEach((displayObject) => {
                            string = string + `<li class = 'text-${displayObject.scoreColor} mb-2'>`;
                            let text = displayObject.displayTitle;
                            if (displayObject.scoreDisplay) {
                                text = text + `: ${displayObject.scoreDisplay}`;
                            }

                            string = string + `<a class = 'text-${displayObject.scoreColor}' href = '${displayObject.link}'>${text}</a>`;
                            string = string + "</li>";
                        });
                        string = string + "</ol>";
                    }

                    string = string + "</div>";
                }
            });
            string = string + "</div>";
        });
    } else {
        string = '<p>error</p>';
    }
    string = string + "</div>";
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

hbs.registerHelper('showPreviousQuizAttempts', (previousQuizArray) => {
    const string = showPreviousAttempts(previousQuizArray, 'quiz');
    return new hbs.SafeString(string)
});


hbs.registerHelper('showPreviousPracticeSubmissions',(previousPracticeArray) => {
    const string = showPreviousAttempts(previousPracticeArray, 'practice');
    return new hbs.SafeString(string);
});

function showPreviousAttempts(previousAttemptsArray, quizOrPractice) {
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

        string = "<div class = 'container'>";
        string = string + "<div class = 'row'>";
        string = string + "<div class = 'col-12'>";
        if (quizOrPractice === 'quiz') {
            string = `<h4>You have taken this quiz ${countMessage}.</h4>`;
        } else if (quizOrPractice === 'practice') {
            string = `<h4>You have submitted this practice page ${countMessage}.</h4>`;
        }
        string = string + "</div>";
        string = string + "</div>";


        previousAttemptsArray.forEach((previousAttempt) => {
            string = string + displayAttempt(previousAttempt, quizOrPractice);
        });

        string = string + "</div>";
    }
    return string
}

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


hbs.registerHelper('quizLinkNew', (loggedIn, available, quizRequirementObject, uuid) => {
    let message, link, lateCode = false;
    if (!loggedIn) {
        message = 'You must be logged in to take the quiz.';
        link = false;
        // add log in link
    } else if (!available) {
        message = 'This quiz is not yet available but should be ready soon.';
        link = false;
    } else if (!quizRequirementObject.required) {
        message = 'This quiz is not required for your class at this time.';
        link = false;
    } else if (quizRequirementObject.currentTopScore === 20) {
        message = 'You already ACED this quiz! Great job!';
        link = false;
    } else if (!quizRequirementObject.inClass && quizRequirementObject.overdue && quizRequirementObject.currentTopScore > 0 && !quizRequirementObject.pending) {
        message = `Your top score on this quiz is ${quizRequirementObject.currentTopScore} out of 20. It is passed the date to retake the quiz.`;
        link = false;
        //link = 'Access quiz with late code';
        lateCode = true;
    } else if (!quizRequirementObject.inClass && !quizRequirementObject.overdue && quizRequirementObject.currentTopScore > 0 && !quizRequirementObject.pending) {
        message = `Your top score on this quiz is ${quizRequirementObject.currentTopScore} out of 20. You can retake this quiz until ${quizRequirementObject.dueDate}.`;
        link = 'Go to quiz.';
    } else if (!quizRequirementObject.inClass && quizRequirementObject.overdue && quizRequirementObject.currentTopScore === 0 && !quizRequirementObject.pending) {
        message = `You have not yet taken this quiz. It is passed the date to take it.`;
        link = false;
        //link = 'Access quiz with late code';
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
        //link = 'Access quiz with late code AND in class code.';
        link = false;
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


hbs.registerHelper('practiceLink', (loggedIn, practiceObject, id, practiceComments) => {
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
        message = 'The practice page was already due. You did not receive credit. You have not received credit so far, but your submission is pending.';
        link = false;
    } else if (practiceObject.overdue && practiceObject.currentTopScore === 0 && !practiceObject.practicePending) {
        message = 'The practice page was already due. You did not receive credit.';
        link = false;
    } else if (!practiceObject.overdue && practiceObject.currentTopScore === 1 && practiceObject.practicePending) {
        message = `This practice page is due on ${practiceObject.dueDate}. So far, you have received half credit, and your resubmission is pending.`;
        link = false;
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
        string = string + `<a href = '/submitPractice/${id}'>SUBMIT PRACTICE PAGE</a>`;
        if (practiceComments) {
            string = string + `<p>${practiceComments}</p>`;
        }
    }
    return new hbs.SafeString(string);
});

hbs.registerHelper('getGradeScale', (scaleJSON) => {
  return new hbs.SafeString(JSON.stringify(scaleJSON));
});


hbs.registerHelper('isLoggedIn', (loggedIn) => {
    return loggedIn
});

module.exports = {

};
