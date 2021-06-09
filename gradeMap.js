const unitMap = require(__dirname + '/public/unit_map');
//const AP_goals = require(__dirname + '/apTestGoals.json');
const gradeScale = require(__dirname + '/gradingScale.json');
const dueDates = require(__dirname + '/dueDates.json');

const { unitMapBy_id } = require(__dirname + '/unitMapBy_id.js');


function createAPGauge() {
    // uses the json file to create a gauge of AP progress 
}

getPodById = function(pod_id) {
    const keys = unitMapBy_id[pod_id];
    return unitMap[keys.superUnitKey].units[keys.unitKey].pods[keys.podKey];
};

function createGradeScale(level, hybrid) {
    const scale = gradeScale.baseScale;
    let leveled_scale;
    if (level === 'A_level') {
        leveled_scale = scale.map(x => x * gradeScale.A_level_multiplier);
    } else if (level === 'honors') {
        leveled_scale = scale.map(x => x * gradeScale.honors_multiplier);
    } else if (level === 'AP' || level === 'summer') {
        leveled_scale = scale.map(x => x * gradeScale.AP_multiplier);
    } else {
        leveled_scale = scale;
    }

    let hybrid_adjusted_scale;
    if (hybrid) {
        hybrid_adjusted_scale = leveled_scale.map(x => x * gradeScale.hybrid_multiplier);
    } else {
        hybrid_adjusted_scale = leveled_scale;
    }

    let integer_scale = hybrid_adjusted_scale.map(x => Math.ceil(x));

    return integer_scale
}

function printGradeScale(level, hybrid) {
    const scaleArray = createGradeScale(level, hybrid);
    let i;
    const level3QuizValue = gradeScale.point_unit * 2 * 3;
    for (i = 0; i < scaleArray.length; i++) {
        const pointsRequired = scaleArray[i];
        const level3QuizCount = pointsRequired / level3QuizValue;
        console.log(`${i}% : ${pointsRequired} : ${level3QuizCount}`);
    }
}


// adds up the points that can be earned from completing all assigned assignments
// does not include distinction btw prac pages, hw quizzes, and in class quizzes!
function collectAllQuizzes(level, year = 2022, gradeExpected = 'C', firstDay = "6-20-2021", lastDay = "11-1-2021") {
    const dueDateObject = dueDates[`${level}-${year}`];
    let quiz_ids = [];
    const firstDayDate = new Date(firstDay);
    const lastDayDate = new Date(lastDay);
    Object.keys(dueDateObject).forEach((dueDate) => {
        const dueDateJavascriptObject = new Date(dueDate);
        if (dueDateJavascriptObject >= firstDayDate && dueDateJavascriptObject <= lastDayDate) {
            Object.keys(dueDateObject[dueDate]).forEach((grade) => {
                if (grade <= gradeExpected) { // works for comparing single letter strings
                    Object.keys(dueDateObject[dueDate][grade]).forEach((podId) => {
                        quiz_ids.push(podId);
                    });
                }
            });
        }
    });
    return quiz_ids
}

function countQuizzes(level, year = 2022, gradeExpected = 'C', firstDay = "6-20-2021", lastDay = "11-1-2021") {
    return collectAllQuizzes(level, year, gradeExpected, firstDay, lastDay).length
}


function countTotalPoints(level, year = 2022, gradeExpected = 'C', firstDay = "6-20-2021", lastDay = "11-1-2021") {
    const quiz_ids = collectAllQuizzes(level, year,gradeExpected, firstDay, lastDay);
    const unitPointValue = gradeScale["point_unit"];
    let totalPoints = 0;
    quiz_ids.forEach((quiz_id) => {
        const podObj = getPodById(quiz_id);
        totalPoints += podObj.level * 2 * unitPointValue;
    });
    return totalPoints
}

function checkPointScales(level, year = 2022, firstDay = "6-20-2021", lastDay = "11-1-2021") {
    let gradeScale = createGradeScale(level);
    const C_required_points = gradeScale[70];
    const B_required_points = gradeScale[80];
    const A_required_points = gradeScale[90];

    const C_assigned_points = countTotalPoints(level, year, 'C', firstDay, lastDay);
    const B_assigned_points = countTotalPoints(level, year,'B', firstDay, lastDay);
    const A_assigned_points = countTotalPoints(level, year,'A', firstDay, lastDay);

    const C_difference = C_required_points - C_assigned_points;
    const B_difference = B_required_points - B_assigned_points;
    const A_difference = A_required_points - A_assigned_points;

    console.log(`70 % => ${C_required_points} required      ${C_assigned_points} assigned      ${C_difference} difference`)
    console.log(`80 % => ${B_required_points} required      ${B_assigned_points} assigned      ${B_difference} difference`)
    console.log(`90 % => ${A_required_points} required      ${A_assigned_points} assigned      ${A_difference} difference`)
}

checkPointScales('AP');

// there needs to be a checker that makes sure that the assignments add up to the
// total number of points required for an A

function getPodKeysByUUID(uuid) {
    let selectionObject;
    let done = false;
    Object.keys(unitMap).some((superUnitKey) => {
        if (done) {
            return true
        }
        Object.keys(unitMap[superUnitKey].units).some((unitKey) => {
            if (done) {
                return true
            }
            Object.keys(unitMap[superUnitKey].units[unitKey].pods).some((podKey) => {
                if (uuid === unitMap[superUnitKey].units[unitKey].pods[podKey].uuid) {
                    selectionObject = {
                        superUnitKey: superUnitKey,
                        unitKey: unitKey,
                        podKey: podKey
                    };
                    done = true;
                }
                return done
            });
        });
    });
    return selectionObject
}

// creates an array that gives grade for each level
function createGoalArray(goalLevel) {
    let array = [100];
    let i;
    for (i = 0; i < goalLevel; i++) {
        array.unshift(95 - i * 10);
    }
    array.unshift(0);
    return array;
}

function calculateGradeFromLevel(currentLevel, goalLevel) {
    const goalArray = createGoalArray(goalLevel);
    if (currentLevel >= goalLevel + 1) {
        return 100
    } else {
        const baseLevel = Math.floor(currentLevel);
        const extraLevel = currentLevel % 1;
        const grade = goalArray[baseLevel] + (goalArray[baseLevel + 1] - goalArray[baseLevel]) * extraLevel;
        return Math.floor(grade)
    }
}

const pointUnit = gradeScale.point_unit;

const q3_first_day = '2-1-2021';
const q3_last_day = '4-8-2021';
const q4_first_day = '4-9-2021';
const q4_last_day_senior = '5-21-2021';
const q4_last_day = '6-12-2021';

// issue => when you log in, this is loaded 3 times !!!
class GradeMap {
    constructor(courseLevel, hybrid = true) {
        this.overallLevel = 0;
        this.courseLevel = courseLevel;
        this.inClassWeight = 2;
        this.gradeScale = createGradeScale(courseLevel, hybrid);
        this.relevantUnits = undefined;
        if (courseLevel === 'AP') {
            this.relevantUnits = gradeScale["AP_units"];
        } else if (courseLevel === 'Honors') {
            this.relevantUnits = gradeScale["Honors_units"];
        } else if (courseLevel === 'A_level') {
            this.relevantUnits = gradeScale["A_level_units"]
        }
        this.map = this.makeBlankMap();
        this.setAllPodValues();
    }

    makeBlankMap() {
        let blankMap = {};
        Object.keys(unitMap).forEach((superUnitKey) => {
            blankMap[superUnitKey] = {
                units: {}
            };
            Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
                blankMap[superUnitKey].units[unitKey] = {
                    level: 0,
                    unitPoints: 0,
                    pods: {}
                };
                let pointsForPods;
                if (this.relevantUnits) {
                    pointsForPods = (this.relevantUnits).includes(unitKey);
                } else {
                    pointsForPods = false
                }
                Object.keys(unitMap[superUnitKey].units[unitKey].pods).forEach((podKey) => {
                    let level = unitMap[superUnitKey].units[unitKey].pods[podKey].level;
                    if (level === undefined) {
                        level = 0;
                    }
                    let practicePointsAvailable, quizPointsAvailable;
                    if (pointsForPods) {
                        practicePointsAvailable = level * pointUnit; // can map this back to th eunit
                        quizPointsAvailable = level * 2 * pointUnit;
                    } else {
                        practicePointsAvailable = 0;
                        quizPointsAvailable = 0;
                    }
                    let valueWeight; // don't know if i still want this?
                    // this is short term, until i think of a better way to do in class quizzes!
                    if (this.courseLevel === 'AP' && unitMap[superUnitKey].units[unitKey].pods[podKey]["inClass_AP"]) {
                        valueWeight = this.inClassWeight;
                        quizPointsAvailable *= 2;
                    } else if (this.courseLevel === 'Honors' && unitMap[superUnitKey].units[unitKey].pods[podKey]["inClass_honors"]) {
                        valueWeight = this.inClassWeight;
                        quizPointsAvailable *= 2;
                    } else if (this.courseLevel === 'A_level' && unitMap[superUnitKey].units[unitKey].pods[podKey]["inClass_Alevel"]) {
                        valueWeight = this.inClassWeight;
                        quizPointsAvailable *= 2;
                    } else {
                        valueWeight = 1;
                    }
                    blankMap[superUnitKey].units[unitKey].pods[podKey] = {
                        score: 0,
                        practiceScore: 0,
                        valueWeight: valueWeight,
                        level: level,
                        pending: false,
                        practicePending: false,
                        practiceComment: undefined,
                        quizPointsAvailable: quizPointsAvailable,
                        practicePointsAvailable: practicePointsAvailable
                    }
                });
            });
        });
        return blankMap
    }

    setPodValuesInOneUnit(superUnitKey, unitKey) {
        let currentLevel;
        let podsObject = this.map[superUnitKey].units[unitKey].pods;
        for (currentLevel = 1; currentLevel <= 5; currentLevel++) {
            let podsKeysForThisLevel = [];
            let totalValueThisLevel = 0;
            Object.keys(podsObject).forEach((podKey) => {
                if (podsObject[podKey].level === currentLevel) {
                    podsKeysForThisLevel.push(podKey);
                    totalValueThisLevel += podsObject[podKey].valueWeight;
                }
            });
            //let value = 1 / podsKeysForThisLevel.length;
            podsKeysForThisLevel.forEach((podKey) => {
                let value = this.map[superUnitKey].units[unitKey].pods[podKey].valueWeight / totalValueThisLevel;
                this.map[superUnitKey].units[unitKey].pods[podKey].value = value;
            });
        }

        // all level 6 pods have a value of 1
        let level6PodKeys = [];
        Object.keys(podsObject).forEach((podKey) => {
            if (podsObject[podKey].level === 6) {
                level6PodKeys.push(podKey);
            }
        });
        level6PodKeys.forEach((podKey) => {
            this.map[superUnitKey].units[unitKey].pods[podKey].value = 1; // all level 6 have value 1
        });
    }

    setAllPodValues() {
        Object.keys(unitMap).forEach((superUnitKey) => {
            Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
                this.setPodValuesInOneUnit(superUnitKey, unitKey);
            });
        });
    }

    addScore(pod_uuid, score) {
        if (score === undefined) {
            score = 0;
        }
        if (score < 0) {
            score = 0
        } else if (score > 18) {
            score = 20;
        }
        let selectionObject = getPodKeysByUUID(pod_uuid);
        if (selectionObject) {
            this.map[selectionObject.superUnitKey].units[selectionObject.unitKey].pods[selectionObject.podKey].score = score;
        }
    }

    addPracticeScore(pod_uuid, score, comment) {
        if (score === undefined) {
            score = 0;
        }
        if (score < 0) {
            score = 0
        } else if (score > 2) {
            score = 2;
        }
        let selectionObject = getPodKeysByUUID(pod_uuid);
        if (selectionObject) {
            this.map[selectionObject.superUnitKey].units[selectionObject.unitKey].pods[selectionObject.podKey].practiceScore = score;
            if (comment) {
                this.map[selectionObject.superUnitKey].units[selectionObject.unitKey].pods[selectionObject.podKey].practiceComment = comment;
            }
        }

    }

    calculateTotalPoints() {
        let totalScore = 0;
        Object.keys(unitMap).forEach((superUnitKey) => {
            Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
                let unitScore = 0;
                Object.keys(unitMap[superUnitKey].units[unitKey].pods).forEach((podKey) => {
                    let info = this.map[superUnitKey].units[unitKey].pods[podKey];
                    unitScore += info.practicePointsAvailable * info.practiceScore / 2;
                    unitScore += info.quizPointsAvailable * info.score / 20;
                });
                this.map[superUnitKey].units[unitKey].unitPoints = unitScore;
                totalScore += unitScore;
            });
        });
        this.totalPoints = totalScore;
        return totalScore;
    }

    calculateGrade() {
        return this.calculateGradeFromTotalPoints(this.calculateTotalPoints());
    }

    calculateGradeFromTotalPoints(totalPoints) {
        let grade = 0, counter = 0;
        while (totalPoints > this.gradeScale[grade] && counter < 105) {
            grade++;
            counter++;
        }
        grade--;
        if (grade > 100) {
            grade = 100;
        }
        this.grade = grade;
        return grade
    }

    setQuizPending(pod_uuid) {
        const selectionObject = getPodKeysByUUID(pod_uuid);
        if (selectionObject) {
            this.map[selectionObject.superUnitKey].units[selectionObject.unitKey].pods[selectionObject.podKey].pending = true;
        }
    }

    setPracticePending(pod_uuid) {
        const selectionObject = getPodKeysByUUID(pod_uuid);
        if (selectionObject) {
            this.map[selectionObject.superUnitKey].units[selectionObject.unitKey].pods[selectionObject.podKey].practicePending = true;
        }
    }

    calculateUnitLevel(superUnitKey, unitKey) {
        let podsObject = this.map[superUnitKey].units[unitKey].pods;
        let level = 0;
        Object.keys(podsObject).forEach((podKey) => {
            let score = podsObject[podKey].score;
            let value = podsObject[podKey].value;
            level += score / 20 * value;
        });
        let roundedLevel = Math.floor((level  + 0.001) * 10) / 10;
        this.map[superUnitKey].units[unitKey].level = roundedLevel;
        return roundedLevel
    }

    // calculateGrade(superUnitKey, unitKey, goalLevel) {
    //     const currentLevel = this.calculateUnitLevel(superUnitKey, unitKey);
    //     return calculateGradeFromLevel(currentLevel, goalLevel)
    // }

    calculateAllUnitLevels() {
        Object.keys(unitMap).forEach((superUnitKey) => {
            Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
                this.calculateUnitLevel(superUnitKey, unitKey);
            });
        });
    }

    calculateOverallLevel() {
        let level = 0;
        Object.keys(unitMap).forEach((superUnitKey) => {
            Object.keys(unitMap[superUnitKey].units).forEach((unitKey) => {
                level += this.map[superUnitKey].units[unitKey].level;
            });
        });
        this.overallLevel = Math.floor(level);
        return this.overallLevel
    }

    createAPGauge() {

    }

    calculateAnticipatedTotalPoints(quarter = 3, senior = false) {
        let quarterFirstDay, quarterLastDay;
        if (quarter === 3) {
            quarterFirstDay = new Date(q3_first_day);
            quarterLastDay = new Date(q3_last_day);
        } else if (quarter === 4 && senior) {
            quarterFirstDay = new Date(q4_first_day);
            quarterLastDay = new Date(q4_last_day_senior);
        } else if (quarter === 4 && !senior) {
            quarterFirstDay = new Date(q4_first_day);
            quarterLastDay = new Date(q4_last_day);
        }
        let today = new Date();
        const fullQuarterLength = quarterLastDay - quarterFirstDay;
        const timePassed = today - quarterFirstDay;
        //const timeRemaining = quarterLastDay - today;
        const totalPointsNow = this.calculateTotalPoints();
        /// use proportion for anticipated points =>
        return totalPointsNow * fullQuarterLength / timePassed
    }

    calculateAnticipatedGrade(quarter, senior) {
        const anticipatedTotalPoints = this.calculateAnticipatedTotalPoints(quarter, senior);
        return this.calculateGradeFromTotalPoints(anticipatedTotalPoints);
    }

    // describes how many 1s and 0s should be entered into powerschool
    // to ensure powerschool grade is anticipated grade
    // (hand determined algorithm)
    determinePowerSchoolEntry(quarterEndDate) {
        const currentGrade = this.calculateGrade();
        const anticipatedGrade = this.calculateAnticipatedGrade(quarterEndDate);
        return {
            "1s up to": currentGrade,
            "0s up to": Math.round(100 * currentGrade / anticipatedGrade)
        }
    }


    print_lite() {
        console.log("GRADE MAP");
        console.log(`Course Level: ${this.courseLevel}`);
        console.log(`Total Points: ${this.totalPoints}`);
        console.log(`Grade: ${this.grade}%`);
    }

    print() {
        this.print_lite();
        Object.keys(this.map).forEach((superUnitKey) => {
            console.log('#####################');
            console.log('#####################');
            console.log(unitMap[superUnitKey].title);
            Object.keys(this.map[superUnitKey].units).forEach((unitKey) => {
                console.log('-------------');
                console.log(unitMap[superUnitKey].units[unitKey].title);
                console.log('-------------');
                Object.keys(this.map[superUnitKey].units[unitKey].pods).forEach((podKey) => {
                    const mainTitle = unitMap[superUnitKey].units[unitKey].pods[podKey].title;
                    const subTitle = unitMap[superUnitKey].units[unitKey].pods[podKey].subTitle;
                    const title = !!subTitle ? `${mainTitle}: ${subTitle}` : mainTitle;
                    const score = this.map[superUnitKey].units[unitKey].pods[podKey].score;
                    const practiceScore = this.map[superUnitKey].units[unitKey].pods[podKey].practiceScore;
                    const value = this.map[superUnitKey].units[unitKey].pods[podKey].value;
                    const weight = this.map[superUnitKey].units[unitKey].pods[podKey].valueWeight;
                    console.log(`${title}: ${score}         [val: ${value}]  [weight: ${weight}] ${practiceScore ? practiceScore : ""}`);
                });
            });
        });
        console.log('Relevant Units:');
        console.log(this.relevantUnits);
    }
}

let newGradeMap = new GradeMap();
newGradeMap.calculateAnticipatedGrade();


module.exports = {
    getPodKeysByUUID,
    GradeMap
};
