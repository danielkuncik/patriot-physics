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
        units: {}
    };
    const superUnit = unitMap[superUnitKey];
    let availableUnitFolders;
    if (availableSuperUnits.includes(superUnitKey)) {
        availableUnitFolders = filesInDirectory(`${contentDirectory}/${superUnitKey}`);
        if (availableUnitFolders.includes("super_unit_page.hbs")) {
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
            pods: {}
        };
        let availablePods;
        if (availableUnitFolders.includes(unitKey)) {
            let filesInUnitFolder = filesInDirectory(`${contentDirectory}/${superUnitKey}/${unitKey}`);
            if (filesInUnitFolder.includes('pods') && filesInUnitFolder.includes(`unit_page.hbs`)) {
                availableContent[superUnitKey].units[unitKey].available = true;
                availablePods = filesInUnitFolder;
            } else {
                availableContent[superUnitKey].units[unitKey].available = false;
                availablePods = [];
            }
        } else {
            availableContent[superUnitKey].units[unitKey].available = false;
            availablePods = [];
        }
        Object.keys(unit.pods).forEach((podKey) => {
            availableContent[superUnitKey].units[unitKey].pods[podKey] = {
                available: undefined,
                writtenQuizzes: undefined,
                numberWrittenQuizzes: 0,
                writtenAnswersAvailable: undefined,
                autoQuiz: undefined,
            };
            if (availablePods.includes(`${podKey}`)) {
                let podFolderFiles = filesInDirectory(`${contentDirectory}/${superUnitKey}/${unitKey}/${podKey}`);
                if (podFolderFiles.includes('pod_page.hbs')) {
                    availableContent[superUnitKey].units[unitKey].pods[podKey].available = true;

                    /// count quizzes here
                    if (podFolderFiles.includes('quizzes')) {
                        let quizFileContents = filesInDirectory(`${contentDirectory}/${superUnitKey}/${unitKey}/${podKey}/quizzes`);
                        availableContent[superUnitKey].units[unitKey].pods[podKey].autoQuiz = quizFileContents.includes('autoQuiz.json');
                        availableContent[superUnitKey].units[unitKey].pods[podKey].writtenAnswersAvailable = quizFileContents.includes('answers.json');

                        let count = 1;
                        while (quizFileContents.includes(`v${count}.hbs`)) {
                            count++;
                        }
                        count--;
                        if (count > 0) {
                            availableContent[superUnitKey].units[unitKey].pods[podKey].writtenQuizzes = true;
                            availableContent[superUnitKey].units[unitKey].pods[podKey].numberOfVersions = count;
                            // this is redundant????
                        } else {
                            availableContent[superUnitKey].units[unitKey].pods[podKey].writtenQuizzes = false;
                            availableContent[superUnitKey].units[unitKey].pods[podKey].numberOfVersions = 0;
                        }
                    }
                } else {
                    availableContent[superUnitKey].units[unitKey].pods[podKey].available = false;
                }
            }
        })
    });
});


// quizzes will ONLY be made available if there is a corresponding pod Page in hbs that is available
// // also, quizzes MUST be in hbs format
// const quizzesDirectory = `${contentDirectory}/quizzes`;
//
// const quizSuperUnitsAvailable = filesInDirectory(quizzesDirectory);
//
// Object.keys(availableContent).forEach((superUnitKey) => {
//     let availableUnitQuizzes = undefined;
//     if (availableContent[superUnitKey].available && quizSuperUnitsAvailable.includes(superUnitKey)) {
//         availableContent[superUnitKey].quizzes = true;
//         availableUnitQuizzes = filesInDirectory(`${quizzesDirectory}/${superUnitKey}`);
//     } else {
//         availableContent[superUnitKey].quizzes = false;
//         availableUnitQuizzes = [];
//     }
//     Object.keys(availableContent[superUnitKey].units).forEach((unitKey) => {
//         let availablePodQuizzes = undefined;
//         if (availableContent[superUnitKey].quizzes && availableContent[superUnitKey].units[unitKey].available && availableUnitQuizzes.includes(unitKey)) {
//             availableContent[superUnitKey].units[unitKey].quizzes = true;
//             availablePodQuizzes = filesInDirectory(`${quizzesDirectory}/${superUnitKey}/${unitKey}`);
//         } else {
//             availableContent[superUnitKey].units[unitKey].quizzes = false;
//             availablePodQuizzes = [];
//         }
//         Object.keys(availableContent[superUnitKey].units[unitKey].pods).forEach((podKey) => {
//             if (availableContent[superUnitKey].units[unitKey].quizzes && availableContent[superUnitKey].units[unitKey].pods[podKey].available && availablePodQuizzes.includes(podKey)) {
//                 // count versions!
//                 let availableVersions = filesInDirectory(`${quizzesDirectory}/${superUnitKey}/${unitKey}/${podKey}`);
//                 let count = 1;
//                 let answersAvailable = availableVersions.includes('answers.json');
//                 while (availableVersions.includes(`v${count}.hbs`)) {
//                     count++;
//                 }
//                 count--;
//                 if (count > 0) {
//                     availableContent[superUnitKey].units[unitKey].pods[podKey].quizzes = true;
//                     availableContent[superUnitKey].units[unitKey].pods[podKey].numberOfVersions = count;
//                     availableContent[superUnitKey].units[unitKey].pods[podKey].answersAvailable = answersAvailable;
//                 } else {
//                     availableContent[superUnitKey].units[unitKey].pods[podKey].quizzes = false;
//                 }
//             } else {
//                 availableContent[superUnitKey].units[unitKey].pods[podKey].quizzes = false;
//             }
//         });
//     });
// });

module.exports = {
    availableContent
};