const unitMap = require(__dirname + '/public/unit_map');
const shell = require('shelljs');

let availableContent = {};

function filesInDirectory(directoryName) {
    let array = shell.ls(directoryName).stdout.split('\n');
    array.pop();
    return array
}


const contentDirectory = `${__dirname}/content`;
const unitsDirectory = `${contentDirectory}/unit`;


/// check which super unit, unit and pod pages are available
const availableSuperUnits = filesInDirectory(unitsDirectory);
Object.keys(unitMap).forEach((superUnitKey) => {
    availableContent[superUnitKey] = {
        available: undefined,
        quizzes: undefined,
        units: {}
    };
    const superUnit = unitMap[superUnitKey];
    let availableUnitFolders;
    if (availableSuperUnits.includes(superUnitKey)) {
        availableUnitFolders = filesInDirectory(`${unitsDirectory}/${superUnitKey}`);
        if (availableUnitFolders.includes(`${superUnitKey}_super_unit_page.hbs`)) {
            availableContent[superUnitKey].available = true;
        } else {
            availableContent[superUnitKey].available = false;
            availableUnitFolders = [];
        }
    } else {
        availableContent[superUnitKey].available = false;
        availableUnitFolders = [];
    }
    Object.keys(superUnit.units).forEach((unitKey) => {
        const unit = superUnit.units[unitKey];
        availableContent[superUnitKey].units[unitKey] = {
            available: undefined,
            quizzes: undefined,
            pods: {}
        };
        let availablePods;
        if (availableUnitFolders.includes(unitKey)) {
            let filesInUnitFolder = filesInDirectory(`${unitsDirectory}/${superUnitKey}/${unitKey}`);
            if (filesInUnitFolder.includes('pods') && filesInUnitFolder.includes(`${unitKey}_unit_page.hbs`)) {
                availableContent[superUnitKey].units[unitKey].available = true;
                availablePods = filesInDirectory(`${unitsDirectory}/${superUnitKey}/${unitKey}/pods`);
            } else {
                availableContent[superUnitKey].units[unitKey].available = false;
                availablePods = [];
            }
        } else {
            availableContent[superUnitKey].units[unitKey].available = false;
            availablePods = [];
        }
        Object.keys(unit.pods).forEach((podKey) => {
            availableContent[superUnitKey].units[unitKey].pods[podKey] = {};
            if (availablePods.includes(`${podKey}.hbs`)) {
                availableContent[superUnitKey].units[unitKey].pods[podKey].available = true;
                availableContent[superUnitKey].units[unitKey].pods[podKey].format = 'hbs';
            } else if (availablePods.includes(`${podKey}.pdf`)) {  /// hopefully, these lines will soon be eliminated!
                availableContent[superUnitKey].units[unitKey].pods[podKey].available = true;
                availableContent[superUnitKey].units[unitKey].pods[podKey].format = 'pdf';
            } else {
                availableContent[superUnitKey].units[unitKey].pods[podKey].available = false;
            }
            availableContent[superUnitKey].units[unitKey].pods[podKey].quiz = undefined;
        });
    });
});


// quizzes will ONLY be made available if there is a corresponding pod Page in hbs that is available
// also, quizzes MUST be in hbs format
const quizzesDirectory = `${contentDirectory}/quizzes`;

const quizSuperUnitsAvailable = filesInDirectory(quizzesDirectory);

Object.keys(availableContent).forEach((superUnitKey) => {
    let availableUnitQuizzes = undefined;
    if (availableContent[superUnitKey].available && quizSuperUnitsAvailable.includes(superUnitKey)) {
        availableContent[superUnitKey].quizzes = true;
        availableUnitQuizzes = filesInDirectory(`${quizzesDirectory}/${superUnitKey}`);
    } else {
        availableContent[superUnitKey].quizzes = false;
        availableUnitQuizzes = [];
    }
    Object.keys(availableContent[superUnitKey].units).forEach((unitKey) => {
        let availablePodQuizzes = undefined;
        if (availableContent[superUnitKey].quizzes && availableContent[superUnitKey].units[unitKey].available && availableUnitQuizzes.includes(unitKey)) {
            availableContent[superUnitKey].units[unitKey].quizzes = true;
            availablePodQuizzes = filesInDirectory(`${quizzesDirectory}/${superUnitKey}/${unitKey}`);
        } else {
            availableContent[superUnitKey].units[unitKey].quizzes = false;
            availablePodQuizzes = [];
        }
        Object.keys(availableContent[superUnitKey].units[unitKey].pods).forEach((podKey) => {
            if (availableContent[superUnitKey].units[unitKey].quizzes && availableContent[superUnitKey].units[unitKey].pods[podKey].available && availablePodQuizzes.includes(podKey)) {
                // count versions!
                let availableVersions = filesInDirectory(`${quizzesDirectory}/${superUnitKey}/${unitKey}/${podKey}`);
                let count = 1;
                while (availableVersions.includes(`v${count}.hbs`)) {
                    count++;
                }
                count--;
                if (count > 0) {
                    availableContent[superUnitKey].units[unitKey].pods[podKey].quizzes = true;
                    availableContent[superUnitKey].units[unitKey].pods[podKey].numberOfVersions = count;
                } else {
                    availableContent[superUnitKey].units[unitKey].pods[podKey].quizzes = false;
                }
            } else {
                availableContent[superUnitKey].units[unitKey].pods[podKey].quizzes = false;
            }
        });
    });
});

module.exports = {
    availableContent
};