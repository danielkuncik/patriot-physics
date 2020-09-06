

function countingSigFigs(string, unitName) {
    let problem = new Problem();
    let newMagnitude = new Magnitude(string);

    let questionString = `${string}${unitName ? ` ${unitName}` : ''}`;
    let answer = newMagnitude.numSigFigs;

    problem.addQuestionString(questionString);
    problem.addAnswer('Num Sig Figs', answer, true);

    return problem
}