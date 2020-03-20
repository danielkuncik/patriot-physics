
// container for answerIDs
let answerObjects = {};

function addAnswerObject(id, object) {
    answerObjects[id] = object;
}


let questionListAlreadyCreated = false; /// this global variable makes it so that
// the question and answer list function is run only once



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

    $(".questionList").each((i) => {
        thisQuestionList = $(".questionList")[i];
        $(thisQuestionList).attr('start',String(questionNumber));
        $(thisQuestionList).find("li.question").each((j) => {
            thisQuestion = $(thisQuestionList).find("li.question")[j];
            $(thisQuestion).prepend(`<strong>${letter}.${questionNumber}:</strong> `);
            if ($(thisQuestion).data()['answer'] !== undefined) {
                thisAnswer = $(thisQuestion).data()['answer'];
                $(".answerList").append(`<li>${letter}.${questionNumber}:   ${thisAnswer}</li>`);
            } else if ($(thisQuestion).data()['answer_id'] !== undefined) {
                thisAnswerID = $(thisQuestion).data()['answer_id'];
                $(".answerList").append(`<li id = '${thisAnswerID}'>${letter}.${questionNumber}:</li>`);

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
                thisAnswer = $(`<li>${letter}.${questionNumber}:  </li>`);
                $(thisAnswer).append(subAnswerList);
                $(".answerList").append(thisAnswer);
            } else {
                thisAnswer = 'xxx';
                $(".answerList").append(`<li>${letter}.${questionNumber}: ${thisAnswer}</li>`);
            }
            questionNumber += 1;
        });
    });
    questionListAlreadyCreated = true;
}

