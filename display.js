const unitMap = require(__dirname + '/public/unit_map');
const { availableContent } = require('./findAvailableContent.js');

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
        courseLevel: req.courseLevel
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
            gradeMap: req.gradeMap
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
            gradeMap: req.gradeMap
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
        gradeMap: req.gradeMap
    });
};


display_super_unit_page = (req,res) => {
    let superUnit = unitMap[req.params.superUnitKey];
    res.render('units/' + req.params.superUnitKey + '/' + req.params.superUnitKey + '_super_unit_page.hbs', {
        layout: 'superUnitPageLayout.hbs',
        selectedSuperUnitKey: req.params.superUnitKey,
        title: superUnit.title,
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap
    })
};

display_unit_page = (req, res) => {
    unitCluster = unitMap[req.params.unitClusterKey];
    unit = unitCluster.units[req.params.unitKey];
    res.render('units/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.unitKey + '_unit_page.hbs', {
        layout: 'unitPageLayout.hbs',
        title: unit.title,
        selectedUnitClusterKey: req.params.unitClusterKey,
        selectedUnitKey: req.params.unitKey,
        unitClusterName: unitCluster.title,
        unitNumber: unitMap[req.params.unitClusterKey].number * 100 + unitMap[req.params.unitClusterKey].units[req.params.unitKey].number,
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap
    });
};

display_pod_page = (req, res) => {
    let superUnit = unitMap[req.params.superUnitKey];
    let unit = superUnit.units[req.params.unitKey];
    let pod = unit.pods[req.params.podKey];
    let title = pod.title;
    let format = availableContent[req.params.superUnitKey].units[req.params.unitKey].pods[req.params.podKey].format;
    if (pod.subtitle) {
        title = title + `: ${pod.subtitle}`;
    }
    if (format === 'hbs') {
        res.render('units/' + req.params.superUnitKey + '/' + req.params.unitKey + '/pods/' + req.params.podKey + '.hbs', {
            layout: "podPageLayout.hbs",
            unitName: unitMap[req.params.superUnitKey].units[req.params.unitKey].title,
            title: title,
            level: pod.level,
            superUnitKey: req.params.superUnitKey,
            unitKey: req.params.unitKey,
            podKey: req.params.podKey,
            objective: pod.objective,
            backLink: `/unit/${req.params.superUnitKey}/${req.params.unitKey}`,
            //    assetPath: '/podAssets/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.podKey + '/',
            letter: pod.letter,
            unitNumber: unitMap[req.params.superUnitKey].number * 100 + unitMap[req.params.superUnitKey].units[req.params.unitKey].number,
            unitClusterName: unitMap[req.params.superUnitKey].title,
            user: req.user,
            section: req.section,
            overallLevel: req.overallLevel,
            gradeMap: req.gradeMap
        });
    } else if (format === 'pdf') {
        let filePath = '/content/units/' + req.params.superUnitKey + '/' + req.params.unitKey + '/pods/' + req.params.podKey + '.pdf';
        fs.readFile(__dirname + filePath , function (err,data){
            res.contentType("application/pdf");
            res.send(data);
        });
        /* var file = fs.createReadStream(filePath);
        var stat = fs.statSync(filePath);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
        file.pipe(res);
        */
    }
};

display_lab_list_page = (req, res) => {
    res.render('labsEntryPage.hbs', {
        layout:'default',
        title:'Labs',
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap
    });
};

display_problemSet_list_page = (req, res) => {
    res.render('problemSetsEntryPage.hbs', {
        layout:'default',
        title:'Problem Set',
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap
    });
};

display_lab_page = (req, res) => {
    res.render(__dirname + '/content/labs/' + req.params.labKey + '.hbs', {
        layout: 'default',
        title: 'Lab',
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap
    });
};

display_problemSet_page = (req, res) => {
    res.render(__dirname + '/content/problemSets/' + req.params.problemSetKey + '.hbs', {
        layout: 'default',
        title: 'Problem Set',
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap
    });
};

display_quiz_entry_page = (req, res) => {
    res.render('quizEntryPage.hbs', {
        layout: 'default',
        title: 'Quizzes',
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap
    });
};

display_quiz_unit_page = (req, res) => {
    res.render('unitQuizPage.hbs', {
        layout: 'default',
        title: unitMap[req.params.unitClusterKey].units[req.params.unitKey].title + " Quizzes",
        unitClusterName: unitMap[req.params.unitClusterKey].title,
        unitName: unitMap[req.params.unitClusterKey].units[req.params.unitKey].title,
        selectedUnitClusterKey: req.params.unitClusterKey,
        selectedUnitKey: req.params.unitKey,
        user: req.user,
        section: req.section,
        overallLevel: req.overallLevel,
        gradeMap: req.gradeMap
    })
};


function quizAccess(section, level, enteredPassword) {
    let result = false;
    if (section === "Red" || section || section === "Blue" || section === "Green" || section === 'Orange' || section === 'Violet') {
        result = false;
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
    let level = unitMap[req.params.unitClusterKey].units[req.params.unitKey].pods[req.params.podKey].level;
    let section;
    if (req.section) {
        section = req.section.name;
    } else {
        section = false;
    }
    let enteredPassword = req.body.password;
    if (quizAccess(section, level, enteredPassword)) {
        if (req.params.podKey === 'all') {
            res.render('allQuizzesInAUnit.hbs', {
                layout: 'default',
                selectedUnitClusterKey: req.params.unitClusterKey,
                selectedUnitKey: req.params.unitKey,
                user: req.user,
                section: req.section,
                overallLevel: req.overallLevel,
                gradeMap: req.gradeMap
            })
        } else {
            let versionNumber = quizMap[req.params.unitClusterKey][req.params.unitKey][req.params.podKey].versions;
            let versionType = quizMap[req.params.unitClusterKey][req.params.unitKey][req.params.podKey].fileType;
            if (versionType === 'hbs') {
                res.render('quizzes/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.podKey + '/v' + String(versionNumber) +'.hbs', {
                    layout: 'quizPageLayout.hbs',
                    selectedUnitClusterKey: req.params.unitClusterKey,
                    selectedUnitKey: req.params.unitKey,
                    letter: unitMap[req.params.unitClusterKey].units[req.params.unitKey].pods[req.params.podKey].letter,
                    title: unitMap[req.params.unitClusterKey].units[req.params.unitKey].pods[req.params.podKey].title,
                    unitNumber: unitMap[req.params.unitClusterKey].number * 100 + unitMap[req.params.unitClusterKey].units[req.params.unitKey].number,
                    unitTitle: unitMap[req.params.unitClusterKey].units[req.params.unitKey].title,
                    unitClusterTitle: unitMap[req.params.unitClusterKey].title,
                    level: unitMap[req.params.unitClusterKey].units[req.params.unitKey].pods[req.params.podKey].level,
                    version: versionNumber,
                    user: req.user,
                    section: req.section,
                    overallLevel: req.overallLevel,
                    gradeMap: req.gradeMap
                });
            } else if (versionType === 'pdf') {
                let filePath = '/content/quizzes/' + req.params.unitClusterKey + '/' + req.params.unitKey + '/' + req.params.podKey + '/v' + String(versionNumber) +'.pdf';
                fs.readFile(__dirname + filePath , function (err,data){
                    res.contentType("application/pdf");
                    res.send(data);
                });
            }
        }
    } else {
        let action = `/quizzes/${req.params.unitClusterKey}/${req.params.unitKey}/${req.params.podKey}`;
        res.render('quizPasswordPage.hbs', {
            layout: 'default',
            selectedUnitClusterKey: req.params.unitClusterKey,
            selectedUnitKey: req.params.unitKey,
            selectedPodKey: req.params.podKey,
            user: req.user,
            section: req.section,
            action: action,
            overallLevel: req.overallLevel,
            gradeMap: req.gradeMap
        });
    }
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
    display_quiz_unit_page,
    display_quiz
};
