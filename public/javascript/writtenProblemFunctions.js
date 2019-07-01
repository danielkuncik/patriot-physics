/*
function writtenProblem(question,answer,subQuestions,questionTable) {
    this.question = question;
    this.answer = answer;

    if (typeof(question) === 'object') {
        this.questionElement = $("<li></li>");
        question.forEach((line) => {
            this.questionElement.append(line);
            this.questionElement.append('<br>');
        })
    } else {
        this.questionElement = $("<li></li>").text(String(question));
    }
    this.answerElement = $("<li></li>").text(String(answer));

    if (questionTable) {
        this.questionTable = addTable(questionTable.type, questionTable.arguments);
        $(this.questionElement).append(this.questionTable.draw());
    }

    this.insert = function(questionID, answerID) {
        if (questionID) {
            $("#" + questionID).append(this.questionElement);
        }
        if (answerID) {
            $('#' + answerID).append(this.answerElement);
        }
    };
}
*/


/*
For, creating lists of problems on a physics webpage

Use:

To create a new list of problems:
var physicsProblems = new writtenProblemList()

To add a new problem:

physicsProblems.addProblem(problemObject)
the problem object has the following properties:
question:

answer:

-- there are also subquestions

To insert into a page

physicsProblems.insertLists(questionID, answerID)

argument1: The id of the <div> into which the list of questions will be inserted
argument 2: The id of the <div> into which the list of answers will beinserted

i want to refactor this completely!

there should be a problem class



 */


function writtenProblem(problemObject) {
    this.problemObject = problemObject;

    this.renderText = function(text) {
        var element = $("<li class = 'physicsQuestion'></li>");
        if (typeof(text) === 'object') {
            text.forEach((line) => {
                element.append(line);
                element.append("<br>");
            });
        } else if (typeof(text) === 'string') {
            element.append(text);
        }
        return element;
    };

    this.renderQuestion = function() {
        if (this.problemObject.question) {
            return this.renderText(this.problemObject.question);
        }
    };

    this.renderAnswer = function() {
        if (this.problemObject.answer) {
            return this.renderText(this.problemObject.answer);
        }
    };

    this.renderDirections = function() {
        if (this.problemObject.directions) {
            return this.renderText(this.problemObject.answer);
        }
    };

    this.renderQuestionTable = function() {
        if (this.problemObject.questionTable) {
            return addTable(this.problemObject.questionTable.type, this.problemObject.questionTable.arguments);
        }
    };

    this.renderQuestionCanvas = function() {
        if (this.problemObject.questionCanvas) {
            return this.problemObject.questionCanvas;
        }
    };

    this.renderAnswerTable = function() {
        if (this.problemObject.answerTable) {
            return addTable(this.problemObject.answerTable.type, this.problemObject.answerTable.arguments);
        }
    };

    this.renderSubQuestionList = function() {
        if (this.problemObject.subquestions) {
            var subQuestionList = $("<ol type = 'a'></ol>");
            var subAnswerList = $("<ol type = 'a'></ol>");
            this.problemObject.subquestions.forEach((subQuestionObject) => {
                if (subQuestionObject.subquestion) {
                    $(subQuestionList).append(this.renderText(subQuestionObject.subquestion));
                }
                if (subQuestionObject.subanswer) {
                    $(subAnswerList).append(this.renderText(subQuestionObject.subanswer));
                }
            });
        }
        return [subQuestionList, subAnswerList];
    };

    this.render = function() {
        var mainQuestionElement = this.renderQuestion();
        var mainAnswerElement= this.renderAnswer();
        var subQuestionList;

        if (this.renderDirections()) {
            $(mainQuestionElement).append(this.renderDirections());
        }
        if (this.renderQuestionTable()) {
            console.log(this.renderQuestionTable());
            $(mainQuestionElement).append(this.renderQuestionTable().draw());
        }
        if (this.renderAnswerTable()) {
            $(mainAnswerElement).append(this.renderAnswerTable().draw());
        }

        if (this.renderQuestionCanvas()) {
            $(mainQuestionElement).append(this.renderQuestionCanvas());
        }

        if (this.renderSubQuestionList()) {
            var obj = this.renderSubQuestionList();
            $(mainQuestionElement).append(obj[0]);
            $(mainAnswerElement).append(obj[1]);
        }
        var finalList = {
            "questionElement": mainQuestionElement,
            "answerElement": mainAnswerElement
        };
        return finalList;
    };

    return this.render();
}

function addTable(type,arguments) {
    if (type === 'collision') {
        return makeCollisionTable(arguments.itemNames, arguments.width, arguments.height, arguments.unit, arguments.totallyInelasticBoolean)
    } else {
        return undefined
    }
}

// i added 'theListBefore' so that multiple lists could be strung together
// but i think there will be an error if you add questions not in order.... i need to fix that
function writtenProblemList(theListBefore) {
    if (theListBefore) {this.theListBefore = theListBefore;}
    else {this.theListBefore = {"lastQuestionNumber": 0};}

    this.problems = [];
    this.questionList = undefined;
    this.answerList = undefined;
    this.numQuestions = 0;
    this.lastQuestionNumber = 0;

    this.addProblem = function(problemObject) {
        var nextProblem = new writtenProblem(problemObject);
        this.problems.push(nextProblem);
        this.numQuestions = this.problems.length;
        this.lastQuestionNumber = this.numQuestions + this.theListBefore.lastQuestionNumber;
        this.makeLists()
    };

    this.makeLists = function() {
        var questionList = $(`<ol start = '${this.theListBefore.lastQuestionNumber + 1}'></ol>`);
        var answerList = $(`<ol start = '${this.theListBefore.lastQuestionNumber + 1}'></ol>`);


        this.problems.forEach((problem) => {
            questionList.append(problem.questionElement);
            answerList.append(problem.answerElement);
        });
        this.questionList = questionList;
        this.answerList = answerList;
    };

    this.insertLists = function(questionID, answerID) {
        var questionListDiv = $("<div></div>");
        var answerListDiv = $("<div></div>");
      //  $(questionListDiv).append("<h3>Problems</h3>");
      //  $(answerListDiv).append($("<h3>Answers</h3>"));
        $(questionListDiv).append(this.questionList);
        $(answerListDiv).append(this.answerList);

        if (questionID) {
            $("#" + questionID).append(questionListDiv);
        }
        if (answerID) {
            $('#' + answerID).append(answerListDiv);
        }
    };
}


/*
// creates a list of problems and answers
function writtenProblemList() {
    this.problems = [];
    this.questionList = undefined;
    this.answerList = undefined;

    this.addProblem = function(question, answer, table) {
        var nextProblem = new writtenProblem(question, answer, table);
        this.problems.push(nextProblem);
        this.makeLists()
    };

    this.makeLists = function() {
        var questionList = $("<ol></ol>");
        var answerList = $("<ol></ol>");
        this.problems.forEach((problem) => {
            questionList.append(problem.questionElement);
            answerList.append(problem.answerElement);
        });
        this.questionList = questionList;
        this.answerList = answerList;
    };

    this.insertLists = function(questionID, answerID) {
        if (questionID) {
            $("#" + questionID).append(this.questionList);
        }
        if (answerID) {
            $('#' + answerID).append(this.answerList);
        }
    };
}
*/

/*
What i should add
--- a way to have mulitple lists that beign with each other
so 'previous list' can be an input
 */