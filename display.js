const unitMap = require(__dirname + '/public/unit_map');
const { availableContent } = require('./findAvailableContent.js');
const fs = require('fs');

const hbs = require('express-hbs');


const gradeScale = require(__dirname + '/gradingScale.json');



display_home = (req,res) => {
    res.render('home.hbs', {
        layout: 'default',
        // template:'home-template',
        title: 'Home Page',
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap,
        courseLevel: req.courseLevel,
        year: req.year,
        totalAttempts: req.totalAttemps,
        flashMessage: req.body.flashMessage,
       // flash: req.flash,
        successFlash: req.flash('successFlash'),
        dangerFlash: req.flash('dangerFlash'),
        scoreObject: req.scoreObject
    });
};

display_login_page = (req, res) => {
    if (!req.user) {
        res.render('loginPage.hbs', {
            layout: 'default',
            'title': 'Login Page',
            user: req.user,
            section: req.section,
            overallLevel: req.overallLevel,
            gradeMap: req.gradeMap,
            totalAttempts: req.totalAttemps,
            newPath: req.newPath,
            successFlash: req.flash('successFlash'),
            dangerFlash: req.flash('dangerFlash')
        });
    } else {
        res.redirect('/');
    }
};

display_logout_page = (req, res) => {
    if (!req.user) {
        res.redirect('/');
    } else {
        res.render('logoutPage.hbs', {
            layout: 'default',
            'title': 'Logout Page',
            user: req.user,
            section: req.section,
            overallLevel: req.overallLevel,
            gradeMap: req.gradeMap,
            totalAttempts: req.totalAttemps,
            successFlash: req.flash('successFlash'),
            dangerFlash: req.flash('dangerFlash')
        });
    }
};

display_units_entry_page = (req,res) => {
    res.render('unitsEntryPage.hbs', {
        layout:'default',
        title:'Units',
        unitMap:unitMap,
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap,
        totalAttempts: req.totalAttemps,
        successFlash: req.flash('successFlash'),
        dangerFlash: req.flash('dangerFlash')
    });
};


display_super_unit_page = (req,res) => {
    let superUnit = unitMap[req.superUnitKey];
    const filePath = `${req.superUnitKey}/super_unit_page.hbs`;
    //const pageString = 'unit/' + req.superUnitKey + '/' + req.superUnitKey + '_super_unit_page.hbs';
    res.render(filePath, {
        layout: 'superUnitPageLayout.hbs',
        selectedSuperUnitKey: req.superUnitKey,
        title: superUnit.title,
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap,
        totalAttempts: req.totalAttemps,
        successFlash: req.flash('successFlash'),
        dangerFlash: req.flash('dangerFlash')
    })
};

display_unit_page = (req, res) => {
    let unitCluster = unitMap[req.superUnitKey];
    let unit = unitCluster.units[req.unitKey];
    const filePath = `${req.superUnitKey}/${req.unitKey}/unit_page.hbs`;
    //const pageString = 'unit/' + req.superUnitKey + '/' + req.unitKey + '/' + req.unitKey + '_unit_page.hbs';
    res.render(filePath, {
        layout: 'unitPageLayout.hbs',
        title: unit.title,
        selectedUnitClusterKey: req.superUnitKey,
        selectedUnitKey: req.unitKey,
        unitClusterName: unitCluster.title,
        unitNumber: unitMap[req.superUnitKey].number * 100 + unitMap[req.superUnitKey].units[req.unitKey].number,
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap,
        totalAttempts: req.totalAttemps,
        backLink: `/superUnit/${unitCluster.id}`,
        successFlash: req.flash('successFlash'),
        dangerFlash: req.flash('dangerFlash')
    });
};

// repeated, also in helpers
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


display_pod_page = (req, res) => {
    const superUnit = unitMap[req.superUnitKey];
    const unit = superUnit.units[req.unitKey];
    const pod = unit.pods[req.podKey];
    const loggedIn = !!req.user;
    let format = availableContent[req.superUnitKey].units[req.unitKey].pods[req.podKey].format;
    const unitNumber = getUnitNumberString(unitMap[req.superUnitKey].number, unitMap[req.superUnitKey].units[req.unitKey].number);
    let title = `${unitNumber}-${pod.letter}: ${pod.title}`;
    if (pod.subtitle) {
        title = title + `: ${pod.subtitle}`;
    }
    const filePath = `${req.superUnitKey}/${req.unitKey}/${req.podKey}/pod_page.hbs`;
    res.render(filePath, {
        layout: "podPageLayout.hbs",
        quizAvailable: req.quizAvailable,
        unitName: unitMap[req.superUnitKey].units[req.unitKey].title,
        title: title,
        level: pod.level,
        superUnitKey: req.superUnitKey,
        unitKey: req.unitKey,
        podKey: req.podKey,
        objective: pod.objective,
        content: pod.content,
        backLink: `/unit/${unit.id}`,
        //    assetPath: '/podAssets/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.podKey + '/',
        letter: pod.letter,
        unitNumber: unitNumber,
        unitClusterName: unitMap[req.superUnitKey].title,
        user: req.user,
        loggedIn: loggedIn,
        notLoggedIn: !loggedIn,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap,
        previousAttempts: req.previousAttempts,
        previousPracticeSubmissions: req.previousPracticeSubmissions,
        ungradedQuizzes: req.ungradedQuizzes,
        totalAttempts: req.totalAttemps,
        practiceSubmissionLink: `/practiceSubmission/${req.pod_uuid}`,
        dueDateObject: req.dueObject,
        gradeObject: req.gradeObject,
        specificGradeMap: req.specificGradeMap,
        quizRequirementObject: req.quizRequirements,
        practiceRequirementObject: req.practiceObject,
        uuid: req.pod_uuid,
        id: req.params.id,
        flash: req.flashMessage ? req.flashMessage : '',
        practiceComments: req.practiceComments,
        successFlash: req.flash('successFlash'),
        dangerFlash: req.flash('dangerFlash'),
        scoreObject: req.scoreObject
        });
};

const display_quiz = (req, res) => {
    // all this should be worked out in advance!!
    let available = availableContent[req.superUnitKey].units[req.unitKey].pods[req.podKey].quizzes;
    if (!available) {
        res.redirect('/');
    }
    if (!req.user) {
        res.redirect('/login');
    }
    let alreadyPassed;
    if (req.gradeMap) {
        alreadyPassed = req.gradeMap[req.superUnitKey].units[req.unitKey].pods[req.podKey].score === 20;
    }
    const inClass = req.passwordAccessRequired;
    // version and uuid should be looked up already now
    let versionNumber = availableContent[req.superUnitKey].units[req.unitKey].pods[req.podKey].numberOfVersions;
    const unitNumber = getUnitNumberString(unitMap[req.superUnitKey].number, unitMap[req.superUnitKey].units[req.unitKey].number);
    const letter = unitMap[req.superUnitKey].units[req.unitKey].pods[req.podKey].letter;
    const podTitle = unitMap[req.superUnitKey].units[req.unitKey].pods[req.podKey].title;
    const title = `Miniquiz: ${unitNumber}-${letter}: ${podTitle}`;
    const filePath = `${req.superUnitKey}/${req.unitKey}/${req.podKey}/quizzes/v${versionNumber}.hbs`;
   // const quizString = 'quizzes/' + req.superUnitKey + '/' + req.unitKey + '/' + req.podKey + '/v' + String(versionNumber) +'.hbs';
    res.render(filePath, {
        layout: 'quizPageLayout.hbs',
        selectedUnitClusterKey: req.superUnitKey,
        selectedUnitKey: req.unitKey,
        selectedPodKey: req.podKey,
        letter: unitMap[req.superUnitKey].units[req.unitKey].pods[req.podKey].letter,
        title: title,
        pod_uuid: req.params.uuid,
        unitNumber: unitMap[req.superUnitKey].number * 100 + unitMap[req.superUnitKey].units[req.unitKey].number,
        backLink: `/pod/${req.params.id}`,
        unitTitle: unitMap[req.superUnitKey].units[req.unitKey].title,
        unitClusterTitle: unitMap[req.superUnitKey].title,
        level: unitMap[req.superUnitKey].units[req.unitKey].pods[req.podKey].level,
        version: versionNumber,
        user: req.user,
        userName: req.user.name,
        section: req.section,
        sectionName: req.section.name,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap,
        totalAttempts: req.totalAttemps,
        inClass: inClass,
        alreadyPassed: alreadyPassed,
        submitOnline: !inClass && !alreadyPassed,
        submitPaper: inClass && !alreadyPassed,
        noSubmission: alreadyPassed,
        successFlash: req.flash('successFlash'),
        dangerFlash: req.flash('dangerFlash'),
        id: req.params.id
    });

    // all quizzes open
    // let section;
    // if (req.section) {
    //     section = req.section.name;
    // } else {
    //     section = false;
    // }
    // let enteredPassword = req.body.password;
    // if (quizAccess(section, level, enteredPassword)) {
    //     if (req.params.podKey === 'all') {
    //         res.render('allQuizzesInAUnit.hbs', {
    //             layout: 'default',
    //             selectedUnitClusterKey: req.params.unitClusterKey,
    //             selectedUnitKey: req.params.unitKey,
    //             user: req.user,
    //             section: req.section,
    //             overallLevel: req.overallLevel,
    //             gradeMap: req.gradeMap
    //         })
    //     } else {
    //         let versionNumber = availableContent[req.params.unitClusterKey].unit[req.params.unitKey].pods[req.params.podKey].numberOfVersions;
    //         let versionType = 'hbs'; // all quizzes will be hbs from now on
    //         if (versionType === 'hbs') {
    //             res.render('quizzes/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.podKey + '/v' + String(versionNumber) +'.hbs', {
    //                 layout: 'quizPageLayout.hbs',
    //                 selectedUnitClusterKey: req.params.unitClusterKey,
    //                 selectedUnitKey: req.params.unitKey,
    //                 letter: unitMap[req.params.unitClusterKey].unit[req.params.unitKey].pods[req.params.podKey].letter,
    //                 title: unitMap[req.params.unitClusterKey].unit[req.params.unitKey].pods[req.params.podKey].title,
    //                 unitNumber: unitMap[req.params.unitClusterKey].number * 100 + unitMap[req.params.unitClusterKey].unit[req.params.unitKey].number,
    //                 unitTitle: unitMap[req.params.unitClusterKey].unit[req.params.unitKey].title,
    //                 unitClusterTitle: unitMap[req.params.unitClusterKey].title,
    //                 level: unitMap[req.params.unitClusterKey].unit[req.params.unitKey].pods[req.params.podKey].level,
    //                 version: versionNumber,
    //                 user: req.user,
    //                 section: req.section,
    //                 overallLevel: req.overallLevel,
    //                 gradeMap: req.gradeMap
    //             });
    //         } else if (versionType === 'pdf') {
    //             let filePath = '/oldContent/quizzes/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.podKey + '/v' + String(versionNumber) +'.pdf';
    //             fs.readFile(__dirname + filePath , function (err,data){
    //                 res.contentType("application/pdf");
    //                 res.send(data);
    //             });
    //         }
    //     }
    // } else {
    //     let action = `/quizzes/${req.params.unitClusterKey}/${req.params.unitKey}/${req.params.podKey}`;
    //     res.render('quizPasswordPage.hbs', {
    //         layout: 'default',
    //         selectedUnitClusterKey: req.params.unitClusterKey,
    //         selectedUnitKey: req.params.unitKey,
    //         selectedPodKey: req.params.podKey,
    //         user: req.user,
    //         section: req.section,
    //         action: action,
    //         overallLevel: req.overallLevel,
    //         gradeMap: req.gradeMap
    //     });
    // }
};


const display_practice_submission_page = (req, res) => {
    const superUnit = unitMap[req.superUnitKey];
    const unit = superUnit.units[req.unitKey];
    const pod = unit.pods[req.podKey];
    const loggedIn = !!req.user;
    const unitNumber = getUnitNumberString(unitMap[req.superUnitKey].number, unitMap[req.superUnitKey].units[req.unitKey].number);
    let title = `${unitNumber}-${pod.letter}: ${pod.title}`;
    if (pod.subtitle) {
        title = title + `: ${pod.subtitle}`;
    }

    res.render('practiceSubmission.hbs', {
        layout: "default.hbs",
        unitName: unitMap[req.superUnitKey].units[req.unitKey].title,
        title: title,
        level: pod.level,
        superUnitKey: req.superUnitKey,
        unitKey: req.unitKey,
        podKey: req.podKey,
        objective: pod.objective,
        content: pod.content,
        backLink: `/pod/${req.params.id}`,
        //    assetPath: '/podAssets/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.podKey + '/',
        letter: pod.letter,
        unitNumber: unitNumber,
        unitClusterName: unitMap[req.superUnitKey].title,
        user: req.user,
        loggedIn: loggedIn,
        section: req.section,
        overallLevel: req.overallLevel,
        totalAttempts: req.totalAttemps,
        submissionLink: `/submitPractice/${req.params.id}`,
        successFlash: req.flash('successFlash'),
        dangerFlash: req.flash('dangerFlash')
    })
};

display_lab_list_page = (req, res) => {
    res.render('labsEntryPage.hbs', {
        layout:'default',
        title:'Labs',
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap,
        totalAttempts: req.totalAttemps,
        successFlash: req.flash('successFlash'),
        dangerFlash: req.flash('dangerFlash')
    });
};

display_problemSet_list_page = (req, res) => {
    res.render('problemSetsEntryPage.hbs', {
        layout:'default',
        title:'Problem Set',
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap,
        totalAttempts: req.totalAttemps,
        successFlash: req.flash('successFlash'),
        dangerFlash: req.flash('dangerFlash')
    });
};

display_lab_page = (req, res) => {
    res.render(__dirname + '/oldContent/labs/' + req.params.labKey + '.hbs', {
        layout: 'default',
        title: 'Lab',
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap,
        totalAttempts: req.totalAttemps,
        successFlash: req.flash('successFlash'),
        dangerFlash: req.flash('dangerFlash')
    });
};

display_info_page = (req, res) => {
    res.render(__dirname + '/oldContent/information/' + req.params.infoKey + '.hbs', {
        layout: 'default',
        title: 'Lab',
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap,
        totalAttempts: req.totalAttemps,
        successFlash: req.flash('successFlash'),
        dangerFlash: req.flash('dangerFlash')
    });
};

display_scale_page = (req, res) => {
  res.render('scalePage.hbs', {
    layout: 'default',
    title: 'Scale Page',
    user: req.user,
    section: req.section,
    overallLevel: req.overallLevel,
    courseLevel: req.courseLevel,
    gradeMap: req.gradeMap,
    totalAttempts: req.totalAttemps,
    gradeScale: gradeScale,
    successFlash: req.flash('successFlash'),
    dangerFlash: req.flash('dangerFlash')
  })
};


display_problemSet_page = (req, res) => {
    res.render(__dirname + '/oldContent/problemSets/' + req.params.problemSetKey + '.hbs', {
        layout: 'default',
        title: 'Problem Set',
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap,
        totalAttempts: req.totalAttemps,
        successFlash: req.flash('successFlash'),
        dangerFlash: req.flash('dangerFlash')
    });
};

display_quiz_entry_page = (req, res) => {
    const superUnit = unitMap[req.superUnitKey];
    const unit = superUnit.units[req.unitKey];
    const pod = unit.pods[req.podKey];
    const unitNumber = getUnitNumberString(unitMap[req.superUnitKey].number, unitMap[req.superUnitKey].units[req.unitKey].number);
    const letter = pod.letter;
    const title = `${unitNumber}-${letter}: ${pod.title}`;
    // add info on the pod to this page!!
    res.render('quizEntryPage.hbs', {
        layout: 'default',
        title: title,
        podTitle: title,
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap,
        totalAttempts: req.totalAttemps,
        unitKey: req.unitKey,
        podKey: req.podKey,
        objective: pod.objective,
        content: pod.content,
        level: pod.level,
        topicTitle: unit.title,
        topicClusterTitle: superUnit.title,
        backLink: `/pod/${req.params.uuid}`,
        letter: pod.letter,
        unitNumber: unitNumber,
        unitClusterName: superUnit.title,
        previousAttempts: req.previousAttempts,
        id: req.params.id,
        passwordAccessRequired: req.passwordAccessRequired,
        memorizationQuiz: req.memorizationQuiz,
        nonMemorizationMessage: req.passwordAccessRequired & !req.memorizationQuiz & !req.quizLock,
        quizLock: req.quizLock,
        successFlash: req.flash('successFlash'),
        dangerFlash: req.flash('dangerFlash')
    });
};



function quizAccess(section, level, enteredPassword) {
    let result = false;
    if (section === "Red" || section || section === "Blue" || section === "Green" || section === 'Orange' || section === 'Violet') {
        result = true;
    }
    return result
    // if (section === "Violet") {
    //     if (level <= 2 || level >= 5) {
    //         result = true;
    //     } else if (enteredPassword === quizPassword) {
    //         result = true;
    //     } else {
    //         result = false;
    //     }
    // } else if (section === "Red" || section || section === "Blue" || section === "Green" || section === 'Orange') {
    //     if (level >= 5) {
    //         result = true;
    //     } else if (enteredPassword === quizPassword) {
    //         result = true;
    //     } else {
    //         result = false;
    //     }
    // } else {
    //     result = false;
    // }
    // return result
}

const display_quiz_new = (req, res) => {

};



module.exports = {
    display_home,
    display_login_page,
    display_logout_page,
    display_units_entry_page,
    display_super_unit_page,
    display_unit_page,
    display_pod_page,
    display_lab_list_page,
    display_lab_page,
    display_problemSet_list_page,
    display_problemSet_page,
    display_quiz_entry_page,
    display_quiz,
    display_quiz_new,
    display_practice_submission_page,
    display_info_page,
    display_scale_page
};
