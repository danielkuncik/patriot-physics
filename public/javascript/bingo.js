class BingoBoard {
    constructor(firstWordArray = [], name = 'bingo') {
        this.words = firstWordArray;
        this.name = name;
    }

    addWord(newWord) {
        this.words.push(newWord);
    }

    testIfWon(clickArray, type = 'rows') {
        if (type === 'rows') {
            const length = clickArray.length;
            let i, j;

            // test rows
            for (i = 0; i < length; i++) {
                let thisRow = true;
                for (j = 0; j < length; j++) {
                    if (!clickArray[i][j]) {
                        thisRow = false;
                    }
                }
                if (thisRow) {
                    return true;
                }
            }

            // test columns
            for (j = 0; j < length; j++) {
                let thisCol = true;
                for (i = 0; i < length; i++) {
                    if (!clickArray[i][j]) {
                        thisCol = false;
                    }
                }
                if (thisCol) {
                    return true
                }
            }

            // diagonal down right
            let diag1 = true;
            for (i = 0; i < length; i++) {
                if (!clickArray[i][i]) {
                    diag1 = false;
                }
            }
            if (diag1) {
                return true
            }

            // diagonal up righ
            let diag2 = true;
            for (i = 0; i < length; i++) {
                if (!clickArray[i][length - i]) {
                    diag2 = false;
                }
            }
            if (diag2) {
                return true
            }

            return false
        }
    }

    draw(size = 5) {

        let theDiv = $("<div class = 'container'></div>");


        let wordArray = this.words;

        while (wordArray.length < size * size) {
            wordArray.push('free');
        }

        const colSize = Math.floor(12/size);

        let i, j, thisRow, thisCol;
        this.clicked = [];
        for (i = 0; i < size; i++) {
            thisRow = $("<div class = 'row'></div>");
            this.clicked.push([]);

            for (j = 0; j < size; j++) {

                const wordInt = randInt(0,wordArray.length - 1);
                let word = wordArray[wordInt];
                wordArray.splice(wordInt,1);
                const spaceID = `${this.name}-${i}-${j}`;

                if (word === 'free') {
                    thisCol = $(`<div class = "col-${colSize} border border-dark p-5 bingoFreeSpace" id = "${spaceID}">FREE</div>`);
                    this.clicked[j].push(true);
                } else {
                    thisCol = $(`<div class = "col-${colSize} border border-dark p-5 bingoSpace" id = "${spaceID}">${word}</div>`);
                    this.clicked[j].push(false);

                    $(`#${spaceID}`).click(() => {
                        $(`#${spaceID}`).addClass("bg-success");
                        $(`#${spaceID}`).addClass("text-danger");
                        this.clicked[i][j] = true;
                        if (this.testIfWon()) {
                            $("#winSpace").append("<p>YOU WON!</p>");
                        }
                    });
                }

                $(thisRow).append(thisCol);
            }

            $(theDiv).append(thisRow);
        }

        // winning space
        let lastRow = $("<div class = 'row'></div>");
        let lastCol = $(`<div class = 'col-${length * colSize}' id = 'winSpace'></div>`);

        $(lastRow).append(lastCol);
        $(theDiv).append(lastRow);

        return theDiv
    }
}