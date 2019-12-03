/*
This script is designed to
create a table object
that can be used to more easily create the similar different
types of tables I attach to physics problems.
 */




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

    writeTextInCell(i, j, text) {
        if (text !== undefined) {
            this.cellInfoArray[i][j].text = text;
        }
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

    draw(width, height, unit) {
        if (unit === undefined) {unit = 'px';}

        let rowProportions = makeArraySumToOne(this.rowProportionArray);
        let columnProportions = makeArraySumToOne(this.columnProportionArray);

        let table = $("<table></table>");
        let i, j, thisRow, thisCell, rowspan, colspan, cellWidth, cellHeight, rowHeight, cellProperties;
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
                  $(thisRow).append(thisCell);
                }
            }
            $(table).append(thisRow);
        }
        return table;
    }
}
