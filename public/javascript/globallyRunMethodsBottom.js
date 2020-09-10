/*
This javascript file contains method that are run as a part of every page
 */

// automatically correctly numbers multiple lists of questions
// eg. so if the first list has 4 questions, the next will start with question 5
// and automatically creates a list of answers
// whenever I want to ask questions in a file, put them in <ol class = 'questionList'>
// each question should be in an li tag: <li data-answer = 'answer here'>
// and at the end of the file place <ol class = 'answerList'>
function createQuestionAndAnswerList() {
    if (questionListAlreadyCreated) {
        return undefined
    }
    let i, j, thisQuestionList, thisQuestion, thisAnswer, questionNumber = 1, thisAnswerID;
    let withLetter;
    if (typeof(letter) === 'undefined') {
        withLetter = false;
    } else {
        withLetter = true;
    }
    let collectedAnswerIds = [];
    $(".questionList").each((i) => {
        thisQuestionList = $(".questionList")[i];
        $(thisQuestionList).attr('start',String(questionNumber));
        $(thisQuestionList).find("li.question").each((j) => {
            thisQuestion = $(thisQuestionList).find("li.question")[j];
            if (withLetter) {
                $(thisQuestion).prepend(`<strong>${letter}.${questionNumber}: &nbsp; &nbsp; </strong> `);
            } else {
                $(thisQuestion).prepend(`<strong>${questionNumber}: &nbsp; </strong> `);
            }
            if ($(thisQuestion).data()['answer'] !== undefined) {
                thisAnswer = $(thisQuestion).data()['answer'];
                if (withLetter) {
                    $(".answerList").append(`<li class = 'answer'>${letter}.${questionNumber}: &nbsp; &nbsp; ${thisAnswer}</li>`);
                } else {
                    $(".answerList").append(`<li class = 'answer'>${questionNumber}: &nbsp; &nbsp; ${thisAnswer}</li>`);
                }
            } else if ($(thisQuestion).data()['answer_id'] !== undefined) {
                thisAnswerID = $(thisQuestion).data()['answer_id'];
                if (withLetter) {
                    $(".answerList").append(`<li class = 'answer' id = '${thisAnswerID}'>${letter}.${questionNumber}:<br></li>`);
                } else {
                    $(".answerList").append(`<li class = 'answer' id = '${thisAnswerID}'>${questionNumber}:<br></li>`);
                }

                // object defined in fglobally run methods at the top
                collectedAnswerIds.push(thisAnswerID);
//                $(`#${thisAnswerID}`).append($(answerObjects[thisAnswerID]));
            } else if ($(thisQuestion).find("ol.subQuestionList").length === 1) {//isXinArray('ol.subQuestionList', $(thisQuestion).children() )) {
                let subQuestionList, thisSubQuestion, subAnswerList, k, thisSubAnswer, subAnswerListType;
                subQuestionList = $(thisQuestion).find("ol.subQuestionList")[0];
                subAnswerListType = $(subQuestionList).attr('type');
                subAnswerList = $(`<ol type = ${subAnswerListType}></ol>`); // make this changeable?
                $(subQuestionList).find("li.subQuestion").each((k) => {
                    thisSubQuestion = $(subQuestionList).find("li.subQuestion")[k];
                    if ($(thisSubQuestion).data()['answer'] !== undefined) {
                        thisSubAnswer = $(thisSubQuestion).data()['answer'];
                        $(subAnswerList).append(`<li class = 'subAnswer'> &nbsp; &nbsp; ${thisSubAnswer}</li>`);
                    } else if (($(thisSubQuestion).data()['answer_id'] !== undefined)) {
                        let thisSubAnswerID = $(thisSubQuestion).data()['answer_id'];
                        $(subAnswerList).append(`<li class = 'subAnswer' id = '${thisSubAnswerID}'> <br> </li>`);
                        collectedAnswerIds.push(thisSubAnswerID);
                    } else {
                        thisSubAnswer = 'xxx';
                        $(subAnswerList).append(`<li class = 'subAnswer'>${thisSubAnswer}</li>`);
                    }
                });
                if (withLetter) {
                    thisAnswer = $(`<li>${letter}.${questionNumber}: &nbsp; &nbsp; </li>`);
                } else {
                    thisAnswer = $(`<li>${questionNumber}: &nbsp; &nbsp; </li>`);
                }
                $(thisAnswer).append(subAnswerList);
                $(".answerList").append(thisAnswer);
            } else {
                thisAnswer = 'xxx';
                if (withLetter) {
                    $(".answerList").append(`<li class = 'answer'>${letter}.${questionNumber}: ${thisAnswer}</li>`);
                } else {
                    $(".answerList").append(`<li class = 'answer'>${questionNumber}: ${thisAnswer}</li>`);
                }
            }
            questionNumber += 1;
        });
    });
    collectedAnswerIds.forEach((answerId) => {
        if (answerObjects[answerId]) {
            $(`#${answerId}`).append(answerObjects[answerId]);
        }
    });
    questionListAlreadyCreated = true;
}


createQuestionAndAnswerList();



// append all items in the answerID object into the lesson
$("ol.answerList").prepend($("<h4 class = 'answerHeader'>Answers:</h4>"))

/// for any <p class = 'directions>
// automatically palces the term "Directons" in bold at the front
$(".directions").prepend($("<strong>Directions: </strong>"));

$(".introduction").prepend($("<strong>Introduction: </strong>"));


$(".imageCredit").prepend($("<span>Image Credit: </span>"));
$(".videoCredit").prepend($("<span>Video Credit: </span>"));
$(".videoCredit").prepend($("<span>Data Credit: </span>"));



$(".definition").each((i) => {
    let thisDefinition = $(".definition")[i];
    if ($(thisDefinition).data()['word']) {
        let word = $(thisDefinition).data()['word'];
        $(thisDefinition).prepend(`<strong>${word}</strong><br><br>`);
    }
});

// $(".principleList").each((i) => {
//     let thisDefinition = $(".principleList")[i];
//     if ($(thisDefinition).data()['word']) {
//         let word = $(thisDefinition).data()['word'];
//         $(thisDefinition).prepend(`<strong>${word}</strong><br><br>`);
//     }
// });


// automatically places a box to sovle formula problems in any <div class = 'formulaBoxDiv'>
// let myFormulaBox = new formulaBox();
// myFormulaBox.insertTableByClass('formulaBoxDiv');
let formulaSolvingTable2 = new FormulaSolvingTable();
$(".formulaSolvingTable").append(formulaSolvingTable2.draw(600,300));



/// answer button
// console.log($("div.answerButton"));
$("div.addAnswerButton").append($("<button class = 'answerButton' onclick = 'clickAnswerButton()'>ANSWER</button>"));

function clickAnswerButton() {
    let allRight = true;
    Object.keys(pageAnswers).forEach((uuid) => {
        let inputSpace = $(`#${uuid}`);
        const input = $(inputSpace).val();
        if (input === '') {
            $(inputSpace).removeClass('border border-danger'); // delete class first?
            $(inputSpace).removeClass('border border-success'); // delete class first?
            allRight = false;
            return undefined
        }
        const result = checkAnswer(uuid, input);
        if (result.correct) {
            $(inputSpace).removeClass('border border-danger'); // delete class first?
            $(inputSpace).addClass('border border-success'); // delete class first?
        } else {
            $(inputSpace).removeClass('border border-success'); // delete class first?
            $(inputSpace).addClass('border border-danger');
            allRight = false;
        }
        if (result.comment) {
            $(`#comment-${uuid}`).append(`<span>${result.comment}</span>`);
        }
    });
    if (allRight) {
        $("button.answerButton").empty();
        $("button.answerButton").append("<span>😎</span>");
    } else {
        $("button.answerButton").empty();
        $("button.answerButton").append("<span>ANSWER</span>");
    }
}

let currentBackground = 'light';



function goDark() {
    // $(".bg-light").addClass("bg-dark");
    // $(".bg-light").removeClass("bg-light");
    $("body").removeClass("bg-light");
    $("body").addClass('bg-dark');
    $("body").removeClass('text-dark');
    $("body").addClass("text-light");

    $("div.card-body").removeClass("bg-light");
    $("div.card-body").addClass('bg-dark');
    $("div.card-body").removeClass('text-dark');
    $("div.card-body").addClass("text-light");

    $("div.bingoSpace").removeClass("bg-light text-dark");
    $("div.bingoSpace").removeClass("border border-dark");
    $("div.bingoSpace").addClass("bg-dark text-light");
    $("div.bingoSpace").addClass("border border-light");

    $("div.bingoClickedSpace").removeClass("bg-dark text-light");
    $("div.bingoClickedSpace").removeClass("border border-light");
    $("div.bingoClickedSpace").addClass("bg-light text-dark");
    $("div.bingoClickedSpace").addClass("border border-dark");


    $("#backgroundButton").removeClass("bg-dark text-warning");
    $("#backgroundButton").addClass("bg-light text-dark");
    $("#backgroundButton").text('Light Background');

    currentBackground = 'dark';
}

function goLight() {
    // $(".bg-dark").addClass("bg-light");
    // $(".bg-dark").removeClass("bg-dark");

    $("body").removeClass('bg-dark');
    $("body").addClass("bg-light");
    $("body").removeClass("text-light");
    $("body").addClass('text-dark');

    $("div.card-body").removeClass("bg-dark");
    $("div.card-body").addClass('bg-light');
    $("div.card-body").removeClass('text-light');
    $("div.card-body").addClass("text-dark");

    $("div.bingoSpace").removeClass("bg-dark text-light");
    $("div.bingoSpace").addClass("bg-light text-dark");
    $("div.bingoSpace").removeClass("border border-light");
    $("div.bingoSpace").addClass("border border-dark");


    $("div.bingoClickedSpace").removeClass("bg-light text-dark border-light");
    $("div.bingoClickedSpace").addClass("bg-dark text-light border-dark");
    $("div.bingoClickedSpace").removeClass("border border-dark");
    $("div.bingoClickedSpace").addClass("border border-light");


    $("#backgroundButton").removeClass("bg-light text-dark");
    $("#backgroundButton").addClass("bg-dark text-warning");
    $("#backgroundButton").text('Dark Background');
    currentBackground = 'light';
}

$("button#backgroundButton").click(() => {
    if (currentBackground === 'dark') {
        goLight();
    } else if (currentBackground === 'light') {
        goDark();
    }
});

