function writtenProblem(question,answer) {
    this.question = question;
    this.answer = answer;

    if (typeof(question) === 'object') {
        this.questionElement = $("<li></li>");
        question.forEach((line) => {
            this.questionElement.append(line);
            this.questionElement.append('<br>')
        })
    } else {
        this.questionElement = $("<li></li>").text(String(question));
    }
    this.answerElement = $("<li></li>").text(String(answer));

    this.insert = function(questionID, answerID) {
        if (questionID) {
            $("#" + questionID).append(this.questionElement);
        }
        if (answerID) {
            $('#' + answerID).append(this.answerElement);
        }
    };
}


// creates a list of problems and answers
function writtenProblemList() {
    this.problems = [];
    this.questionList = undefined;
    this.answerList = undefined;

    this.addProblem = function(question, answer) {
        var nextProblem = new writtenProblem(question, answer);
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
