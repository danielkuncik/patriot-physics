
let pageAnswers = {};

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

  displayQuestionAsLi(diagramWidth= 300, diagramHeight = diagramWidth) {
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

//  addAnswerVariableObject(variableObject);

  addAnswer(variable, answer, name = variable) {
    let thisAnswer = {
      name: name,
      id: create_UUID()
    };
    if (typeof(answer) === 'string') {
        thisAnswer["string"] = answer;
        thisAnswer['type'] = 'string';
    } else if (typeof(answer) === 'number') {
      thisAnswer["string"] = String(answer);
      thisAnswer['type'] = 'float';
      thisAnswer['float'] = answer;
    } else if (typeof(answer) === 'object') {
        if (answer.isAmagnitude) {
          thisAnswer["type"] = 'magnitude';
          thisAnswer["magnitude"] = answer;
          thisAnswer['string'] = answer.printOptimal();
        }
      /// give options for physics number, diagram, etc.
    }
    this.answers[variable] = thisAnswer;
    pageAnswers[thisAnswer.id] = thisAnswer;
    return thisAnswer
  }

  deleteAnswer() {
    this.answer = undefined;
  }

  // change globally run methods bottom to make this more smooth?
  displayAnswerAsLi() { // needs to be an input
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

  // private method
  createAnswerInput(answerObject) {
    let inputType;
    if (answerObject.type === 'float') {
      inputType = 'input'
    } else if (answerObject.type === 'string') {
      inputType = 'number';
    } else if (answerObject.type === 'magnitude') {
      inputType = 'number'; // but it's more complicated, that's ok for now!
    }
    let input = $(`<input type = '${inputType}' id = '${answerObject.id}'/>`); // add a class
    let commentSpace = $(`<p class = 'comment' id = 'comment-${answerObject.id}'/>`);
    let finalDiv = $("<div></div>");
    $(finalDiv).append(input);
    $(finalDiv).append(commentSpace);
    return finalDiv
  }

// lets see if it works
  displayProblem(appendID) { // as Li
    let question = this.displayQuestionAsLi();
    const answerID = `${this.id}_answer`;
    $(question).attr('data-answer_id',answerID);
    let answer = this.displayAnswerAsLi();
    $(`#${appendID}`).append(question);
    addAnswerObject(answerID, answer);
  }

  displayProblemAsLi(appendID) {
    let question = this.displayQuestionAsLi();

  }
}



/// ADD A PROBLEM LIST OBJECT!!!!!!!
/// not to replace, but to supplement the questionList and answerList classes I already have
