

class ElectricCircuitTable extends Table {
    constructor(numResistors, powerRowBoolean) {
        let numRows = 4;
        if (powerRowBoolean) {
            numRows += 1;
        }
        super(numRows, 2 + numResistors);
        this.numResistors = numResistors;
        this.powerRowBoolean = powerRowBoolean;
        let columnKeys = ['blank'];
        let columnHeaders = [''];
        let k = 0;
        let columnProportions = [2];
        for (k = 0; k < numResistors; k++) {
            columnKeys.push(alphabetArray[k]);
            columnHeaders.push(`Resistor ${alphabetArray[k]}`);
            columnProportions.push(3);
        }
        columnProportions.push(3);
        columnKeys.push('total');
        columnHeaders.push('Total');
        super.setColumnProportions(columnProportions);

        let rowKeys = ['blank','voltage', 'current', 'resistance'];
        let rowHeaders = ['','Voltage (Volts)', 'Current (Amps)', 'Resistance (Ohms)'];
        if (powerRowBoolean) {
            rowKeys.push('power');
            rowHeaders.push('Power (Watts)');
        }

        if (powerRowBoolean) {
            super.setRowProportions([1,2,2,2,2]);
        } else {
            super.setRowProportions([1,2,2,2]);
        }

        super.assignAllRowKeys(rowKeys);
        super.addSideHeaders(rowHeaders);
        super.assignAllColumnKeys(columnKeys);
        super.addTopHeaders(columnHeaders);

        super.setClassOfAllCells('electricCircuitTable');
        super.setClassOfTopRow('electricCircuitTableTopHeader');
        super.setClassOfLeftColumn('electricCircuitTableSideHeader');

        super.makeFirstRowHeaders();
        super.makeFirstColumnHeaders();
        super.shadeUpperLeftCorner();

    }


    fillInVoltageRow(valuesArray) {
        valuesArray.unshift(undefined);
        super.writeTextInRow(1, valuesArray);
    }
    fillInCurrentRow(valuesArray) {
        valuesArray.unshift(undefined);
        super.writeTextInRow(2, valuesArray);
    }
    fillInResistanceRow(valuesArray) {
        valuesArray.unshift(undefined);
        super.writeTextInRow(3,valuesArray);
    }
    fillInPowerRow(valuesArray) {
        valuesArray.unshift(undefined);
        super.writeTextInRow(4, valuesArray);
    }

}

class EnergyTable extends Table {
    constructor(numPoints, columnTypes) {
        super(1 + numPoints, 1 + columnTypes.length);
        this.numPoints = numPoints;
        this.columnTypes = columnTypes;

        super.assignColumnKey(0, 'points');
        let k;
        for (k = 0; k < columnTypes.length; k++) {
            super.assignColumnKey(k + 1, columnTypes[k])
        }
        let rowKeys = alphabetArray.slice(0,numPoints);
        rowKeys.unshift('top');
        super.assignAllRowKeys(rowKeys);

        const selectionObject = {
            'ke': 'Kinetic Energy (J)',
            'gpe': 'Gravitational Potential Energy (J)',
            'epe': 'Elastic Potential Energy (J)',
            'total_e': 'Total Energy (J)',
            'speed': 'Speed (m/s)',
            'height': 'Height (m)',
            'length': 'Length (m)',
            'direction': 'Direction'
        };

        let sideHeaders = [''];
        let i;
        for (i = 0; i < numPoints; i++) {
            sideHeaders.push(alphabetArray[i]);
        }
        super.addSideHeaders(sideHeaders);

        let topHeaders = [''];
        let j;
        for (j = 0; j < columnTypes.length; j++) {
            if (selectionObject[columnTypes[j]]) {
                topHeaders.push(selectionObject[columnTypes[j]]);
            } else {
                topHeaders.push(columnTypes[j]);
            }
        }
        super.addTopHeaders(topHeaders);

        super.shadeUpperLeftCorner();

        // i just need to make this look a lot nicer etc.
    }

    addInfoToColumn(columnKey, infoArray) {
        let q;
        let columnIndex = this.columnKeys[columnKey];
        for (q = 1; q <= this.numPoints; q++) {
            super.writeTextInCell(q, columnIndex, infoArray[q - 1]);
        }
    }

    addInfoToRow(rowKey, infoArray) {
        let q;
        let rowIndex = this.rowKeys[rowKey];
        for (q = 1; q < this.numPoints; q++) {
            super.writeTextInCell(rowIndex, q, infoArray[q - 1]);
        }
    }
}

class MomentumTable extends Table {
  constructor() {
    super(5,6);

    this.setNameOfObjects("Car A", "Car B");

    super.mergeBelow(0,0);
    super.shadeUpperLeftCorner();
    super.addSideHeaders(["","","mass (kg)","velocity (m/s)", "momentum (kg m/s)"]);
    super.mergeRight(0,1);
    super.mergeRight(0,4);
    super.writeTextInRow(0,["","Before Collision","","","After Collision", ""]);
    super.mergeBelow(0,3);
    super.mergeBelow(0,3);
    super.mergeBelow(0,3);
    super.writeTextInCell(0,3,'Total Momentum');
  }

  // default is
  // object1 = car A
  //object 2 = car B
  setNameOfObjects(object1, object2) {
    this.object1 = object1;
    this.object2 = object2;
    super.writeTextInRow(1,["",object1,object2,"",object1, object2]);
  }

  makeTotallyInelasticCollision() {
    super.mergeRight(1,4);
    super.mergeRight(2,4);
    super.mergeRight(3,4);
    super.mergeRight(4,4);
    super.writeTextInCell(1,4,`${this.object1} and ${this.object2}`);
  }

}
