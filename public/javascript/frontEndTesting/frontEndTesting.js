/*
Classes and Methods to test my mathematical and physics programs on the front end

Requires JQuery and Bootstrap to use
 */

class Test {
    constructor(name, pass,failMessage) {
        this.name = name;
        this.pass = pass;
        this.failMessage = failMessage;

        try {
            if (!this.pass) {
                throw new Error(`failed test: ${this.name}`);

            }
        } catch (err) {
            console.log(err);
        }
    }

}


class TestPackage {
    constructor(name) {
        this.name = name;
        this.unattachedTests = [];
        this.categories = {};
        this.totalTests = 0;
    }

    addCategory(key, name) {
        if (Object.keys(this.categories).includes(key)) {
            return false
        } else {
            this.categories[key] = {
                name: name,
                unattachedTests: [],
                subCategories: {}
            };
        }
    }

    // add default name based on the category key
    addSubCategory(categoryKey, key, name) {
        if (!this.categories[categoryKey]) {
            return false
        } else if (Object.keys(this.categories[categoryKey].subCategories).includes(key)) {
            return false
        } else {
            this.categories[categoryKey].subCategories[key] = {
                name: name,
                tests: []
            };
        }
    }

    // add default name based on the category keys
    // private method
    addTest(newTest, categoryKey, subCategoryKey) {
        if (categoryKey && this.categories[categoryKey]) {
            if (subCategoryKey && this.categories[categoryKey].subCategories[subCategoryKey]) {
                this.categories[categoryKey].subCategories[subCategoryKey].tests.push(newTest);
            } else {
                this.categories[categoryKey].unattachedTests.push(newTest);
            }
        } else {
            this.unattachedTests.push(newTest);
        }
        this.totalTests++;
        if (this.totalTests % 10 === 0) { // every ten tests, automatically count all??? useful???
            this.countAllTests();
        }
    }

    testDefaultName(categoryKey, subCategoryKey) {
        let name;
        if (categoryKey && this.categories[categoryKey]) {
            let categoryName = this.categories[categoryKey].name;
            if (subCategoryKey && this.categories[categoryKey].subCategories[subCategoryKey]) {
                let subCategoryName = this.categories[categoryKey].subCategories[subCategoryKey].name;
                name = `${categoryName}: ${subCategoryName} Test ${this.categories[categoryKey].subCategories[subCategoryKey].tests.length + 1}`;
            } else {
                name = `${categoryName} Unattached Test ${this.categories[categoryKey].unattachedTests.length + 1} ${subCategoryKey ? `Subcategory Key ${subCategoryKey}` : ''}`;
            }
        } else {
            name = `Unattached Test ${this.unattachedTests.length + 1} ${categoryKey ? `Category Key ${categoryKey}` : ''} ${subCategoryKey ? `Subcategory Key ${subCategoryKey}` : ''}`;
        }
        return name;
    }

    // add failure message
    assertEqualStrict(entered, expected, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey)) {
        const pass = entered === expected;
        let failMessage;
        if (!pass) {
            failMessage = `value ${entered} entered; expected ${expected}`;
        }
        this.addTest(new Test(name, pass, failMessage), categoryKey, subCategoryKey);
    }

    assertTrue(trueVariable, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey)) {
        this.assertEqualStrict(trueVariable, true, categoryKey, subCategoryKey, name);
    }

    assertFalse(falseVariable, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey)) {
        this.assertEqualStrict(falseVariable, false, categoryKey, subCategoryKey, name);
    }

    assertUndefined(undefinedVariable, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey)) {
        this.assertEqualStrict(undefinedVariable, undefined, categoryKey, subCategoryKey, name);
    }
    assertNotEqualStrict(entered, notExpected, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey)) {
        const pass = entered !== expected;
        let failMessage;
        if (!pass) {
            failMessage = `Not Equal Strict Fail: value ${entered} entered; did not expect ${expected}`;
        }
        this.addTest(new Test(name, pass, failMessage), categoryKey, subCategoryKey);
    }

    // add failure message
    assertEqualFloat(entered,expected, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey), limit = 1e-15) {
        const pass = Math.abs(entered - expected) < limit;
        let failMessage;
        if (!pass) {
            failMessage = `value ${entered} entered; expected ${expected}`;
        }
        this.addTest(new Test(name, pass, failMessage), categoryKey, subCategoryKey);
    }

    assertEqualArraysStrict(entered, expected, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey)) {
      let pass, failMessage;
      if (typeof(entered) !== 'object') {
        failMessage = 'Entered variable not of type object';
        pass = false;
      } else if (typeof(expected) !== 'object') {
        failMessage = 'Expected variable not of type object';
        pass = false;
      } else if (entered.length === undefined) {
        failMessage = 'Entered object not an array';
        pass = false;
      } else if (expected.length === undefined) {
        failMessage = 'Entered object not an array';
        pass = false;
      } else if (entered.length !== expected.length) {
        failMessage = `Entered array of length ${entered.length}; expected array of length ${expected.length}`;
        pass = false;
      } else {
        let j;
        failMessage = '';
        pass = true;
        for (j = 0; j < entered.length; j++) {
          if (entered[j] !== expected[j]) {
            failMessage = failMessage + 'Entered array element ${j} = ${entered[j]}; expected array element ${j} = ${expected[j]}';
            if (failMessage.length > 100) { // 100 characters total
              break;
            }
            pass = false;
          }
        }
      }
      this.addTest(new Test(name, pass, failMessage), categoryKey, subCategoryKey);
    }

    addFailedTest(categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey), message) {
      let newTest = new Test(name, false, message);
      this.addTest(newTest, categoryKey, subCategoryKey);
    }

    assertMeasurement(measurement, equalObject, categoryKey, subCategoryKey, name = `${measurement.printOptimal()}: `) {
      // add check that it is an object
      if (typeof(measurement) !== 'object') {
        this.addFailedTest(categoryKey, subCategoryKey, name, "Non-Object Entered For Measurement");
        return false
      }
      if (typeof(equalObject) !== 'object') {
        this.addFailedTest(categoryKey, subCategoryKey, name, "Non-Object Entered For Equal Object");
        return false
      }
      this.assertTrue(measurement.isAmeasurement, true, categoryKey, subCategoryKey, `${name}: isAmeasurement`);
      if (equalObject.numSigFigs !== undefined) {
        this.assertEqualStrict(measurement.getNumSigFigs(), equalObject["numSigFigs"], categoryKey, subCategoryKey, `${name}: Number of Sig Figs: `);
      }
      if (equalObject.firstSigFig !== undefined) {
        this.assertEqualStrict(measurement.getFirstSigFig(), equalObject["firstSigFig"], categoryKey, subCategoryKey, `${name}: first sig fig:`);
      }
      if (equalObject.otherSigFigs !== undefined) {
        this.assertEqualStrict(measurement.getOtherSigFigs(), equalObject["otherSigFigs"], categoryKey, subCategoryKey, `${name}: other sig figs:`);
      }
      if (equalObject.orderOfMagnitude !== undefined) {
        this.assertEqualStrict(measurement.getOrderOfMagnitude(), equalObject["orderOfMagnitude"], categoryKey, subCategoryKey, `${name}: order of magnitude: `);
      }
      if (equalObject.lowestKnownMagnitude !== undefined) {
          this.assertEqualStrict(measurement.getLowestKnownMagnitude(), equalObject["lowestKnownMagnitude"], categoryKey, subCategoryKey, `${name}: lowest known magnitude: `);
      }
      if (equalObject.positive !== undefined) {
        this.assertEqualStrict(measurement.isPositive(), equalObject["positive"], categoryKey, subCategoryKey, `${name}: Positive `);
      }
        if (equalObject.infinity !== undefined) {
            this.assertEqualStrict(measurement.isInfinity(), equalObject["infinity"], categoryKey, subCategoryKey, `${name}: Infinity `);
        }
        if (equalObject.exact !== undefined) {
            this.assertEqualStrict(measurement.isExact(), equalObject["exact"], categoryKey, subCategoryKey, `${name}: Exact `);
        }
        if (equalObject.zero !== undefined) {
          this.assertEqualStrict(measurement.isZero(), equalObject["zero"], categoryKey, subCategoryKey, `${name}: Zero `);
        }
        if (equalObject.float !== undefined) {
          if (measurement.isZero()) {
              this.assertEqualFloat(measurement.getFloat(), equalObject["float"], categoryKey, subCategoryKey, `${name}: Float`, 1e-15);
          } else if (measurement.isInfinity()) {
              this.assertEqualStrict(measurement.getFloat(), equalObject["float"], categoryKey, subCategoryKey, `${name}: Float`);
          } else {
              this.assertEqualFloat(measurement.getFloat(), equalObject["float"], categoryKey, subCategoryKey, `${name}: Float`, 10**(measurement.getOrderOfMagnitude() - 15));
          }
      }

      if (equalObject.printStandard !== undefined) {
        this.assertEqualStrict(measurement.printStandardNotation(), equalObject.printStandard, categoryKey, subCategoryKey, `${name}: Print Standard `)

      }
      if (equalObject.printScientific !== undefined) {
        this.assertEqualStrict(measurement.printScientificNotation(), equalObject.printScientific, categoryKey, subCategoryKey, `${name}: Print Scientific `)
      }
      if (equalObject.printOptimal !== undefined) {
        this.assertEqualStrict(measurement.printOptimal(), equalObject.printOptimal, categoryKey, subCategoryKey, `${name}: Print Optimal `)
      }
    }

    assertMeasurementZero(zeroMeasurement, numSigFigs, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey)) {
        let otherSigFigs, exact = undefined;
        if (numSigFigs !== Infinity) {
            otherSigFigs = makeStringOfZeros(numSigFigs - 1);
            exact = false;
        } else {
            otherSigFigs = '';
            exact = true;
        }
        this.assertMeasurement(zeroMeasurement, {
            firstSigFig: '0',
            otherSigFigs: otherSigFigs,
            numSigFigs: numSigFigs,
            exact: exact,
            zero: true,
            positive: false,
            negative: false,
            orderOfMagnitude: undefined,
            lowestKnownMagnitude: undefined,
            float: 0
        }, categoryKey, subCategoryKey, name);
        this.assertUndefined(zeroMeasurement.getOrderOfMagnitude(), categoryKey, subCategoryKey, `${name}: orderOfMagnitude`);
        this.assertUndefined(zeroMeasurement.getLowestKnownMagnitude(), categoryKey, subCategoryKey, `${name}: lowestKnownMagnitude`);
    }

    assertNotMeasurement(notMeasurement, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey)) {
        if (typeof(notMeasurement) !== 'object') {
            this.addFailedTest(categoryKey, subCategoryKey, name, "Non-Object entered for Measurement");
            return false
        }
        this.assertFalse(notMeasurement.isAmeasurement, categoryKey, subCategoryKey, `${name}: isAmeasurement`);
        this.assertTrue(isNaN(notMeasurement.getFloat()), categoryKey, subCategoryKey, `${name}: Float`);
        this.assertUndefined(notMeasurement.getFirstSigFig(), categoryKey, subCategoryKey, `${name}: firstSigFig`);
        this.assertUndefined(notMeasurement.getOtherSigFigs(), categoryKey, subCategoryKey, `${name}: otherSigFigs`);
        this.assertUndefined(notMeasurement.getOrderOfMagnitude(), categoryKey, subCategoryKey, `${name}: orderOfMagnitude`);
        this.assertUndefined(notMeasurement.getLowestKnownMagnitude(), categoryKey, subCategoryKey, `${name}: lowestKnownMagnitude`);
        this.assertUndefined(notMeasurement.getNumSigFigs(), categoryKey, subCategoryKey, `${name}: numSigFigs`);
        this.assertUndefined(notMeasurement.isPositive(), categoryKey, subCategoryKey, `${name}: positive`);
    }

    assertAngle(angle, equalObject, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey)) {
        // add check that it is an object
        if (typeof(angle) !== 'object') {
            this.addFailedTest(categoryKey, subCategoryKey, name, "Non-Object Entered For Magnitude");
            return false
        }
        if (typeof(equalObject) !== 'object') {
            this.addFailedTest(categoryKey, subCategoryKey, name, "Non-Object Entered For Equal Object");
            return false
        }
        this.assertTrue(angle.isAnAngle, categoryKey, subCategoryKey, `${name}: isAnAngle`);

        this.assertMeasurement(angle.measurement, equalObject,categoryKey, subCategoryKey, name);

        if (equalObject.unit !== undefined) {
            this.assertEqualStrict(angle.getUnit(), equalObject["unit"], categoryKey, subCategoryKey, `${name}: unit:`);
        }
        if (equalObject.quadrant !== undefined) {
            this.assertEqualStrict(angle.getQuadrant(), equalObject["quadrant"], categoryKey, subCategoryKey, `${name}: quadrant:`);
        }
        if (equalObject.print !== undefined) {
            this.assertEqualStrict(angle.print(), equalObject["print"], categoryKey, subCategoryKey, `${name}: print:`);
        }
    }

    assertNotAngle(notAngle, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey)) {
      if (typeof(notAngle) !== 'object') {
          this.addFailedTest(categoryKey, subCategoryKey, name, "Non-Object entered for Angle");
          return false
      }
      this.assertFalse(notAngle.isAmeasurement, categoryKey, subCategoryKey, `${name}: isAnAngle`);
      this.assertUndefined(notAngle.measurement, categoryKey, subCategoryKey, `${name}: measurement`);
      this.assertUndefined(notAngle.unit, categoryKey, subCategoryKey, `${name}: measuredInDegrees`);
    }

    assertAngleZero(angleZero, numSigFigs, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey)) {
        if (typeof(angleZero) !== 'object') {
            this.addFailedTest(categoryKey, subCategoryKey, name, "Non-Object entered for Angle");
            return false
        }
        this.assertTrue(angleZero.isAnAngle, categoryKey, subCategoryKey, `${name}: isAnAngle: `);
        this.assertMeasurementZero(angleZero.measurement, numSigFigs, categoryKey, subCategoryKey, name);
    }


    assertDimension(dimension, equalObject, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey)) {
        if (typeof(dimension) !== 'object') {
            this.addFailedTest(categoryKey, subCategoryKey, name, "Non-Object entered for Dimension");
            return false
        }
        if (typeof(equalObject) !== 'object') {
            this.addFailedTest(categoryKey, subCategoryKey, name, "Non-Object Entered For Equal Object");
            return false
        }
        this.assertTrue(dimension.isAdimension, categoryKey, subCategoryKey, `${name}: isAdimension`);
        if (equalObject.name !== undefined) {
            this.assertEqualStrict(dimension.getName(), equalObject.name, categoryKey, subCategoryKey, `${name}: name: `);
        }
        if (equalObject.length !== undefined) {
            this.assertEqualStrict(dimension.getLengthPower(), equalObject.length, categoryKey, subCategoryKey, `${name}: length: `);
        }
        if (equalObject.time !== undefined) {
            this.assertEqualStrict(dimension.getTimePower(), equalObject.time, categoryKey, subCategoryKey, `${name}: time: `);
        }
        if (equalObject.mass !== undefined) {
            this.assertEqualStrict(dimension.getMassPower(), equalObject.mass, categoryKey, subCategoryKey, `${name}: mass: `);
        }
        if (equalObject.current !== undefined) {
            this.assertEqualStrict(dimension.getCurrentPower(), equalObject.current, categoryKey, subCategoryKey, `${name}: current: `);
        }
        if (equalObject.temperature !== undefined) {
            this.assertEqualStrict(dimension.getTemperaturePower(), equalObject.temperature, categoryKey, subCategoryKey, `${name}: temperature: `);
        }
        if (equalObject.intensity !== undefined) {
            this.assertEqualStrict(dimension.getIntensityPower(), equalObject.intensity, categoryKey, subCategoryKey, `${name}: intensity: `);
        }
        if (equalObject.amount !== undefined) {
            this.assertEqualStrict(dimension.getAmountPower(), equalObject.amount, categoryKey, subCategoryKey, `${name}: amount: `);
        }
        if (equalObject.base !== undefined) {
            this.assertEqualStrict(dimension.isBase(), equalObject.base, categoryKey, subCategoryKey, `${name}: is base: `)
        }
    }

    assertNotDimension(notDimension, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey)) {
        if (typeof(notDimension) !== 'object') {
            this.addFailedTest(categoryKey, subCategoryKey, name, "Non-Object entered for Dimension");
            return false
        }
        this.assertFalse(notDimension.isAdimension, categoryKey, subCategoryKey, `${name}: isAdimension`);
        this.assertUndefined(notDimension.getName(), categoryKey, subCategoryKey, `${name}: name: `);
        this.assertUndefined(notDimension.getDerivation(), categoryKey, subCategoryKey, `${name}: derivation`)
    }

    assertUnitName(unit, equalObject, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey)) {
        if (typeof(unit) !== 'object') {
            this.addFailedTest(categoryKey, subCategoryKey, name, "Non-Object entered for Unit");
            return false
        }
        if (typeof(equalObject) !== 'object') {
            this.addFailedTest(categoryKey, subCategoryKey, name, "Non-Object Entered For Equal Object");
            return false
        }
        this.assertTrue(unit.isAunit, categoryKey, subCategoryKey, `${name}: is a unit`);

        if (equalObject.name) {
            this.assertEqualStrict(unit.name, equalObject.name, categoryKey, subCategoryKey, `${name}: name`);
        }
        if (equalObject.abbreviation) {
            this.assertEqualStrict(unit.abbreviation, equalObject.abbreviation, categoryKey, subCategoryKey, `${name}: abbreviation`);
        }
        // can i do an 'assert measurement here?
        if (equalObject.SI) {
            this.assertEqualStrict(unit.SI, equalObject.SI, categoryKey, subCategoryKey, `${name}: SI`);
        }
        // if a unit is SI, then the conversion factor should be 1 with an infinite number of significant figures

        /// i need to test conversion factors
        // conversion factors should be written to a number of sig figs
    }

    /// assert unit conversion factor should be based on 'assert measurement'
        assertMagnitude(magnitude, equalObject, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey))
        {
            // add check that it is an object
            if (typeof (magnitude) !== 'object') {
                this.addFailedTest(categoryKey, subCategoryKey, name, "Non-Object Entered For Magnitude");
                return false
            }
            if (typeof (equalObject) !== 'object') {
                this.addFailedTest(categoryKey, subCategoryKey, name, "Non-Object Entered For Equal Object");
                return false
            }
            this.assertTrue(magnitude.isAmagnitude, true, categoryKey, subCategoryKey, `${name}: isAmagnitude`);
            this.assertMeasurement(magnitude.measurement, equalObject, categoryKey, subCategoryKey, name);
            if (equalObject.unitName) {
                this.assertEqualStrict(magnitude.unit.name, equalObject.unitName, categoryKey, subCategoryKey, `${name}: Unit Name`);
            }
            if (equalObject.SIfloat) { // float value of SI unit
                this.assertEqualFloat(magnitude.getSIfloat(), equalObject.SIfloat, categoryKey, subCategoryKey, `${name}: SI Float`); // NEED TO DEAL WITH LIMIT OR IT WIL FAIL
            }
            if (equalObject.unitless) {
                this.assertTrue(magnitude.isUnitless(), categoryKey, subCategoryKey, `${name}: unitless: `)
            }
        }

        assertMagnitudeZero(magnitude, numSigFigs, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey))
        {
            let otherSigFigs, exact = undefined;
            if (numSigFigs !== Infinity) {
                otherSigFigs = makeStringOfZeros(numSigFigs - 1);
            } else {
                otherSigFigs = '';
                exact = true;
            }
            this.assertMagnitude(magnitude, {
                'firstSigFig': '0',
                'otherSigFigs': otherSigFigs,
                'numSigFigs': numSigFigs,
                'exact': exact,
                'zero': true,
                'positive': undefined,
                orderOfMagnitude: undefined,
                float: 0
            }, categoryKey, subCategoryKey, name);

        }

        assertNotMagnitude(notMagnitude, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey))
        {
            this.assertEqualStrict(notMagnitude.isAmagnitude, false, categoryKey, subCategoryKey, `${name}: isAmagnitude`);
            this.assertEqualStrict(notMagnitude.firstSigFig, undefined, categoryKey, subCategoryKey), `${name}: firstSigFig`;
            this.assertEqualStrict(notMagnitude.otherSigFigs, undefined, categoryKey, subCategoryKey, `${name}: otherSigFigs`);
            this.assertEqualStrict(notMagnitude.orderOfMagnitude, undefined, categoryKey, subCategoryKey, `${name}: orderOfMagnitude`);
            this.assertEqualStrict(notMagnitude.numSigFigs, undefined, categoryKey, subCategoryKey, `${name}: numSigFigs`);
            this.assertEqualStrict(notMagnitude.positive, undefined, categoryKey, subCategoryKey, `${name}: positive`);
        }

        assertPoint(point, equalObject, categoryKey, subCategoryKey, name = this.testDefaultName(categoryKey, subCategoryKey))
        {
            if (typeof (point) !== 'object') {
                this.addFailedTest(categoryKey, subCategoryKey, name, "Non-Object Entered For Point");
                return false
            }
            if (typeof (equalObject) !== 'object') {
                this.addFailedTest(categoryKey, subCategoryKey, name, "Non-Object Entered For Equal Object");
                return false
            }
            this.assertTrue(point.isApoint, categoryKey, subCategoryKey, `${name}: isApoint `);
            if (equalObject.name !== undefined) {
                this.assertEqualStrict(point.name, equalObject.name, categoryKey, subCategoryKey, `${name}: name: `);
            }
            if (equalObject.x !== undefined) {
                this.assertMagnitude(point.x, equalObject.x, categoryKey, subCategoryKey, `${name}: point X magnitude: `);
            }
            if (equalObject.xIsZero !== undefined) {
                this.assertMagnitudeZero(point.x, equalObject.xIsZero, categoryKey, subCategoryKey, `${name}: point X magnitude zero: `);
            }
            if (equalObject.y !== undefined) {
                this.assertMagnitude(point.y, equalObject.y, categoryKey, subCategoryKey, `${name}: point Y magnitude: `);
            }
            if (equalObject.yIsZero !== undefined) {
                this.assertMagnitudeZero(point.y, equalObject.yIsZero, categoryKey, subCategoryKey, `${name}: point Y magnitude zero: `);
            }

            if (equalObject.quadrant !== undefined) {
                this.assertEqualStrict(point.getQuadrant(), equalObject.quadrant, categoryKey, subCategoryKey, `${name}: quadrant: `);
            }
        }


        // privateMethod!
        countAllTests()
        {
            let totalFails = 0;
            let totalPasses = 0;
            this.unattachedTests.forEach((test) => {
                if (test.pass) {
                    totalPasses++;
                } else {
                    totalFails++;
                }
            });
            Object.keys(this.categories).forEach((categoryKey) => {
                let thisCategory = this.categories[categoryKey];
                let categoryTotalPasses = 0;
                let categoryTotalFails = 0;
                thisCategory.unattachedTests.forEach((test) => {
                    if (test.pass) {
                        totalPasses++;
                        categoryTotalPasses++;
                    } else {
                        totalFails++;
                        categoryTotalFails++
                    }
                });
                Object.keys(thisCategory.subCategories).forEach((subCategoryKey) => {
                    let thisSubCategory = thisCategory.subCategories[subCategoryKey];
                    let subCategoryTotalPasses = 0;
                    let subCategoryTotalFails = 0;
                    thisSubCategory.tests.forEach((test) => {
                        if (test.pass) {
                            totalPasses++;
                            categoryTotalPasses++;
                            subCategoryTotalPasses++;
                        } else {
                            totalFails++;
                            categoryTotalFails++;
                            subCategoryTotalFails++;
                        }
                    });
                    thisSubCategory.subCategoryPasses = subCategoryTotalPasses;
                    thisSubCategory.subCategoryFails = subCategoryTotalFails;
                });
                thisCategory.categoryPasses = categoryTotalPasses;
                thisCategory.categoryFails = categoryTotalFails;
            });
            this.totalPasses = totalPasses;
            this.totalFails = totalFails;
        }

        /// PRIVATE METHOD
        getColorClass(numPasses, numFails)
        {
            let colorClass;
            if (numFails > 0) {
                colorClass = 'text-danger';
            } else if (numPasses > 0) {
                colorClass = 'text-success';
            } else {
                colorClass = 'text-dark';
            }
            return colorClass
        }

        /// PRIVATE METHOD
        printSingleTest(testObject)
        {
            let colorClass;
            let message = `${testObject.name}: `;
            if (testObject.pass) {
                colorClass = 'text-success';
                message = message + 'PASS ';
            } else {
                colorClass = 'text-danger';
                message = message + `FAIL: ${testObject.failMessage}`;
            }
            return $(`<li class = '${colorClass}'>${message}</li>`);
        }


        // start with just a list,
        // then move to something more advanced, like a card?
        printAllTests()
        {
            this.countAllTests();
            let newDiv = $("<div></div>");
            let overallColorClass = this.getColorClass(this.totalPasses, this.totalFails);
            $(newDiv).append($(`<h1 class = '${overallColorClass}'>${this.name}</h1>`));
            $(newDiv).append($(`<h3 class = '${overallColorClass}'>Total Pass: ${this.totalPasses}</h3>`));
            $(newDiv).append($(`<h3 class = '${overallColorClass}'>Total Fail: ${this.totalFails}</h3>`));
            let overallUL = $("<ul></ul>");
            Object.keys(this.categories).forEach((categoryKey) => {
                let thisCategory = this.categories[categoryKey];
                let categoryColorClass = this.getColorClass(thisCategory.categoryPasses, thisCategory.categoryFails);
                let categoryLI = $("<li></li>");
                $(categoryLI).append($(`<h2 class = ${categoryColorClass}>Category: ${thisCategory.name}</h2>`));
                $(categoryLI).append($(`<h4 class = '${categoryColorClass}'>Category Pass: ${thisCategory.categoryPasses}</h4>`));
                $(categoryLI).append($(`<h4 class = '${categoryColorClass}'>Category Fail: ${thisCategory.categoryFails}</h4>`));
                let categoryUL = $('<ul></ul>');
                Object.keys(thisCategory.subCategories).forEach((subCategoryKey) => {
                    let thisSubCategory = thisCategory.subCategories[subCategoryKey];
                    let subCategoryColorClass = this.getColorClass(thisSubCategory.subCategoryPasses, thisSubCategory.subCategoryFails);
                    let subCategoryLI = $("<li></li>");
                    $(subCategoryLI).append($(`<h2 class = ${subCategoryColorClass}>Subcategory: ${thisSubCategory.name}</h2>`));
                    $(subCategoryLI).append($(`<h4 class = '${subCategoryColorClass}'>Subcategory Pass: ${thisSubCategory.subCategoryPasses}</h4>`));
                    $(subCategoryLI).append($(`<h4 class = '${subCategoryColorClass}'>Subcategory Fail: ${thisSubCategory.subCategoryFails}</h4>`));
                    let subCategoryUL = $("<ul></ul>");
                    thisSubCategory.tests.forEach((test) => {
                        $(subCategoryUL).append(this.printSingleTest(test));
                    });
                    $(subCategoryLI).append(subCategoryUL);
                    $(categoryUL).append(subCategoryLI);
                });
                thisCategory.unattachedTests.forEach((test) => {
                    $(categoryUL).append(this.printSingleTest(test));
                });
                $(categoryLI).append(categoryUL);
                $(overallUL).append(categoryLI);
            });
            this.unattachedTests.forEach((test) => {
                $(overallUL).append(this.printSingleTest(test));
            });
            $(newDiv).append(overallUL);
            return newDiv
        }
}
