let display = document.querySelector(".display p");
let buttons = document.querySelectorAll("button");
let tempValue = "";
let firstNumber = "";
let secondNumber = "";
let firstOperator = false;
let operator;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    updateCalculator(button.value);
  });
});

function updateCalculator(value) {
  checkError(display.textContent);
  if (value == "clear") {
    clear();
    return;
  }
  if (value === "=" && firstNumber === "") {
    return;
  }  
  if (
    value == "+" ||
    value == "-" ||
    value == "/" ||
    value == "*" ||
    value == "="
  ) {
    if (firstNumber !== "" && secondNumber !== "" && firstOperator) {
      firstNumber = formatNumber(operate(firstNumber, secondNumber, operator));
      if(value !== "=") {
        operator = value
      } 
      display.textContent = `${firstNumber} ${operator}`;
      secondNumber = "";
      return;
    }
  }
  if (value === "=" && secondNumber === "") {
    return;
  }
  // decimal logic
  if (value === ".") {
    if (firstNumber === "") {
      if (tempValue === "") {
        tempValue = "0";
      }
      if (tempValue.indexOf(".") >= 0) {
        return;
      }
    }
    if (secondNumber.indexOf(".") >= 0) {
        return;
    };            
  }
  if (value == "+" || value == "-" || value == "/" || value == "*") {
    if (tempValue !== "") {
      firstNumber = display.textContent.replace(/[&\/\\#,+\-()$~%'":*?<>{}]/g, "");      
      firstOperator = true;
      operator = value;
      display.textContent = `${firstNumber} ${operator}`;
      return;
    }
    if (firstNumber !== "" && firstOperator && secondNumber === "") {
      operator = value;
      display.textContent = `${firstNumber} ${operator}`;
      return;
    }    
  } else if (firstNumber === "") {
    tempValue = (tempValue + value).replace(/^0+(\d)/, '$1');
    display.textContent = tempValue;
  } else {
    if (value === ".") {
      secondNumber = "0";
    }
    secondNumber = (secondNumber + value).replace(/^0+(\d)/, '$1');
    display.textContent = `${firstNumber} ${operator} ${secondNumber}`;
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

function clear() {
  tempValue = "";
  firstNumber = "";
  secondNumber = "";
  firstOperator = false;
  operator = "";
  display.textContent = "0";
}

function checkError(value) {
  if (value.trim() == "Error") {
    clear();
  }
}

function formatNumber(number) {
  if (isNaN(number)) {
    clear();
    return number;
  } else {
    return Math.round(number * 100 + Number.EPSILON) / 100;
  }
}
