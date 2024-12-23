/*
to do:
build and test prime factorization and greatest common factor functions
*/

function isInteger(number) {
  return number % 1 === 0
}

// produces a list of prime numbers up to the upper bound
// uses the seive of eratothanes
function listOfPrimes(upperBound) {
  let allNumbers = [undefined,undefined];
  let i;
  for (i = 2; i <= upperBound; i++) {
    allNumbers.push(true);
  }
  let p, q, k;
  let listOfPrimes = [];
  for (p = 2; p <= upperBound; p++) {
    if (allNumbers[p]) {
      listOfPrimes.push(p);
      for (q = p * 2; q <= upperBound; q += p) {
        allNumbers[q] = false;
      }
    }
  }
  return listOfPrimes
}

const primesUpTo100 = listOfPrimes(100);
const primesUpTo1000 = listOfPrimes(1000);


function isNumberPrime(number) {
  if (number <= 1000) {
    if (primesUpTo1000.includes(number)) {
      return true
    } else {
      return false
    }
  } else {
    let primeLimit
    if (number % 2 === 0) {
      return false
    } else {
      primeLimit = (number + 1) / 2;
      const list = listOfPrimes(primeLimit); // you only actually need to go to half of the number,
      let k;
      for (k = 0; k < list.length; k++) {
        if (number % list[k] === 0) {
          return false
        }
      }
      return true
    }
  }
}

//
//
//
// function primeFactorization(number) {
//   if (!isInteger(number)) {
//     throw new Error('Can only find prime factorization of integers');
//     return false
//   }
//   let currentNumber = number;
//   let primeFactorization = {};
//   if (number <= 100) {
//     const listOfPrimes = primesUpTo100;
//   } else {
//     const listOfPrimes = listOfPrimes(number); /// inefficient method
//   }
//   listOfPrimes.forEach((prime) => {
//     if (currentNumber % prime === 0) {
//       primeFactorization[prime] = 1;
//       currentNumer /= prime;
//       while(currentNumber % prime === 0) {
//         primeFactorization[prime] += 1;
//         currentNumber /= prime;
//       }
//     }
//     if (currentNumber === 1) {
//       return undefined
//     }
//   });
//   return primeFactorization
// }
//
//
// function getNumberFromPrimeFactorization(primeFactorization) {
//   let currentNumber = 1;
//   let k;
//   Object.keys(primeFactorization).forEach((prime) => {
//     for (k = 1; k <= primeFactorization[prime]; k++) {
//       currentNumber *= prime;
//     }
//   });
//   return currentNumber
// }
//
// // must be all integers
// function commonPrimeFactorization(number, anotherPrimeFactorization) {
//   const primeFactorization1 = primeFactorization(number1);
//   const primeFactorization2 = anotherPrimeFactorization;
//   const primeFactorization1Keys = Object.keys(primeFactorization1);
//   const primeFactorization2Keys = Object.keys(primeFactorization2);
//   let commonPrimeFactorization = {};
//   primeFactorization1Keys.forEach((key) => {
//     if (primeFactorization2Keys.includes(key)) {
//       commonPrimeFactorization[key] = minOfTwoValues(primeFactorization1[key], primeFactorization2[key]);
//     }
//   });
//   return commonPrimeFactorization
// }
//
// function lowestCommonFactor(arrayOfNumbers) {
//   let currentResult = primeFactorization(arrayOfNumbers[0]);
//   let w;
//   for (w = 1; w < arrayOfNumbers.length; w++) {
//     currentResult = commonPrimeFactorization(currentResult, arrayOfNumbers[w]);
//   }
//   return getNumberFromPrimeFactorization(currentResult)
// }
//
