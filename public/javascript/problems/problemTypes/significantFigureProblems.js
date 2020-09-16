

function countingSigFigs(string, unitName) {
    let problem = new Problem();
    let newMeasurement = new Measurement(string);

    let questionString = `${string}${unitName ? ` ${unitName}` : ''}`;
    let answer = newMeasurement.getNumSigFigs();

    problem.addQuestionString(questionString);
    problem.addAnswer('Num Sig Figs', answer, true);

    return problem
}