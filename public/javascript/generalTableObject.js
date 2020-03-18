/*
This script is designed to
create a table object
that can be used to more easily create the similar different
types of tables I attach to physics problems.
 */




/*
Write a function called 'select cell',
which avoids errors if i accidentlly enter
indicies that are outside the range of the table.
 */

// this function will go through an evolution
// assume all letters are a square of the font size
function getFontSizeForCell(text,width,height,maxValue) {
    if (maxValue === undefined) {
        maxValue = 1e10;
    }
    let intermediateAnswer, finalAnswer;
    let option1 = width / text.length * 1.5;
    let option2 = height * 0.8;
    let n = 1;
    while (option1 < option2 * .2 && n < 15) {
        option1 *= 2;
        n++
    }

    if (option1 <= option2) {
        intermediateAnswer = option1;
    } else {
        intermediateAnswer = option2;
    }

    if (intermediateAnswer <= maxValue) {
        finalAnswer = intermediateAnswer;
    } else {
        finalAnswer = maxValue;
    }

    return finalAnswer
}

class Table {
    constructor(numRows, numColumns) {
        this.numRows = numRows;
        this.numColumns = numColumns;

        this.rowProportionArray = [];
        this.columnProportionArray = [];
        this.normalize();

        this.cellInfoArray = [];
        this.eraseAllInfo(); // sets the cell info array as a blank array

        this.columnKeys = {};
        this.rowKeys = {};

        this.defaultSize = 500;

        this.maxFontPorpotion = undefined;
    }

    setDefaultSize(newSize) {
        this.defaultSize = newSize;
    }

    eraseAllInfo() {
        this.cellInfoArray = [];
        let i, j, thisRowArray;
        for (i = 0; i < this.numRows; i++) {
            thisRowArray = [];
            for (j =0; j < this.numColumns; j++) {
                thisRowArray.push({});
            }
            this.cellInfoArray.push(thisRowArray);
        }
    }

    setRowProportions(newProportionArray) {
        if (newProportionArray.length !== this.numRows) {
            console.log('ERROR: row proportion array must have element for each row');
            return false
        }
        let k;
        for (k = 0; k < this.numRows; k++) {
            this.rowProportionArray[k] = newProportionArray[k];
        }
    }

    setColumnProportions(newProportionArray) {
        if (newProportionArray.length !== this.numColumns) {
            console.log('ERROR: column proportion array must have element for each column');
            return false
        }
        let k;
        for (k = 0; k < this.numColumns; k++) {
            this.columnProportionArray[k] = newProportionArray[k];
        }
    }

    normalizeRowProportions() {
        let newArray = [];
        let q;
        for (q = 0; q < this.numRows; q++) {
            newArray.push(1);
        }
        this.rowProportionArray = newArray;
        return true
    }

    normalizeColumnProportions() {
        let newArray = [];
        let q;
        for (q = 0; q < this.numColumns; q++) {
            newArray.push(1);
        }
        this.columnProportionArray = newArray;
        return true
    }

    normalize() {
        this.normalizeRowProportions();
        this.normalizeColumnProportions();
    }

    // at the moment, 1-18-2020
    // you can only set font size if you use this function directly
    // otherwise you will get the default font size
    writeTextInCell(i, j, text, fontSize) {
        if (text !== undefined) {
            this.cellInfoArray[i][j].text = text;
        }
        this.setCellFontSize(i,j,fontSize);
    }

    setCellFontSize(i,j,size) {
        this.cellInfoArray[i][j].fontSize = size;
    }

    addListToCell(i, j, listElementArray, orderedListBoolean) {
      if (orderedListBoolean === undefined) {orderedListBoolean = false;}
      this.cellInfoArray[i][j].list = true;
      this.cellInfoArray[i][j].orderedListBoolean = orderedListBoolean;
      this.cellInfoArray[i][j].listElementArray = listElementArray;
    }

    writeTextInCellKeys(rowKey, columnKey, text) {
        let keys = this.getCellCoordinatesByKey(rowKey, columnKey);
        this.writeTextInCell(keys.i, keys.j, text);
    }

    addClassToCell(i, j, newClass) {
        this.cellInfoArray[i][j].class = newClass
    }

    addIdToCell(i, j, id) {
        this.cellInfoArray[i][j].id = id;
    }

    writeTextInRow(i, textArray) {
        if (textArray.length > this.numColumns) {
            console.log('ERROR: Too many elements in text array');
            return false
        }
        let j;
        for (j = 0; j < textArray.length; j++) {
            this.writeTextInCell(i, j, textArray[j])
        }
    }

    writeTextInColumn(j, textArray) {
        if (textArray.length > this.numRows) {
            console.log('ERROR: Too many elements in text array');
            return false
        }
        let i;
        for (i = 0; i < textArray.length; i++) {
            this.writeTextInCell(i, j, textArray[i]);
        }
    }

    eraseTextInCell(i, j) {
        this.writeTextInCell(i, j, "");
    }

    addDiagramToCell(i, j, diagram, breakBefore) {
        if (breakBefore === undefined) {
            breakBefore = true;
        }
        this.cellInfoArray[i][j].diagram = diagram;
        if (breakBefore) {
            this.cellInfoArray[i][j].diagramBreakBefore = true;
        }
    }

    makeFirstRowHeaders() {
        let j;
        for (j = 0; j < this.numColumns; j++) {
            this.makeCellIntoHeader(0, j);
        }
    }

    makeFirstColumnHeaders() {
        let i;
        for (i = 0; i < this.numRows; i++) {
            this.makeCellIntoHeader(i, 0);
        }
    }

    shadeUpperLeftCorner() {
        this.shadeCell(0,0);
    }

    addTopHeaders(textArray) {
        this.writeTextInRow(0, textArray);
    }

    addSideHeaders(textArray) {
        this.writeTextInColumn(0, textArray);
    }

    setClassOfAllCells(newClass) {
        let i, j;
        for (i = 0; i < this.numRows; i++) {
            for (j = 0; j < this.numColumns; j++) {
                this.addClassToCell(i, j, newClass);
            }
        }
    }

    setClassOfRow(i, newClass) {
        let j;
        for (j =0; j < this.numColumns; j++) {
            this.addClassToCell(i, j, newClass);
        }
    }

    setClassOfColumn(j, newClass) {
        let i;
        for (i = 0; i < this.numRows; i++) {
            this.addClassToCell(i, j, newClass);
        }
    }

    shadeRow(i) {
      let j;
      for (j = 0; j < this.numColumns - 1; j++) {
        this.mergeRight(i,0);
      }
      this.shadeCell(i,0);
    }

    // causes cell i,j to merge with the cell below
    // does not work if that particular cell is already merged
    // need to keep merging the top cell
    mergeBelow(i,j) {
      if (this.cellInfoArray[i][j]["captureBelow"] === undefined) {
        this.cellInfoArray[i][j]["captureBelow"] = 1;
      } else if (this.cellInfoArray[i][j]["captureBelow"] > 0 ) {
        this.cellInfoArray[i][j]["captureBelow"] += 1;
      }
      if (i + this.cellInfoArray[i][j]["captureBelow"] + 1 > this.numRows) {
        console.log('ERROR: Attempting to merge beyond maximum number of rows. Setting to max number of rows.');
        this.cellInfoArray[i][j]["captureBelow"] = this.numColumns - i - 1;
      }

      let k;
      for (k = 1; k <= this.cellInfoArray[i][j]["captureBelow"]; k++) {
        this.cellInfoArray[i + k][j].merged = true;
      }
    }

    mergeFullColumn(j, shadeBoolean) {
        let q;
        for (q = 0; q < this.numRows - 1; q++) {
            this.mergeBelow(0,j);
        }
        if (shadeBoolean) {
            this.shadeCell(0,j);
        }
    }

    mergeFullRow(i, shadeBoolean) {
        let q;
        for (q = 0; q < this.numColumns - 1; q++) {
            this.mergeRight(i,0);
        }
        if (shadeBoolean) {
            this.shadeCell(i,0);
        }
    }

    // need to add an error handler for if you go out of range!
    mergeRight(i,j) {
      if (this.cellInfoArray[i][j]["captureRight"] === undefined) {
        this.cellInfoArray[i][j]["captureRight"] = 1;
      } else if (this.cellInfoArray[i][j]["captureRight"] > 0 ) {
        this.cellInfoArray[i][j]["captureRight"] += 1;
      }
      if (j + this.cellInfoArray[i][j]["captureRight"] + 1 > this.numColumns) {
        console.log('ERROR: attempting to merge beyond maximum number of columns. Setting to max number of columns.');
        this.cellInfoArray[i][j]["captureRight"] = this.numColumns - j - 1;
      }
      let k;
      for (k = 1; k <= this.cellInfoArray[i][j]["captureRight"]; k++) {
        this.cellInfoArray[i][j + k].merged = true;
      }
    }

    setClassOfTopRow(newClass) {
        this.setClassOfRow(0, newClass);
    }

    setClassOfLeftColumn(newClass) {
        this.setClassOfColumn(0, newClass);
    }

    shadeCell(i, j) {
        this.addClassToCell(i, j, 'shaded');
    }

    makeCellIntoHeader(i, j) {
        this.cellInfoArray[i][j].header = true;
    }

    assignColumnKey(j, key) {
        if (j >= this.numColumns) {
            console.log('Key assignment out of range');
            return false
        }
        this.columnKeys[key] = j;
    }

    assignRowKey(i, key) {
        if (i >= this.numRows) {
            console.log('Key assignment out of range');
            return false
        }
        this.rowKeys[key] = i;
    }

    assignAllRowKeys(array) {
        if (array.length !== this.numRows) {
            console.log('Array must have one element for each row');
            return false
        }
        array.forEach((element, index) => {
            this.assignRowKey(index, element);
        });
    }

    assignAllColumnKeys(array) {
        if (array.length !== this.numColumns) {
            console.log('Array must have one element for each column');
            return false
        }
        array.forEach((element, index) => {
            this.assignColumnKey(index, element);
        });
    }

    getCellCoordinatesByKey(rowKey, columnKey) {
        return {
            i: this.rowKeys[rowKey],
            j: this.columnKeys[columnKey]
        }
    }

    // gets the sum of the height of i and a certain number of cells below
    sumRowProportions(i, captureBelow) {
      let sum = this.rowProportionArray[i];
      let k;
      for (k = 0; k < captureBelow; k++) {
        sum += this.rowProportionArray[i + k];
      }
      return sum
    }

    // gets the sum the widths for column j and a certain number of columns to the right
    sumColumnProportions(j, captureRight) {
      let sum = this.columnProportionArray[j];
      let k;
      for (k = 0; k < captureRight; k++) {
        sum += this.columnProportionArray[j + k];
      }
      return sum
    }

    setMaxFontProportion(newMaxFontPropotion) {
        this.maxFontPorpotion = newMaxFontPropotion;
    }

    draw(width, height, unit) {
        if (unit === undefined) {unit = 'px';}

        if (width === undefined) {
            width = this.defaultSize;
        }
        if (height === undefined) {
            height = width;
        }

        let maxFontSize;
        if (this.maxFontPorpotion) {
            maxFontSize = width * this.maxFontPorpotion;
        } else {
            maxFontSize = undefined;
        }

        let rowProportions = makeArraySumToOne(this.rowProportionArray);
        let columnProportions = makeArraySumToOne(this.columnProportionArray);

        let table = $("<table></table>");
        let i, j, thisRow, thisCell, rowspan, colspan, cellWidth, cellHeight, rowHeight, fontSize, cellProperties;
        for (i = 0; i < this.numRows; i++) {
            rowHeight = height * rowProportions[i];
            thisRow = $(`<tr height = "${rowHeight}${unit}"></tr>`);
            for (j = 0; j < this.numColumns; j++) {
                if (this.cellInfoArray[i][j].merged) {
                  // skip all this!
                } else {

                  // deal with capture below
                  if (this.cellInfoArray[i][j].captureBelow) {
                    rowspan = this.cellInfoArray[i][j].captureBelow + 1;
                    cellHeight = this.sumRowProportions(i, this.cellInfoArray[i][j].captureBelow) * height;
                  } else {
                    rowspan = 0;
                    cellHeight = rowHeight;
                  }

                  // deal with capture right
                  if (this.cellInfoArray[i][j].captureRight) {
                    colspan = this.cellInfoArray[i][j].captureRight + 1;
                    cellWidth = this.sumColumnProportions(j, this.cellInfoArray[i][j].captureRight) * width;
                  } else {
                    colspan = 0;
                    cellWidth = width * columnProportions[j];
                  }

                  cellProperties = `width = "${cellWidth}${unit}" height = "${cellHeight}${unit}"`;

                  fontSize = undefined;
                  if (this.cellInfoArray[i][j].fontSize) {
                      fontSize = this.cellInfoArray[i][j].fontSize;
                  } else if (this.cellInfoArray[i][j].text) {
                    fontSize = getFontSizeForCell(this.cellInfoArray[i][j].text,cellWidth,cellHeight, maxFontSize);
                  } else {
                      fontSize = 20;
                  }
                  cellProperties = cellProperties + ` style = 'font-size:${fontSize}px'`;


                    if (rowspan) {
                    cellProperties = cellProperties + ` rowspan = "${rowspan}"`
                  }
                  if (colspan) {
                    cellProperties = cellProperties + `colspan = "${colspan}"`;
                  }
                  if (this.cellInfoArray[i][j].id) {
                      cellProperties = cellProperties + ` id = "${this.cellInfoArray[i][j].id}"`;
                  }

                  if (this.cellInfoArray[i][j].header) {
                      thisCell = $(`<th ${cellProperties}></th>`);
                  } else {
                      thisCell = $(`<td ${cellProperties}></td>`);
                  }
                  if (this.cellInfoArray[i][j].text !== undefined) {
                      $(thisCell).append($(document.createTextNode(this.cellInfoArray[i][j].text)));
                  }
                  if (this.cellInfoArray[i][j].class) {
                      $(thisCell).addClass(this.cellInfoArray[i][j].class);
                  }
                  if (this.cellInfoArray[i][j].diagram) {
                      if (this.cellInfoArray[i][j].diagramBreakBefore) {
                          $(thisCell).append($("<br>"));
                      }
                      $(thisCell).append(this.cellInfoArray[i][j].diagram.drawCanvas(cellWidth * 0.75, cellHeight*0.75, unit));
                  }
                  if (this.cellInfoArray[i][j].list) {
                    let newList;
                    if (this.cellInfoArray[i][j].orderedListBoolean) {
                      newList = $("<ol></ol>");
                    } else {
                      newList = $("<ul></ul>");
                    }
                    this.cellInfoArray[i][j].listElementArray.forEach((element) => {
                      newList.append(`<li>${element}</li>`);
                    });
                    $(thisCell).append(newList);
                  }
                  $(thisRow).append(thisCell);
                }
            }
            $(table).append(thisRow);
        }
        return table;
    }
}
