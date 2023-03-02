let display = document.querySelector(".display p");
let buttonsContainer = document.querySelector(".container");
let tempValue = "";
let firstNumber = "";
let secondNumber = "";
let firstOperator = false;
let operator;
let lastValue = "";

const allOperations = ['+', '-', '*', '/'];
const allOperators = ['+', '-', '*', '/', '='];
const allValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];

buttonsContainer.addEventListener("click", (e) => {
  e.target.value != undefined ? updateCalculator(e.target.value) : -1
});

function updateCalculator(value) {  
    //check for reset conditions
    checkForReset(value);
    // check for on display errors  
    checkError(display.textContent);    
    if (checkClear(value)) {      
      return;
    }
    // checks Equal operator special cases    
    if (checkEqualsOperator(value)) {
      return;
    }
    // check for operate command
    if (checkForOperate(value)){
      return;
    }    
    // check decimals
    if(checkDecimal(value)) {
      return;
    };
    // updates display
    if (checkForDisplayUpdates(value)){
      return;
    }    
  }


function operate(first, second, operator) {
  first = formatNumber(first);
  second = formatNumber(second);
  if (operator === "+") {
    return first + second;
  } else if (operator === "-") {
    return first - second;
  } else if (operator === "/") {
    let result = first / second;
    if (!isFinite(result) || isNaN(result)) {
      return "Error";
    } else {
      return first / second;
    }
  } else if (operator === "*") {
    return first * second;
  }
}

function checkForOperate(value){
  if (allOperators.includes(value)) {
    if (firstNumber !== "" && secondNumber !== "" && firstOperator) {
      firstNumber = formatNumber(operate(firstNumber, secondNumber, operator));
      value === "=" ? operator = "" : operator = value;
      display.textContent = `${firstNumber} ${operator}`;
      secondNumber = "";
      return true;
    }
  }
}

function checkClear(value) {
  if (value === "clear") {
    tempValue = "";
    firstNumber = "";
    secondNumber = "";
    firstOperator = false;
    operator = "";
    display.textContent = "0";
    lastValue = "";
    return true;
  }  
}

function checkEqualsOperator(value) {
  if (value === "=" && firstNumber === "") {
    return true;
  } else if (value === "=" && secondNumber === "") {
    return true;
  }

}

function checkDecimal(value) {
  if (value === ".") {
    if (firstNumber === "") {
      if (tempValue === "") {
        tempValue = "0";
      }
      if (tempValue.indexOf(".") >= 0) {
        return true;
      }
    }
    if (secondNumber.indexOf(".") >= 0) {
      return true;
    }
  }
}

function checkForDisplayUpdates(value) {
  if (allOperations.includes(value)) {
    if (tempValue !== "") {
      firstNumber = display.textContent.replace(/[&\/\\#,+\-()$~%'":*?<>{}]/g,"");
      firstOperator = true;
      operator = value;
      display.textContent = `${firstNumber} ${operator}`;
      return true;
    }
    if (firstNumber !== "" && firstOperator && secondNumber === "") {
      operator = value;
      display.textContent = `${firstNumber} ${operator}`;
      return true;
    }
  } else if (firstNumber === "") {
    tempValue = (tempValue + value).replace(/^0+(\d)/, "$1");
    display.textContent = tempValue;
  } else {
    if (value === "." && secondNumber === "") {
      secondNumber = "0";
    }
    secondNumber = (secondNumber + value).replace(/^0+(\d)/, "$1");
    display.textContent = `${firstNumber} ${operator} ${secondNumber}`;
  }
}

function checkForReset(value) {
  if (firstNumber !== "" && firstOperator && operator === "" && allValues.includes(value)) {
    checkClear("clear");    
  }
}

function checkError(value) {
  if (value.trim() === "Error") {
    checkClear("clear");
  }
}

function formatNumber(number) {
  if (isNaN(number)) {
    checkClear("clear");
    return number;
  } else {
    return Math.round(number * 100 + Number.EPSILON) / 100;
  }
}
