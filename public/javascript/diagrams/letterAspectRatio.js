
arialAspectRatios = {
    "A": 1, "a": 1,
    "B": 1, "b": 1,
    "C": 1, "c": 1,
    "D": 1, "d": 1,
    "E": 1, "e": 1,
    "F": 1, "f": 1,
    "G": 1, "g": 1,
    "H": 1, "h": 1,
    "I": 1, "i": 1,
    "J": 1, "j": 1,
    "K": 1, "k": 1,
    "L": 1, "l": 1,
    "M": 1, "m": 1,
    "N": 1, "n": 1,
    "O": 1, "o": 1,
    "P": 1, "p": 1,
    "Q": 1, "q": 1,
    "R": 1, "r": 1,
    "S": 1, "s": 1,
    "T": 1, "t": 1,
    "U": 1, "u": 1,
    "V": 1, "v": 1,
    "W": 1, "w": 1,
    "X": 1, "x": 1,
    "Y": 1, "y": 1,
    "Z": 1, "z": 1,
    "0": 1,
    "1": 1,
    "2": 1,
    "3": 1,
    "4": 1,
    "5": 1,
    "6": 1,
    "7": 1,
    "8": 1,
    "9": 1,
    "space": 1,
    "=": 1, "(": 1, ")": 1,
    "#": 1, ".": 1, "!": 1,
    "Ω": 1,
    "Δ": 1
};

function getLengthOfLetters(letters, fontSize) {
    let q, thisLetter, totalLength = 0;
    for (q = 0; q < letters.length; q++) {
        let thisLetter = letters[q];
        if (thisLetter === ' ') {
            thisLetter = 'space';
        }
        totalLength += arialAspectRatios[thisLetter] * fontSize;
    }
    return totalLength
}
