let term1 = "0";
let term2 = undefined;

let error = false;

function add(a, b) {
  return +a + +b;
}

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
    default:
      result = a;
      break;
  }

  if (repeated) {
    let operator;
    switch (operation) {
      case "add":
        operator = "+";
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
    if (!currentOperator && lastOperator) repeated = true;
    operate(currentOperator ?? lastOperator, term1, term2);
    if (!error) {
      operatorHistory.textContent += " =";
    }
    currentOperator = null;
});

const operators = document.querySelectorAll('.operator');

let currentOperator;
let lastOperator;
function operatorSelected(operator) {
  if (currentOperator === operator.value) return;
  if (currentOperator && currentOperator !== operator.value) {
    operatorHistory.textContent = operatorHistory.textContent.slice(0, operatorHistory.textContent.length-1) + operator.textContent;
    currentOperator = operator.value;
  }
  if (!currentOperator) {
    currentOperator = operator.value;
    operatorHistory.textContent = ` ${term1} ${operator.textContent}`;
    return;
  }
}
operators.forEach((operator) => operator.addEventListener('click', () => operatorSelected(operator)));

function addDigit(digit) {
  // Ignore repeated leading zeroes
  if (digit === "0") {
    if (currentOperator)
      if (term2 === "0") return;
    else if (term1 === "0") return;
  }

  if (currentOperator) 
    if (!term2) term2 = digit;
    else term2 = (term2 === "0") ? digit : term2 + digit;
  else
    if (!term1) term1 = digit;
    else term1 = (term1 === "0") ? digit : term1 + digit;

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
  currentOperator = null;
  lastOperator = null;
  clearOutput();
}
clearButton.addEventListener('click', clear);

function updateOutputText() {
  outputText.textContent = (currentOperator && term2) ?? term1;
}

function clearOutput() {
  operatorHistory.textContent = "";
  outputText.textContent = "0";
}

