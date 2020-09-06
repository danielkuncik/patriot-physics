

function countingSigFigProblem(string, unitName) {
    let newMagnitude = new Magnitude(string);

    let problemString = `string${unitName ? ` ${unitName}` : ''}`;
    let answer = newMagnitude.numSigFigs;
}