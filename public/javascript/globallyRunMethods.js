/*
This javascript file contains method that are run as a part of every page
 */

// automatically correctly numbers multiple lists of questions
// eg. so if the first list has 4 questions, the next will start with question 5
// and automatically creates a list of answers
// whenever I want to ask questions in a file, put them in <ol class = 'questionList'>
// each question should be in an li tag: <li data-answer = 'answer here'>
// and at the end of the file place <ol class = 'answerList'>
let i, j, thisQuestionList, thisQuestion, thisAnswer, questionNumber = 1;
$(".questionList").each((i) => {
    thisQuestionList = $(".questionList")[i];
    $(thisQuestionList).attr('start',String(questionNumber));
    $(thisQuestionList).children().each((j) => {
        thisQuestion = $(thisQuestionList).children()[j];
        questionNumber += 1;
        if ($(thisQuestion).data()['answer'] !== undefined) {
            thisAnswer = $(thisQuestion).data()['answer'];
        } else {
            thisAnswer = 'xxx';
        }
        $(".answerList").append(`<li>${thisAnswer}</li>`);
    });
});

/// for any <p class = 'directions>
// automatically palces the term "Directons" in bold at the front
$(".directions").prepend($("<strong>Directions: </strong>"));

// automatically places a box to sovle formula problems in any <div class = 'formulaBoxDiv'>
// let myFormulaBox = new formulaBox();
// myFormulaBox.insertTableByClass('formulaBoxDiv');
