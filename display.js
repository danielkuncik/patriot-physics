const unitMap = require(__dirname + '/public/unit_map');
const { availableContent } = require('./findAvailableContent.js');
const fs = require('fs');

const hbs = require('express-hbs');


const quizPassword = 'antarctica';



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
        totalAttempts: req.totalAttemps,
        flashMessage: req.body.flashMessage
       // flash: req.flash
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
            newPath: req.newPath
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
            totalAttempts: req.totalAttemps
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
        totalAttempts: req.totalAttemps
    });
};


display_super_unit_page = (req,res) => {
    let superUnit = unitMap[req.superUnitKey];
    res.render('unit/' + req.superUnitKey + '/' + req.superUnitKey + '_super_unit_page.hbs', {
        layout: 'superUnitPageLayout.hbs',
        selectedSuperUnitKey: req.superUnitKey,
        title: superUnit.title,
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap,
        totalAttempts: req.totalAttemps
    })
};

display_unit_page = (req, res) => {
    let unitCluster = unitMap[req.superUnitKey];
    let unit = unitCluster.units[req.unitKey];
    res.render('unit/' + req.superUnitKey + '/' + req.unitKey + '/' + req.unitKey + '_unit_page.hbs', {
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
        backLink: `/superUnit/${unitCluster.uuid}`
    });
};

display_pod_page = (req, res) => {
    const superUnit = unitMap[req.superUnitKey];
    const unit = superUnit.units[req.unitKey];
    const pod = unit.pods[req.podKey];
    const loggedIn = !!req.user;
    let format = availableContent[req.superUnitKey].units[req.unitKey].pods[req.podKey].format;
    const unitNumber = unitMap[req.superUnitKey].number * 100 + unitMap[req.superUnitKey].units[req.unitKey].number;
    let title = `${unitNumber}-${pod.letter}: ${pod.title}`;
    if (pod.subtitle) {
        title = title + `: ${pod.subtitle}`;
    }
    if (format === 'hbs') {
        res.render('unit/' + req.superUnitKey + '/' + req.unitKey + '/pods/' + req.podKey + '.hbs', {
            layout: "podPageLayout.hbs",
            unitName: unitMap[req.superUnitKey].units[req.unitKey].title,
            title: title,
            level: pod.level,
            superUnitKey: req.superUnitKey,
            unitKey: req.unitKey,
            podKey: req.podKey,
            objective: pod.objective,
            content: pod.content,
            backLink: `/unit/${req.superUnitKey}/${req.unitKey}`,
            //    assetPath: '/podAssets/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.podKey + '/',
            letter: pod.letter,
            unitNumber: unitNumber,
            unitClusterName: unitMap[req.superUnitKey].title,
            user: req.user,
            loggedIn: loggedIn,
            section: req.section,
            overallLevel: req.overallLevel,
            gradeMap: req.gradeMap,
            previousAttempts: req.previousAttempts,
            ungradedQuizzes: req.ungradedQuizzes,
            totalAttempts: req.totalAttemps,
            backLink: `/unit/${unit.uuid}`
        });
    } else if (format === 'pdf') {
        let filePath = '/content/unit/' + req.superUnitKey + '/' + req.unitKey + '/pods/' + req.podKey + '.pdf';
        fs.readFile(__dirname + filePath , function (err,data){
            res.contentType("application/pdf");
            res.send(data);
        });
    }

};

const display_practice_submission_page = (req, res) => {
    res.render('practiceSubmission.hbs', {
        layout: "default.hbs"
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
        totalAttempts: req.totalAttemps
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
        totalAttempts: req.totalAttemps
    });
};

display_lab_page = (req, res) => {
    res.render(__dirname + '/content/labs/' + req.params.labKey + '.hbs', {
        layout: 'default',
        title: 'Lab',
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap,
        totalAttempts: req.totalAttemps
    });
};

display_problemSet_page = (req, res) => {
    res.render(__dirname + '/content/problemSets/' + req.params.problemSetKey + '.hbs', {
        layout: 'default',
        title: 'Problem Set',
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap,
        totalAttempts: req.totalAttemps
    });
};

display_quiz_entry_page = (req, res) => {
    const superUnit = unitMap[req.keys.superUnitKey];
    const unit = superUnit.units[req.keys.unitKey];
    const pod = unit.pods[req.keys.podKey];
    const unitNumber = superUnit.number * 100 + unit.number;
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
        uuid: req.params.uuid,
        passwordAccessRequired: req.passwordAccessRequired,
        memorizationQuiz: req.memorizationQuiz,
        nonMemorizationMessage: req.passwordAccessRequired & !req.memorizationQuiz & !req.quizLock,
        quizLock: req.quizLock
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

display_quiz = (req, res) => {
    let available = availableContent[req.keys.superUnitKey].units[req.keys.unitKey].pods[req.keys.podKey].quizzes;
    if (!available) {
        res.redirect('/');
    }
    if (!req.user) {
        res.redirect('/login');
    }
    let alreadyPassed;
    if (req.gradeMap) {
        alreadyPassed = req.gradeMap[req.keys.superUnitKey].units[req.keys.unitKey].pods[req.keys.podKey].score === 20;
    }
    const inClass = req.passwordAccessRequired;
    let versionNumber = availableContent[req.keys.superUnitKey].units[req.keys.unitKey].pods[req.keys.podKey].numberOfVersions;
    const unitNumber = unitMap[req.keys.superUnitKey].number * 100 + unitMap[req.keys.superUnitKey].units[req.keys.unitKey].number;
    const letter = unitMap[req.keys.superUnitKey].units[req.keys.unitKey].pods[req.keys.podKey].letter;
    const podTitle = unitMap[req.keys.superUnitKey].units[req.keys.unitKey].pods[req.keys.podKey].title;
    const title = `Miniquiz: ${unitNumber}-${letter}: ${podTitle}`;
    res.render('quizzes/' + req.keys.superUnitKey + '/' + req.keys.unitKey + '/' + req.keys.podKey + '/v' + String(versionNumber) +'.hbs', {
        layout: 'quizPageLayout.hbs',
        selectedUnitClusterKey: req.keys.superUnitKey,
        selectedUnitKey: req.keys.unitKey,
        selectedPodKey: req.keys.podKey,
        letter: unitMap[req.keys.superUnitKey].units[req.keys.unitKey].pods[req.keys.podKey].letter,
        title: title,
        pod_uuid: req.params.uuid,
        unitNumber: unitMap[req.keys.superUnitKey].number * 100 + unitMap[req.keys.superUnitKey].units[req.keys.unitKey].number,
        backLink: `/pod/${req.params.uuid}`,
        unitTitle: unitMap[req.keys.superUnitKey].units[req.keys.unitKey].title,
        unitClusterTitle: unitMap[req.keys.superUnitKey].title,
        level: unitMap[req.keys.superUnitKey].units[req.keys.unitKey].pods[req.keys.podKey].level,
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
        noSubmission: alreadyPassed
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
    //             let filePath = '/content/quizzes/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.podKey + '/v' + String(versionNumber) +'.pdf';
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
    display_practice_submission_page
};
