let term1 = "0";
let term2 = undefined;
let newTerm = undefined;

let error = false;

function add(a, b) {
  return +a + +b;
}

function divide(a, b) {
  if (b === "0") {
    calcError('Cannot divide by zero');
    return NaN;
  }
  return +a / +b;
}

function multiply(a, b) {
  return +a * +b;
}

function subtract(a, b) {
  return +a - +b;
}

function calcError(msg) {
  error = true;
  console.warn(msg);
  outputText.textContent = msg;
}

let lastOperator;
let repeated;
function operate(operation, a, b) {
  if (b === undefined) {
    b = a;
  }

  let result;
  switch (operation) {
    case "add":
      result = add(a, b);
      break;
    case "divide":
      result = divide(a, b);
      break;
    case "multiply":
      result = multiply(a, b);
      break;
    case "subtract":
      result = subtract(a, b);
      break;
    default:
      result = +a;
      break;
  }

  if (error) return NaN;

  if (repeated) {
    let operator;
    switch (operation) {
      case "add":
        operator = "+";
        break;
      case "divide":
        operator = "/";
        break;
      case "multiply":
        operator = "*";
        break;
      case "subtract":
        operator = '-';
        break;
    }
    if (operator) operatorHistory.textContent = `${a} ${operator} ${b}`
  }
  else operatorHistory.textContent += ` ${b}`;

  term1 = result.toString();

  lastOperator = operation;
  currentOperator = null;
  updateOutputText();

  return result;
}
const equalsButton = document.getElementById('equals');
equalsButton.addEventListener('click', () => {
    if (error) {
      clear();
      return;
    }
    if (!currentOperator) {
      if (lastOperator) repeated = true;
      term1 = newTerm ?? term1;
      newTerm = undefined;
    }
    if ((currentOperator || lastOperator) && !term2) term2 = newTerm ?? term1;
    newTerm = undefined;
    operate(currentOperator ?? lastOperator, term1, term2);
    repeated = false;
    if (!error) {
      if (!currentOperator && !lastOperator) operatorHistory.textContent = `${term1} =`;
      else operatorHistory.textContent += " =";
    }
    currentOperator = null;
});

const operators = document.querySelectorAll('.operator');

let currentOperator;
function operatorSelected(operator) {
  if (error) return;
  if (currentOperator === operator.value) {
    if (newTerm) {
      console.log(newTerm);
      term2 = newTerm;
      newTerm = undefined;
      operate(currentOperator, term1, term2);
    }
  }
  if (currentOperator && currentOperator !== operator.value) {
    if (newTerm) {
      term2 = newTerm;
      newTerm = undefined;
      operate(currentOperator, term1, term2);
    }
    else {
      currentOperator = operator.value;
      operatorHistory.textContent = operatorHistory.textContent.slice(0, operatorHistory.textContent.length-1) + operator.textContent;
    }
  }
  if (!currentOperator) {
    currentOperator = operator.value;
    if (newTerm) term1 = newTerm;
    operatorHistory.textContent = ` ${term1} ${operator.textContent}`;
    newTerm = undefined;
    term2 = undefined;
  }
}
operators.forEach((operator) => operator.addEventListener('click', () => operatorSelected(operator)));

const decimalButon = document.getElementById('decimal');
function addDecimal() {
  if (error) return;

  if (!newTerm) newTerm = "0.";
  else {
    if (newTerm.includes('.')) return;
    else newTerm += '.';
  }

  updateOutputText();
}
decimalButon.addEventListener('click', addDecimal);

function addDigit(digit) {
  if (error) {
    clear();
  }

  // Ignore repeated leading zeroes
  if (digit === "0" && newTerm === "0") return;

  if (!newTerm) newTerm = digit;
  else newTerm = (newTerm === "0") ? digit : newTerm + digit;

  updateOutputText();
}

let digits = document.querySelectorAll('.digit');
digits.forEach((digit) => digit.addEventListener('click', () => addDigit(digit.value)));

const operatorHistory = document.getElementById('operatorHistory');
const outputText = document.getElementById('outputText');
const clearButton = document.getElementById('clear');
function clear() {
  term1 = "0";
  term2 = undefined;
  newTerm = undefined;
  currentOperator = null;
  lastOperator = null;
  error = false;
  clearOutput();
}
clearButton.addEventListener('click', clear);

function updateOutputText() {
  outputText.textContent = newTerm ?? ((currentOperator && term2) ?? term1);
}

function clearOutput() {
  operatorHistory.textContent = "";
  outputText.textContent = "0";
}

