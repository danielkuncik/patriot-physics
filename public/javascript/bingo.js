class BingoBoard {
    constructor(name = 'bingo') {
        this.words = [];
        this.name = name;
        this.alreadyWon = false;
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

            // diagonal up right
            let diag2 = true;
            for (i = 0; i < length; i++) {
                if (!clickArray[i][length - i - 1]) {
                    diag2 = false;
                }
            }
            if (diag2) {
                return true
            }

            return false
        }
    }

    clickBox(i,j) {
        this.clicked[i][j] = true;
    }

    draw(size = 5) {

        let theDiv = $("<div class = 'container'></div>");
        this.size = size;


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
                    thisCol = $(`<div class = "bingoClickedSpace col-${colSize} border border-light p-5  bg-dark text-light" id = "${spaceID}">FREE</div>`);
                    this.clicked[i].push(true);
                } else {
                    thisCol = $(`<div class = "bingoSpace col-${colSize} border border-dark p-5 bg-light text-dark" id = "${spaceID}">${word}</div>`);
                    this.clicked[i].push(false);
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

    showWin() {
        let winMessage = $("<h1 class = 'display1' style = 'font-size: 200px'></h1>");
        $(winMessage).append($("<span style = 'color:red'>B</span>"));
        $(winMessage).append($("<span style = 'color:orange'>I</span>"));
        $(winMessage).append($("<span style = 'color:yellow'>N</span>"));
        $(winMessage).append($("<span style = 'color:green'>G</span>"));
        $(winMessage).append($("<span style = 'color:blue'>O</span>"));
        $(winMessage).append($("<span style = 'color:violet'>!</span>"));
        $(winMessage).append($("<span style = 'color:violet'>!</span>"));
        $(winMessage).append($("<span style = 'color:violet'>!</span>"));
        $("#winSpace").append(winMessage);
    }

    setUpEventListeners() { // I think these needs to come AFTER everything has been added
        if (!this.size) {
            return undefined
        }
        let i, j;
        for (i = 0; i< this.size; i++) {
            for (j =0; j  < this.size; j++) {
                const id = `bingo-${i}-${j}`;
                if (!this.clicked[i][j]) {
                    $(`#${id}`).on('click',() => {
                        const newI = id[6]; // this is clunky
                        const newJ = id[8];
                        this.clickBox(newI,newJ);
                        const selector = `#${id}`;
                        $(selector).removeClass("bingoSpace");
                        $(selector).addClass("bingoClickedSpace");
                        if (currentBackground === 'light') {
                            $(selector).removeClass("bg-light");
                            $(selector).removeClass("text-dark");
                            $(selector).removeClass("border border-dark");
                            $(selector).addClass("bg-dark");
                            $(selector).addClass("text-light");
                            $(selector).addClass("border border-light");
                        } else if (currentBackground === 'dark') {
                            $(selector).removeClass("bg-dark");
                            $(selector).removeClass("text-light");
                            $(selector).removeClass("border border-light");
                            $(selector).addClass("bg-light");
                            $(selector).addClass("text-dark");
                            $(selector).addClass("border border-dark");
                        }
                        if (this.testIfWon(this.clicked) && !this.alreadyWon) {
                            this.alreadyWon = true;
                            this.showWin();
                        }
                    });
                }
            }
        }
    }
}


/*
The only continued problem is the 'sunken' look, which I think might be tough to get rid of...
 */