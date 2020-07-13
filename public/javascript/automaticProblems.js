

class AutomaticProblem {
  constructor(name) {
    this.name = name;
    this.inputList = [];
  }

  addNumericalInput(answer, accuracy) {
    const id = `${this.name}-${this.inputList.length + 1}`;
    if (accuracy === undefined) {
      accuracy = 'exact';
    }
    this.inputList.push({
      id: id,
      type: "number",
      answer: answer,
      accuracy: accuracy
    });
    return $(`<input type = 'number' id = '${id}' class = 'autoNumber' />`);
  }

  addAnswerButton() {
    let button = $("<input type = 'button' value = 'ANSWER' class = 'autoAnswerButton' />")
    button.on('click',null, this.inputList, answeringFunction);
    return button
    /// THIS DOES NOT WORK!!!
    /// i need to find a different way to control the answer button
    /// add an event listener
  }

}


function answeringFunction(event) {
  const inputList = event.data;
  inputList.forEach((input) => {
    let inputtedValue = $(`#${input.id}`).val();
    let answered = true;
    if (inputtedValue === "") {
      answered = false;
    };
    let correct = false;
    if (input.type === 'number') {
      inputtedValue = Number(inputtedValue);
      if (input.accuracy === 'exact') {
        if (Math.abs(inputtedValue - input.answer) < 1e-10) {
          correct = true;
        }
      }
    } // add radio ===
    if (answered && correct) {
      $(`#${input.id}`).removeClass("border border-danger");
      $(`#${input.id}`).addClass("border border-success");
    } else if (answered && !correct) {
      $(`#${input.id}`).removeClass("border border-success");
      $(`#${input.id}`).addClass("border border-danger");
    } else if (!answered) {
      $(`#${input.id}`).removeClass("border border-danger");
      $(`#${input.id}`).removeClass("border border-success");
    }
  });
}
