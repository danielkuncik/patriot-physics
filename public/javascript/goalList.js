
const monthDictionary = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const dayDictionary = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

class DueDate { // date string must be formatted as 7-4-1776
    constructor(dateString) {
        const array = dateString.split('-');
        const month = Number(array[0]) - 1;
        const day = Number(array[1]);
        const year = Number(array[2]);
        this.date = new Date(year, month, day);
    }

    print() {
        const month = monthDictionary[this.date.getMonth()];
        const day = this.date.getDate();
        const year = this.date.getFullYear();
        const dayOfWeek = dayDictionary[this.date.getDay()];
        const string = `${dayOfWeek}: ${month} ${day}, ${year} (11:59 pm)`;
        return string
    }

    compare(anotherDueDate) {
        const year1 = this.date.getFullYear();
        const year2 = anotherDueDate.date.getFullYear();
        const month1 = this.date.getMonth();
        const month2 = anotherDueDate.date.getMonth();
        const day1 = this.date.getDate();
        const day2 = anotherDueDate.date.getDate();
        if (year1 < year2) {
            return 'before';
        } else if (year1 > year2) {
            return 'after';
        } else {
            if (month1 < month2) {
                return 'before'
            } else if (month1 > month2) {
                return 'after'
            } else {
                if (day1 < day2) {
                    return 'before'
                } else if (day1 > day2) {
                    return 'after'
                } else {
                    return 'same';
                }
            }
        }
    }
    isEqualTo(anotherDueDate) {
        return this.compare(anotherDueDate) === 'same'
    }
    isBefore(anotherDueDate) {
        return this.compare(anotherDueDate) === 'before'
    }
}

// does not seem to be working?
// i don't even know if i want it?
function consolidateGoalsObject(goalsObject) {
    if (goalsObject.consolidated) {
        return goalsObject
    }
    let forDeletion = [];
    Object.keys(goalsObject.superUnits).forEach((superUnitKey) => {
        Object.keys(goalsObject.superUnits[superUnitKey].units).forEach((unitKey) => {
            const levelArray = Object.keys(goalsObject.superUnits[superUnitKey].units[unitKey].levelGoals);
            let i;
            let dueDatesArray = [];
            let highestLevelArray = [];
            for (i = 0; i < levelArray.length; i++) {
                const level = levelArray[i];
                const dueDate = goalsObject.superUnits[superUnitKey].units[unitKey].levelGoals[level].dueDateString;
                if (dueDatesArray.includes(dueDate)) {
                    let index = dueDatesArray.indexOf(dueDate);
                    if (highestLevelArray[index] < level) {
                        const oldHighestLevel = highestLevelArray[index];
                        highestLevelArray[index] = level;
                        forDeletion.push({
                            superUnitKey: superUnitKey,
                            unitKey: unitKey,
                            level: oldHighestLevel
                        })
                    }
                } else {
                    dueDatesArray.push(dueDate);
                    highestLevelArray.push(level);
                }
            }
        });
    });

    forDeletion.forEach((redundantGoal) => {
        delete goalsObject.superUnits[redundantGoal.superUnitKey].units[redundantGoal.unitKey].levelGoals[redundantGoal.level];
    });
    goalsObject.consolidated = true;
    return goalsObject
}


function prepDueDateObjects(goalsObject) {
    if (goalsObject.prepped) {
        return goalsObject
    }
    Object.keys(goalsObject.superUnits).forEach((superUnitKey) => {
        Object.keys(goalsObject.superUnits[superUnitKey].units).forEach((unitKey) => {
            Object.keys(goalsObject.superUnits[superUnitKey].units[unitKey].levelGoals).forEach((levelGoal) => {
                const dueDateString = goalsObject.superUnits[superUnitKey].units[unitKey].levelGoals[levelGoal]['dueDateString'];
                goalsObject.superUnits[superUnitKey].units[unitKey].levelGoals[levelGoal]["dueDateObject"] = new DueDate(dueDateString);
            });
        });
    });
    goalsObject.prepped = true;
    return goalsObject
}

function prepGoals(goalsObject) {
    prepDueDateObjects(goalsObject);
    consolidateGoalsObject(goalsObject);
    return goalsObject
}

// this is just terrible

// should i bring the unit map to the front end
// the 'information' convention is awkward
function listGoalsByTopic(goalsObject) {
    const refinedGoalsObject = prepGoals(goalsObject);
    let bigList = $("<ul></ul>");
    Object.keys(refinedGoalsObject.superUnits).forEach((superUnitKey) => {
        let superUnitItem = $("<li></li>");
        let superUnitLink = $(`<a href = '${refinedGoalsObject.superUnits[superUnitKey].link}'>${refinedGoalsObject.superUnits[superUnitKey].title}</a>`);
        $(superUnitItem).append(superUnitLink);
        let unitList = $("<ul></ul>");
        Object.keys(refinedGoalsObject.superUnits[superUnitKey].units).forEach((unitKey) => {
            let unitItem = $("<ul></ul>");
            const currentLevel = !!refinedGoalsObject.superUnits[superUnitKey].units[unitKey].currentLevel ? ` Current Level: ${refinedGoalsObject.superUnits[superUnitKey].units[unitKey].currentLevel}` : undefined;
            let unitLink = $(`<a href = '${refinedGoalsObject.superUnits[superUnitKey].units[unitKey].link}'>${refinedGoalsObject.superUnits[superUnitKey].units[unitKey].title}</a>`);
            $(unitItem).append(unitLink);
            if (currentLevel) {
                $(unitItem).append(`<span class = 'text-warning'>${currentLevel}</span>`);
            }
            let goalList = $("<ul></ul>");
            Object.keys(refinedGoalsObject.superUnits[superUnitKey].units[unitKey].levelGoals).forEach((levelGoal) => {
                let goalItem = $(`<li>Level ${levelGoal} by ${refinedGoalsObject.superUnits[superUnitKey].units[unitKey].levelGoals[levelGoal].dueDateObject.print()}</li>`);
                $(goalList).append(goalItem);
            });
            $(unitItem).append(goalList);
            $(unitList).append(unitItem);
        });
        $(superUnitItem).append(unitList);
        $(bigList).append(superUnitItem);
    });
    return bigList
}

function getDueDateArray(goalsObject) {
    let goalArray = [];
    const refinedGoalsObject = prepGoals(goalsObject);
    Object.keys(refinedGoalsObject.superUnits).forEach((superUnitKey) => {
        Object.keys(refinedGoalsObject.superUnits[superUnitKey].units).forEach((unitKey) => {
            const unitTitle = refinedGoalsObject.superUnits[superUnitKey].units[unitKey].title;
            const unitLink = refinedGoalsObject.superUnits[superUnitKey].units[unitKey].link;
            Object.keys(refinedGoalsObject.superUnits[superUnitKey].units[unitKey].levelGoals).forEach((levelGoal) => {
                const thisDueDate = refinedGoalsObject.superUnits[superUnitKey].units[unitKey].levelGoals[levelGoal].dueDateObject;
                let entered = false;
                goalArray.forEach((existingGoal) => { // inefficient =>
                    // make this just an array, not an object
                    // break the loop when necessary
                    if ((existingGoal.dueDate).isEqualTo(thisDueDate)) {
                        existingGoal.goals.push({
                            unitTitle: unitTitle,
                            unitLink: unitLink,
                            levelGoal: levelGoal,
                            currentLevel: !!refinedGoalsObject.superUnits[superUnitKey].units[unitKey].currentLevel ? ` Current Level: ${refinedGoalsObject.superUnits[superUnitKey].units[unitKey].currentLevel}` : undefined

                    });
                        entered = true;
                    }
                });
                if (!entered) {
                    goalArray.push({
                        dueDate: thisDueDate,
                        goals: [{
                            unitTitle: unitTitle,
                            unitLink: unitLink,
                            levelGoal: levelGoal
                        }]
                    });
                }
            });
        });
    });
    return orderDueDateArray(goalArray)
}



/// mostly untested
function orderDueDateArray(goalArray) {
    let i, alreadyPostedArray = [];
    for (i = 0; i < goalArray.length; i++) {
        alreadyPostedArray.push(false);
    }
    let newArray = [];
    while (newArray.length < goalArray.length) {
        let j = 0;
        while (alreadyPostedArray[j]) {
            j++;
        }
        let firstIndex = j;
        let firstDueDate = goalArray[firstIndex].dueDate;
        let k;
        for (k = j; k < goalArray.length; k++) {
            if (goalArray[k].dueDate.isBefore(firstDueDate) && !alreadyPostedArray[k]) {
                firstIndex = k;
                firstDueDate = goalArray[firstIndex].dueDate;
            }
        }
        newArray.push(goalArray[firstIndex]);
        alreadyPostedArray[firstIndex] = true;
    }
    return newArray
}


function listGoalsByDueDate(goalsObject) {
    const dueDateArray = getDueDateArray(goalsObject);
    let bigList = $("<ul></ul>");

    dueDateArray.forEach((dueDate) => {
        let thisItem = $("<li></li>");
        thisItem.append(`<h5>${dueDate.dueDate.print()}</h5>`);
        let littleList = $("<ul></ul>");
        Object.keys(dueDate.goals).forEach((goal) => {
            const goalObject = dueDate.goals[goal];
            let goalItem = $(`<li><a href = '${goalObject.unitLink}'>${goalObject.unitTitle}</a>: Goal Level ${goalObject.levelGoal}</li>`);
            if (goalObject.currentLevel) {
                $(goalItem).append(`<span class = 'text-warning'>${goalObject.currentLevel}</span>`);
            }
            $(littleList).append(goalItem);
        });
        $(thisItem).append(littleList);
        $(bigList).append(thisItem);
    });
    return bigList
}