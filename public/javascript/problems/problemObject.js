
// will need to be improved and beefed up as I add more automatically solving problems
class Problem {
  constructor(id = create_UUID()) {
    this.id = id;
    this.question = {};
    this.answers = {};
  }

  addDirections(directions) {
    this.question.directions = directions;
  }

  addQuestionString(questionString) {
    this.question.string =  questionString;
  }

  addDiagram(diagramObject) {
    this.question.diagram = diagramObject;
  }

  displayQuestion(diagramWidth= 300, diagramHeight = diagramWidth) {
    let questionItem = $("<li class = 'question'></li>");
    if (this.question.directions) {
      $(questionItem).append(`<p>${this.question.directions}</p>`);
    }
    if (this.question.string) {
      $(questionItem).append(`<p>${this.question.string}</p>`);
    }
    if (this.question.diagram) {
      $(questionItem).append("<br>");
      $(questionItem).append(this.question.diagram.drawCanvas(diagramWidth, diagramHeight));
    }
    return questionItem
  }

  addAnswer(variable, answer, name = variable) {
    let thisAnswer = {
      name: name
    };
    if (typeof(answer) === 'string') {
        thisAnswer["string"] = answer;
    } else if (typeof(answer) === 'number') {
      thisAnswer["string"] = String(answer);
    } else if (typeof(answer) === 'object') {
        /// give options for physics number, diagram, etc.
    }
    this.answers[variable] = thisAnswer;
    return thisAnswer
  }

  deleteAnswer() {
    this.answer = undefined;
  }

  // change globally run methods bottom to make this more smooth?
  displayAnswer() {
    if (Object.keys(this.answers).length === 1) {
      let variable = Object.keys(this.answers)[0];
      // return $(`<li class = 'answer'>${variable} = ${this.answers[variable].string}</li>`);
      return $(`<span>${variable} = ${this.answers[variable].string}</span>`);
    } else {
      let item = $("<li class = 'answer'></li>");
      let masterList = $("<ul></ul>");
      Object.keys(this.answers).forEach((variable) => {
        $(masterList).append(`<li>${this.answers[variable].name} = ${this.answers[variable].string}</li>`);
      });
      $(item).append(masterList);
      return item
    }
  }

// lets see if it works
  displayProblem(appendID) {
    let question = this.displayQuestion();
    const answerID = `${this.id}_answer`;
    $(question).attr('data-answer_id',answerID);
    let answer = this.displayAnswer();
    $(`#${appendID}`).append(question);
    addAnswerObject(answerID, answer);
  }
}



/// ADD A PROBLEM LIST OBJECT!!!!!!!
/// not to replace, but to supplement the questionList and answerList classes I already have
