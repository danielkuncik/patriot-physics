const unitMap2 = require(__dirname + '/public/unit_map');

const alphabetArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N','O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const alphabetDictionary = {
    'A': 1,
    'B': 2,
    'C': 3,
    'D': 4,
    'E': 5,
    'F': 6,
    'G': 7,
    'H': 8,
    'I': 9,
    'J': 10,
    'K': 11,
    'L': 12,
    'M': 13,
    'N': 14,
    'O': 15,
    'P': 16,
    'Q': 17,
    'R': 18,
    'S': 19,
    'T': 20,
    'U': 21,
    'V': 22,
    'W': 23,
    'X': 24,
    'Y': 25,
    'Z': 26
};

class GradeMap {
    constructor() {
        this.map = {};
        this.quizCodes = {};
        this.overallLevel = 0;
        Object.entries(unitMap2).forEach((entry_A) => {
            let superUnitKey = entry_A[0];
            let superUnit = entry_A[1];
            this.map[superUnitKey] = {
                number: superUnit.number,
                units: {}
            };
            if (superUnit.units) {
                Object.entries(superUnit.units).forEach((entry_B) => {
                    let unitKey = entry_B[0];
                    let unit = entry_B[1];
                    this.map[superUnitKey].units[unitKey] = {
                        number: unit.number,
                        level: 0,
                        pods: {}
                    };
                    if (unit.pods) {
                        let podsPerLevel = [undefined, 0, 0, 0, 0, 0, 0];
                        Object.entries(unit.pods).forEach((entry_C) => {
                            let podKey = entry_C[0];
                            let pod = entry_C[1];
                            this.map[superUnitKey].units[unitKey].pods[podKey] = {
                                letter: pod.letter,
                                level: pod.level,
                                grade: 0,
                                pending: false
                            };
                            let podCode =
                            podsPerLevel[pod.level] += 1;
                        });

                        // set pod values
                        let thisLevel, levelValue;
                        for (thisLevel = 1; thisLevel < 6; thisLevel++) {
                            levelValue = 1 / podsPerLevel[thisLevel];
                            Object.values(this.map[superUnitKey].units[unitKey].pods).forEach((pod) => {
                                if (pod.level === thisLevel) {
                                    pod.value = levelValue;
                                }
                            });
                        }
                        Object.values(this.map[superUnitKey].units[unitKey].pods).forEach((pod) => {
                            if (pod.level === 6) {
                                pod.value = 1;
                            }
                        });
                    }
                });
            }
        });
    }

    getPodFromNumber(podNumber) {
        const podLetter = alphabetArray[Math.floor(podNumber / 10000) - 1];
        const superUnitNumber = Math.floor((podNumber % 10000) / 100);
        const unitNumber = superUnitNumber % 100;

        let superUnitKey, unitKey, podKey;
        Object.entries(this.map).forEach((entry_A) => {
            let superUnit = entry_A[1];
            if (superUnit.number === superUnitNumber && superUnit.units) {
                superUnitKey = entry_A[0];
                Object.entries(superUnit.units).forEach((entry_B) => {
                    let unit = entry_B[1];
                    if (unit.number === unitNumber && unit.pods) {
                        unitKey = entry_B[0];
                        Object.entries(unit.pods).forEach((entry_C) => {
                            let pod = entry_C[1];
                            if (pod.letter === podLetter) {
                                podKey = entry_C[0];
                            }
                        });
                    }
                });

            }
        });
        let result;
        if (superUnitKey && unitKey && podKey) {
            result = {
                superUnitKey: superUnitKey,
                unitKey: unitKey,
                podKey: podKey
            }
        } else {
            result = undefined
        }
        return result

    }

    editGrade(podNumber, newGrade) {
        const keys = this.getPodFromNumber(podNumber);
        if (keys) {
            this.map[keys.superUnitKey].units[keys.unitKey].pods[keys.podKey].grade = newGrade;
        }

    }

    calculateUnitLevel(superUnitKey, unitKey) {
        let currentLevel = 0;
        if (this.map[superUnitKey].units[unitKey].pods) {
            Object.values(this.map[superUnitKey].units[unitKey].pods).forEach((pod) => {
                currentLevel += pod.grade / 20 * pod.value;
            });
        }
        this.map[superUnitKey].units[unitKey].level = currentLevel;
    }

    calculateAllUnitLevels() {
        Object.keys(this.map).forEach((superUnitKey) => {
            if (this.map[superUnitKey].units) {
                Object.keys(this.map[superUnitKey].units).forEach((unitKey) => {
                    this.calculateUnitLevel(superUnitKey, unitKey);
                });
            }
        });
    }

    calculateOverallLevel() {
        let sumOfLevels = 0;
        Object.values(this.map).forEach((superUnit) => {
            if (superUnit.units) {
                Object.values(superUnit.units).forEach((unit) => {
                    console.log(unit.level, unit.number);
                    sumOfLevels += unit.level;
                });
            }
        });
        this.overallLevel = Math.floor(sumOfLevels);
        return this.overallLevel;
    }
}
const newGradeMap = new GradeMap();
newGradeMap.editGrade(50101, 15);
newGradeMap.editGrade(60101, 20);
newGradeMap.editGrade(70101, 20);
newGradeMap.editGrade(40101, 20);

newGradeMap.calculateAllUnitLevels();

// console.log(newGradeMap.map['mechanics'].units['forward_kinematics_qualitative']);
console.log(newGradeMap.calculateOverallLevel());

/*
To do:
check that the way i am looking up pods is correct
when someone logs in, get all of their grades from the database and then enter them into the object
then store the grade object in a cookie
 */