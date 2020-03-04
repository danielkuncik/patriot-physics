const Pool = require('pg').Pool;
const isProduction = process.env.NODE_ENV === 'production';
const bodyParser = require('body-parser');


require('dotenv').config();

const connectionStringForDevelopment =
    `pstgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionStringForDevelopment,
    ssl: isProduction,
});


function getCourseLevel(section) {
    let courseLevel;
    if (section === 'Violet') {
        courseLevel = 'AP';
    } else if (section === 'Red' || section === 'Blue' || section === 'Green') {
        courseLevel = 'Honors';
    } else if (section === 'Orange') {
        courseLevel = 'A_Level';
    } else {
        courseLevel = undefined;
    }
    return courseLevel
}


check_login = (req, res, next) => {
    let inputtedName = req.body.name;
    let inputtedPasscode = Number(req.body.passcode);

    pool.query('SELECT * FROM students WHERE name = $1', [inputtedName], (error, result) => {
        if (error) {
            throw error
        }
        if (result.rows.length > 0) {
            if (result.rows[0].passcode === inputtedPasscode) {
                req.session.student = result.rows[0];
                pool.query('SELECT * FROM sections WHERE id = $1', [req.session.student.section_id], (err, result2) => {
                    if (error) {
                        throw error
                    }
                    if (result2.rows.length > 0) {
                        req.session.section = result2.rows[0];
                        req.session.courseLevel = getCourseLevel(result2.rows[0].name);
                        next();
                    } else {
                        next();
                    }
                });
            } else {
                next();
            }
        } else {
            next();
        }
    });
};

const unitMap2 = require(__dirname + '/public/unit_map');


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

const requirements = {
    "AP": {
        "fundamental_forces": {
            "inverse_square_laws": [0,50,65,75,85,95,100]
        }
    },
    "Honors": {
        "mechanics": {
            "quantitative_dynamics": [0,75,85,95,100],
            "conservation_of_energy_quantitative": [0,75,85,95,100]
        }
    },
    "A_Level": {
        "mechanics": {
            "quantitative_dynamics": [0,85,95,100],
            "conservation_of_energy_quantitative": [0,85,95,100]
        }
    }
};

function getGradeFromLevel(level, gradeArray) {
    const floorLevel = Math.floor(level);
    const levelDecimal = level - floorLevel;
    let grade;
    if (floorLevel >= gradeArray.length - 1) {
        grade = 100;
    } else {
        let start = gradeArray[floorLevel];
        let extra = (gradeArray[floorLevel + 1] - gradeArray[floorLevel]) * levelDecimal;
        grade = start + extra;
    }
    return grade
}

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
                                score: 0,
                                pending: false
                            };
                            let podCode = 10000*alphabetDictionary[pod.letter] + 100 * superUnit.number + unit.number;
                            this.quizCodes[podCode] = {
                                podKey: podKey,
                                unitKey: unitKey,
                                superUnitKey: superUnitKey
                            };
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

    editGrade(podNumber, newGrade) {
        const keys = this.quizCodes[podNumber];
        if (keys) {
            this.map[keys.superUnitKey].units[keys.unitKey].pods[keys.podKey].score = newGrade;
        }

    }

    calculateUnitLevel(superUnitKey, unitKey) {
        let currentLevel = 0;
        if (this.map[superUnitKey].units[unitKey].pods) {
            Object.values(this.map[superUnitKey].units[unitKey].pods).forEach((pod) => {
                currentLevel += pod.score / 20 * pod.value;
            });
        }
        let roundedLevel = Math.floor(currentLevel * 10) / 10;
        this.map[superUnitKey].units[unitKey].level = roundedLevel;
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
                    sumOfLevels += unit.level;
                });
            }
        });
        this.overallLevel = Math.floor(sumOfLevels);
        return this.overallLevel;
    }

    printAllGrades() {
        Object.values(this.quizCodes).forEach((quizCode) => {
            let pod = this.map[quizCode.superUnitKey].units[quizCode.unitKey].pods[quizCode.podKey];
            if (pod.score > 0) {
                console.log(quizCode.superUnitKey, quizCode.unitKey, quizCode.podKey, pod);
            }
        });
    }

    calculateGrades(courseLevel) {
        const reqs = requirements[courseLevel];
        Object.keys(reqs).forEach((superUnitKey) => {
            Object.keys(reqs[superUnitKey]).forEach((unitKey) => {
                let gradeArray = reqs[superUnitKey][unitKey];
                let level = this.map[superUnitKey].units[unitKey].level;
                this.map[superUnitKey].units[unitKey].grade = getGradeFromLevel(level, gradeArray);
            });
        });
    }
}



load_grades = function(req, res, next) {
    let newGradeMap = new GradeMap();

    if (req.session.student) {
        //    pool.query('SELECT * FROM students WHERE name = $1', [inputtedName], (error, result) => {
        pool.query('SELECT * FROM grades WHERE student_id = $1', [req.session.student.id], (error, result) => {
            if (error) {
                throw error
            }
            result.rows.forEach((grade) => {
                newGradeMap.editGrade(grade.pod_id, grade.score);
            });
            newGradeMap.calculateAllUnitLevels();
            newGradeMap.calculateGrades(req.session.courseLevel);
            req.session.gradeMap = newGradeMap.map;
            req.session.overallLevel = newGradeMap.calculateOverallLevel();
            next();
        });
    } else {
        next();
    }
};


check_if_logged_in = function(req, res, next) {
    if (req.session.student) {
        req.user = req.session.student;
    } else {
        req.user = undefined;
    }
    if (req.session.section) {
        req.section = req.session.section;
    } else {
        req.section = undefined;
    }
    if (req.session.courseLevel) {
        req.courseLevel = req.session.courseLevel;
    } else {
        req.courseLevel = undefined;
    }
    if (req.session.gradeMap && req.session.overallLevel) {
        req.gradeMap = req.session.gradeMap;
        req.overallLevel = req.session.overallLevel;
    } else {
        req.gradeMap = undefined;
        req.overallLevel = undefined;
    }

    next();
};


module.exports = {
    check_login,
    check_if_logged_in,
    load_grades
};