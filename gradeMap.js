const unitMap = require(__dirname + '/public/unit_map');
const AP_goals = require(__dirname + '/apTestGoals.json');

function createAPGauge() {
    // uses the json file to create a gauge of AP progress 
}

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

class GradeMap {
    constructor(courseLevel) {
        this.overallLevel = 0;
        this.courseLevel = courseLevel;
        this.inClassWeight = 2;
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
                    pods: {}
                };
                Object.keys(unitMap[superUnitKey].units[unitKey].pods).forEach((podKey) => {
                    let level = unitMap[superUnitKey].units[unitKey].pods[podKey].level;
                    if (level === undefined) {
                        level = 0;
                    }
                    let valueWeight;
                    if (this.courseLevel === 'AP' && unitMap[superUnitKey].units[unitKey].pods[podKey]["inClass_AP"]) {
                        valueWeight = this.inClassWeight;
                    } else if (this.courseLevel === 'Honors' && unitMap[superUnitKey].units[unitKey].pods[podKey]["inClass_honors"]) {
                        valueWeight = this.inClassWeight;
                    } else if (this.courseLevel === 'A_level' && unitMap[superUnitKey].units[unitKey].pods[podKey]["inClass_Alevel"]) {
                        valueWeight = this.inClassWeight;
                    } else {
                        valueWeight = 1;
                    }
                    blankMap[superUnitKey].units[unitKey].pods[podKey] = {
                        score: 0,
                        valueWeight: valueWeight,
                        level: level,
                        pending: false
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

    setQuizPending(pod_uuid) {
        const selectionObject = getPodKeysByUUID(pod_uuid);
        if (selectionObject) {
            this.map[selectionObject.superUnitKey].units[selectionObject.unitKey].pods[selectionObject.podKey].pending = true;
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

    calculateGrade(superUnitKey, unitKey, goalLevel) {
        const currentLevel = this.calculateUnitLevel(superUnitKey, unitKey);
        return calculateGradeFromLevel(currentLevel, goalLevel)
    }

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

    print() {
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
                    const value = this.map[superUnitKey].units[unitKey].pods[podKey].value;
                    const weight = this.map[superUnitKey].units[unitKey].pods[podKey].valueWeight;
                    console.log(`${title}: ${score}         [val: ${value}]  [weight: ${weight}]`);
                });
            });
        });
    }
}


module.exports = {
    getPodKeysByUUID,
    GradeMap
};
