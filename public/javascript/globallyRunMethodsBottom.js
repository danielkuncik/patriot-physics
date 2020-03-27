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

    $(".questionList").each((i) => {
        thisQuestionList = $(".questionList")[i];
        $(thisQuestionList).attr('start',String(questionNumber));
        $(thisQuestionList).find("li.question").each((j) => {
            thisQuestion = $(thisQuestionList).find("li.question")[j];
            if (withLetter) {
                $(thisQuestion).prepend(`<strong>${letter}.${questionNumber}:</strong> `);
            } else {
                $(thisQuestion).prepend(`<strong>${questionNumber}:</strong> `);
            }
            if ($(thisQuestion).data()['answer'] !== undefined) {
                thisAnswer = $(thisQuestion).data()['answer'];
                if (withLetter) {
                    $(".answerList").append(`<li>${letter}.${questionNumber}:   ${thisAnswer}</li>`);
                } else {
                    $(".answerList").append(`<li>${questionNumber}:   ${thisAnswer}</li>`);
                }
            } else if ($(thisQuestion).data()['answer_id'] !== undefined) {
                thisAnswerID = $(thisQuestion).data()['answer_id'];
                if (withLetter) {
                    $(".answerList").append(`<li id = '${thisAnswerID}'>${letter}.${questionNumber}:</li>`);
                } else {
                    $(".answerList").append(`<li id = '${thisAnswerID}'>${questionNumber}:</li>`);
                }

                // object defined in fglobally run methods at the top
                $(`#${thisAnswerID}`).append($(answerObjects[thisAnswerID]));
            } else if ($(thisQuestion).find("ol.subQuestionList").length === 1) {//isXinArray('ol.subQuestionList', $(thisQuestion).children() )) {
                let subQuestionList, thisSubQuestion, subAnswerList, k, thisSubAnswer, subAnswerListType;
                subQuestionList = $(thisQuestion).find("ol.subQuestionList")[0];
                subAnswerListType = $(subQuestionList).attr('type');
                subAnswerList = $(`<ol type = ${subAnswerListType}></ol>`); // make this changeable?
                $(subQuestionList).find("li.subQuestion").each((k) => {
                    thisSubQuestion = $(subQuestionList).find("li.subQuestion")[k];
                    if ($(thisSubQuestion).data()['answer'] !== undefined) {
                        thisSubAnswer = $(thisSubQuestion).data()['answer'];
                        $(subAnswerList).append(`<li>${thisSubAnswer}</li>`);
                    } else {
                        thisSubAnswer = 'xxx';
                        $(subAnswerList).append(`<li>${thisSubAnswer}</li>`);
                    }
                });
                if (withLetter) {
                    thisAnswer = $(`<li>${letter}.${questionNumber}:  </li>`);
                } else {
                    thisAnswer = $(`<li>${questionNumber}:  </li>`);
                }
                $(thisAnswer).append(subAnswerList);
                $(".answerList").append(thisAnswer);
            } else {
                thisAnswer = 'xxx';
                if (withLetter) {
                    $(".answerList").append(`<li>${letter}.${questionNumber}: ${thisAnswer}</li>`);
                } else {
                    $(".answerList").append(`<li>${questionNumber}: ${thisAnswer}</li>`);
                }
            }
            questionNumber += 1;
        });
    });
    questionListAlreadyCreated = true;
}


createQuestionAndAnswerList();



// append all items in the answerID object into the lesson
$("ol.answerList").prepend($("<h4 class = 'answerHeader'>Answers:</h4>"))

/// for any <p class = 'directions>
// automatically palces the term "Directons" in bold at the front
$(".directions").prepend($("<strong>Directions: </strong>"));

// automatically places a box to sovle formula problems in any <div class = 'formulaBoxDiv'>
// let myFormulaBox = new formulaBox();
// myFormulaBox.insertTableByClass('formulaBoxDiv');
let formulaSolvingTable2 = new FormulaSolvingTable();
$(".formulaSolvingTable").append(formulaSolvingTable2.draw(600,300));
